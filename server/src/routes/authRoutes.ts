import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';  // Google OAuth client
import { protectRoute } from "../middlewares/protectRoute"; // Import the protectRoute middleware
import roleGuard from "../middlewares/roleGuard"; // Import the roleGuard middleware

const prisma = new PrismaClient();
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');  // Google Client ID

// Utility function for role validation (optionally can move it to a separate file)
const normalizeRole = (role: string): 'ADMIN' | 'CUSTOMER' | 'VENDOR' => {
  const validRoles = ['ADMIN', 'CUSTOMER', 'VENDOR'];
  return validRoles.includes(role.toUpperCase()) ? role.toUpperCase() as 'ADMIN' | 'CUSTOMER' | 'VENDOR' : 'CUSTOMER'; // Default to CUSTOMER
};

// Register Route
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('name').isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 and 20 characters'),
    body('password')
      .isLength({ min: 8 })
      .matches(/\d/).withMessage('Password must be at least 8 characters long and contain a number'),
    body('role')
      .isIn(['ADMIN', 'CUSTOMER', 'VENDOR'])
      .withMessage('Role must be one of: ADMIN, CUSTOMER, VENDOR')
  ],
  async (req: Request, res: Response) => {
    console.log('Received request body:', req.body); // Log the request body for debugging purposes

    // Normalize role to uppercase
    const { email, name, password, role } = req.body;
    const normalizedRole = normalizeRole(role); // Use utility function to normalize role

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user in the database
      const newUser = await prisma.user.create({
        data: { email, name, password: hashedPassword, role: normalizedRole }, // Use the normalized role
      });

      // Send success response
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
  }
);

// Login Route (Standard Login)
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Find the user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        console.log('User not found:', email);  // Log if user is not found
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      console.log('User found:', user);  // Log the found user details

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);  // Log the result of the password comparison

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: '1h' }
      );

      // Send success response with the token
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { token },
      });
    } catch (error) {
      console.error('Error in login route:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
});

// Google Login Route
router.post('/google-login', async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Verify the token using Google API
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Ensure this matches your Google Client ID
    });

    const payload = ticket.getPayload();
    const { email, name } = payload || {}; // Safely destructure, adding a fallback for payload

    if (!email || !name) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    // Check if the user already exists in your database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: '', // No password needed for Google login
          role: 'CUSTOMER',  // Default role, adjust if necessary
        },
      });
    }

    // Create a JWT token for the user
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const newToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token: newToken },
    });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({ message: 'Error logging in with Google' });
  }
});

// Protected Routes
// Admin Dashboard
router.get('/admin-dashboard', protectRoute, roleGuard(['ADMIN']), (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard!' });
});

// Vendor Dashboard (Both Admin and Vendor can access)
router.get('/vendor-dashboard', protectRoute, roleGuard(['ADMIN', 'VENDOR']), (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the Vendor Dashboard!' });
});

// Customer Dashboard (Accessible by all authenticated users)
router.get('/customer-dashboard', protectRoute, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  res.status(200).json({ message: 'Welcome to your profile!', user: req.user });
});

export default router;
