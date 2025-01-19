import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient'; 
import bcrypt from 'bcryptjs'; 
import { verifyToken } from '../middlewares/authMiddleware'; 
import { body, validationResult } from 'express-validator'; 

const router = express.Router();

// Middleware for role validation
const verifyRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. Only ${role}s can access this.` });
    }
    next();
  };
};

// Middleware for input validation
const validateUserData = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
  body('role').isIn(['ADMIN', 'CUSTOMER', 'VENDOR']).withMessage('Invalid role'),
  body('name').notEmpty().withMessage('Name is required'),
];

// Middleware for vendor validation (check if vendor-specific fields are provided)
const validateVendorData = [
  body('businessName').notEmpty().withMessage('Business name is required for vendors'),
  body('businessAddress').notEmpty().withMessage('Business address is required for vendors')
];

// Route to create a new user (Admin only)
router.post("/create-user", verifyToken, verifyRole('ADMIN'), validateUserData, async (req: Request, res: Response) => {
  const { email, password, role, name } = req.body;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData: any = { email, password: hashedPassword, role, name };

    // If the user is a vendor, create vendor-specific data
    if (role === 'VENDOR') {
      newUserData.vendor = {
        create: {
          businessName: req.body.businessName,
          businessAddress: req.body.businessAddress,
        },
      };
    }

    const newUser = await prisma.user.create({
      data: newUserData,
      include: { vendor: true }, // Include vendor data for vendor users
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Route to update user info (Admin only)
router.put("/user/:id", verifyToken, verifyRole('ADMIN'), async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { email, role, name } = req.body; 

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedUserData: any = { email, role, name };

    if (role === 'VENDOR') {
      updatedUserData.vendor = {
        update: {
          businessName: req.body.businessName,
          businessAddress: req.body.businessAddress,
        },
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedUserData,
      include: { vendor: true },
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// Route to soft delete a user (Admin only)
router.delete("/user/:id", verifyToken, verifyRole('ADMIN'), async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }, // Soft delete by setting deletedAt field
    });

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Route to get all users (Admin only)
router.get("/users", verifyToken, verifyRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { vendor: true }, // Include vendor data if present
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get a user by ID (Admin only)
router.get("/user/:id", verifyToken, verifyRole('ADMIN'), async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendor: true },
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

// Route to get all products (Admin only)
router.get("/products", verifyToken, verifyRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, vendor: true }, // Include category and vendor data
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to create a new product (Admin only)
router.post("/create-product", verifyToken, verifyRole('ADMIN'), async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, categoryId } = req.body;

  if (!name || !description || !price || !imageUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });

    if (!category) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        category: { connect: { id: categoryId } },
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

// Route to soft delete a product (Admin only)
router.delete("/product/:id", verifyToken, verifyRole('ADMIN'), async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);

  try {
    const deletedProduct = await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() }, // Soft delete the product
    });

    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;
