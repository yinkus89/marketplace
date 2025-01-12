import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { protectRoute } from "../middlewares/protectRoute"; // Import the protectRoute middleware
import roleGuard from "../middlewares/roleGuard"; // Import the roleGuard middleware

const prisma = new PrismaClient();
const router = express.Router();

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
    req.body.role = role.toUpperCase(); // Convert role to uppercase before validation

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
        data: { email, name, password: hashedPassword, role: req.body.role }, // Use the normalized role
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
// Login Route
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
  
  
  // Example of a protected route that only ADMIN can access
  router.get('/admin-dashboard', protectRoute, roleGuard(['ADMIN']), (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Admin Dashboard!' });
  });
  
  // Example of a protected route that both VENDORS and ADMIN can access
  router.get('/vendor-dashboard', protectRoute, roleGuard(['ADMIN', 'VENDOR']), (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Vendor Dashboard!' });
  });
  
  // Example of a protected route accessible by all users (no roleGuard)
  router.get('/user-profile', protectRoute, (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to your profile!', user: req.user });
  });
  
  export default router;
  