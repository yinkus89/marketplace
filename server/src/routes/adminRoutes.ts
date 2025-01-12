import { Router } from 'express';
import { getAllUsers, updateUserStatus, deleteUser } from '../controllers/adminController';
import { adminMiddleware } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

// Admin-specific routes with adminMiddleware

// Admin Dashboard
router.get('/dashboard', adminMiddleware, (req, res) => {
  res.send('Admin Dashboard');
});

// Get all users
router.get('/users', adminMiddleware, getAllUsers);

// Update user status
router.put('/users/:id/status', adminMiddleware, updateUserStatus);

// Delete a user
router.delete('/users/:id', adminMiddleware, deleteUser);

export default router;
