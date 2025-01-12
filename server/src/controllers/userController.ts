// controllers/userController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Register a new user (Admin can specify role)
export const registerUser = async (req: Request, res: Response) => {
  const { email, name, password, role } = req.body;

  try {
    // Validate role - Only allow certain roles for registration
    if (!["admin", "vendor", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

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
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token for authentication
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
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
};

// Get user profile (Vendor/Customer/Admin can view their profile)
export const getUserProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// Update user profile (Admin can update any user's profile, Vendor/Customer can update their own profile)
export const updateUserProfile = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const userId = req.user.userId;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: { user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role } },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
};

// Delete user profile (Only Admin can delete user profiles)
export const deleteUserProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const userId = req.user.userId;

    // Only admins can delete profiles
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only admins can delete profiles" });
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Error deleting user profile" });
  }
};

