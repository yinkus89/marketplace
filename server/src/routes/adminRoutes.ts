import { Router } from 'express';
import { getAllUsers, updateUserStatus, deleteUser } from '../controllers/adminController';  // assuming these functions exist

const router = Router();

// Admin-specific routes

// Admin Dashboard
router.get('/dashboard', (req, res) => {
  res.send('Admin Dashboard');
});

// Get all users
router.get('/users', getAllUsers);

// Update user status
router.put('/users/:id/status', updateUserStatus);

// Delete a user
router.delete('/users/:id', deleteUser);

export default router;
