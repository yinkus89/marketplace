// src/routes/userRoute.ts
import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";  // Correct path to authMiddleware
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} from "../controllers/userController";  // Ensure correct import path to your controllers

const router = Router();

// Protected routes (need valid token)
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.delete("/profile", verifyToken, deleteUserProfile);

export default router;
