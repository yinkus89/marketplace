import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer'; // Nodemailer for sending emails
import crypto from 'crypto'; // For generating random reset token

const prisma = new PrismaClient();

// Setup nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

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

// Forgot Password controller
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Find the user by email, which is a unique identifier
    const user = await prisma.user.findUnique({
      where: { email }, // Use email to identify the user
    });

    if (!user) {
      return res.status(400).json({ message: 'No user found with that email address' });
    }

    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiration

    // Update user with reset token and expiration
    await prisma.user.update({
      where: { email }, // Use email here as well
      data: {
        resetToken,
        resetTokenExpiration,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email (you would need to implement the email sending logic here)
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending reset email' });
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    // Use findFirst to query by non-unique field (resetToken)
    const user = await prisma.user.findFirst({
      where: { resetToken: token },  // Searching by resetToken (non-unique field)
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Check token expiration
    if (user.resetTokenExpiration && Date.now() > user.resetTokenExpiration.getTime()) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear resetToken fields using user id
    await prisma.user.update({
      where: { id: user.id },  // Use user.id to uniquely identify the user
      data: {
        password: hashedPassword,
        resetToken: null,  // Clear the reset token after successful reset
        resetTokenExpiration: null,  // Clear the expiration time
      },
    });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
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
