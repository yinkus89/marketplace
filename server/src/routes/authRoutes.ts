// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';  // Import the controller functions

const router = Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

export default router;
