// src/routes/authRoutes.ts
import express, { Request, Response } from 'express'; // Make sure Request and Response are imported
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  await registerUser(req, res);
});

// Login a user
router.post('/login', async (req: Request, res: Response) => {
  await loginUser(req, res);
});

export default router;

