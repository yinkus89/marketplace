import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library'; // Google OAuth client
import nodemailer from 'nodemailer';
import crypto from 'crypto'; // For generating reset tokens
import { protectRoute } from "../middlewares/protectRoute"; // Import the protectRoute middleware
import roleGuard from "../middlewares/roleGuard"; // Import the roleGuard middleware

const prisma = new PrismaClient();
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || ''); // Google Client ID

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
    const { email, name, password, role } = req.body;
    const normalizedRole = normalizeRole(role);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await prisma.user.create({
        data: { email, name, password: hashedPassword, role: normalizedRole },
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
  }
);

// Forgot Password Route
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Save the reset token and expiry time in the database
    await prisma.user.update({
      where: { email },
      data: { resetToken, tokenExpiry },
    });

    // Create the reset link
    const resetUrl = `http://localhost:4001/reset-password/${resetToken}`;

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the reset link to the user's email
    const mailOptions = {
      from: 'YourAppName <yourapp@example.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>If you didn't request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        tokenExpiry: { gte: new Date() }, // Check if the token is expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, tokenExpiry: null },
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

// Login Route (Standard Login)
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );
  // Determine which dashboard to redirect to based on the user's role
  let dashboardUrl = '';
  switch (user.role) {
    case 'ADMIN':
      dashboardUrl = '/admin-dashboard';
      break;
    case 'VENDOR':
      dashboardUrl = '/vendor-dashboard';
      break;
    case 'CUSTOMER':
      dashboardUrl = '/customer-dashboard';
      break;
    default:
      dashboardUrl = '/customer-dashboard'; // Default to customer if role is not defined
  }
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token ,dashboardUrl },
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
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload || {};

    if (!email || !name) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: '',
          role: 'CUSTOMER',
        },
      });
    }

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
