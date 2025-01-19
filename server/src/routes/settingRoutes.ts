import express from 'express';
import { verifyToken, adminMiddleware } from '../middlewares/authMiddleware';  // Token verification middleware
import * as settingsController from '../controllers/settingsController';  // Controller import

const router = express.Router();

// Get all settings (Admin only)
router.get("/settings", verifyToken, adminMiddleware, settingsController.getAllSettings);

// Get a specific setting by key (Admin only)
router.get("/settings/:key", verifyToken, adminMiddleware, settingsController.getSettingByKey);

// Update a setting by key (Admin only)
router.put("/settings/:key", verifyToken, adminMiddleware, settingsController.updateSettingByKey);

// Create a new setting (Admin only)
router.post("/settings", verifyToken, adminMiddleware, settingsController.createSetting);

// Delete a setting (Admin only)
router.delete("/settings/:key", verifyToken, adminMiddleware, settingsController.deleteSetting);

export default router;
