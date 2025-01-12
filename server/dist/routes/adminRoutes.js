"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController"); // assuming these functions exist
const router = (0, express_1.Router)();
// Admin-specific routes
// Admin Dashboard
router.get('/dashboard', (req, res) => {
    res.send('Admin Dashboard');
});
// Get all users
router.get('/users', adminController_1.getAllUsers);
// Update user status
router.put('/users/:id/status', adminController_1.updateUserStatus);
// Delete a user
router.delete('/users/:id', adminController_1.deleteUser);
exports.default = router;
