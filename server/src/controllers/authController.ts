import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Register controller
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, name, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword, role },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Get Profile controller
export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access, no user found in request' });
  }

  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Update Profile controller
export const updateProfile = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const userId = req.user.userId;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: { user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role } },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// Delete Profile controller
export const deleteProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const userId = req.user.userId;
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      success: true,
      message: 'User profile deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({ message: 'Error deleting user profile' });
  }
};
