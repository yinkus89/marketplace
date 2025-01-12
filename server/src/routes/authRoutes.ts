import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { protectRoute } from "../middlewares/protectRoute";  // Import the middleware from the new location

const prisma = new PrismaClient();
const router = Router();

// Rate limiting for auth routes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

router.use(authRateLimiter);

// Register a new user
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("name").isLength({ min: 3, max: 20 }).withMessage("Name must be 3-20 characters long"),
    body("password")
      .isLength({ min: 8 })
      .matches(/\d/).withMessage("Password must be at least 8 characters and include a number"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const SALT_ROUNDS = 12;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create new user
      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: { user: { id: newUser.id, email: newUser.email, name: newUser.name } },
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }
);

// Login a user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: { token },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  }
);

// Get user profile
router.get("/profile", protectRoute, async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access, no user found in request" });
  }

  try {
    const userId = req.user.userId; // Access safely
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name } },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// Update user profile
router.put("/profile", protectRoute, async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access, no user found in request" });
  }

  try {
    const userId = req.user.userId;

    // Update the user information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: { user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name } },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});

// Delete user profile
router.delete("/profile", protectRoute, async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access, no user found in request" });
  }

  try {
    const userId = req.user.userId;

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Error deleting user profile" });
  }
});

export default router;
