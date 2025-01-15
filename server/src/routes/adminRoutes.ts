import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient'; // Prisma client import
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing passwords
import { verifyToken } from '../middlewares/authMiddleware'; // Custom auth middleware to verify user
import { body, validationResult } from 'express-validator'; // Input validation

const router = express.Router();

// Middleware to check if the logged-in user is an admin
const adminRoleMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if req.user exists and has a role of 'ADMIN'
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: "Access denied. Only admins can access this." });
  }
  next();
};

// Middleware for input validation
const validateUserData = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
  body('role').isIn(['ADMIN', 'CUSTOMER', 'VENDOR']).withMessage('Invalid role'),
  body('name').notEmpty().withMessage('Name is required'), // Ensure name is included
];

// Create new user
router.post("/create-user", verifyToken, adminRoleMiddleware, validateUserData, async (req: Request, res: Response) => {
  const { email, password, role, name } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // If the role is 'VENDOR', we should ensure the user has vendor-related data
    const newUserData: any = {
      email,
      password: hashedPassword,
      role,
      name,
    };

    // If user is a vendor, create vendor-related data
    if (role === 'VENDOR') {
      newUserData.vendor = {
        create: {
          // Vendor-specific fields (You should update these according to your schema)
          businessName: req.body.businessName,
          businessAddress: req.body.businessAddress,
          // Add any other vendor-specific data here
        },
      };
    }

    const newUser = await prisma.user.create({
      data: newUserData,
      include: {
        vendor: true, // Include vendor data in the response
      },
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Update user info
router.put("/user/:id", verifyToken, adminRoleMiddleware, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { email, role, name } = req.body; // Include name in the update

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedUserData: any = {
      email,
      role,
      name,
    };

    // If user is being updated as a vendor, ensure vendor data is included
    if (role === 'VENDOR') {
      updatedUserData.vendor = {
        update: {
          // Update vendor-specific fields if needed
          businessName: req.body.businessName,
          businessAddress: req.body.businessAddress,
          // Add any other vendor-specific data here
        },
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedUserData,
      include: {
        vendor: true, // Include updated vendor data in the response
      },
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// Soft delete user
router.delete("/user/:id", verifyToken, adminRoleMiddleware, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }, // Soft delete the user by setting deletedAt
    });

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

router.get("/products", verifyToken, adminRoleMiddleware, async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,  // Include category information
        vendor: true,    // Include vendor information
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





// Get product by ID
// Example for finding a product and including vendor through the order
router.get("/product/:id", async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        orderItems: {
          include: {
            order: {
              include: {
                vendor: true,  // Include vendor through the order relation
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Get all users
router.get("/users", verifyToken, adminRoleMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        vendor: true, // Include vendor data for users with the 'VENDOR' role
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get a single user by ID
router.get("/user/:id", verifyToken, adminRoleMiddleware, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id); // Ensure the ID is a number

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        vendor: true, // Include vendor data if the user is a vendor
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Soft delete product
router.delete("/product/:id", verifyToken, adminRoleMiddleware, async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);

  try {
    const deletedProduct = await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() }, // Soft delete
    });

    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// Create new product
router.post("/create-product", async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, categoryId } = req.body;

  // Validate required fields
  if (!name || !description || !price || !imageUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create a new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        category: {
          connect: { id: categoryId }, // Connect to an existing category by categoryId
        },
      },
    });

    // Respond with the newly created product
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Error creating product" });
  }
});


export default router;
