// src/routes/userRoutes.ts
import express from 'express';
import { getVendorDetails, getVendorOrders, updateVendorProfile } from '../controllers/vendorController';
import { getCustomerProfile, getCustomerOrders, updateCustomerProfile } from '../controllers/customerController';
import { getAllUsers, getAllOrders, updateUserProfile } from '../controllers/adminController';
import { protectRoute } from '../middlewares/protectRoute';
import roleGuard from '../middlewares/roleGuard';

const router = express.Router();

// Vendor Routes
router.get('/vendor/details', protectRoute, roleGuard(['VENDOR']), getVendorDetails);
router.get('/vendor/orders', protectRoute, roleGuard(['VENDOR']), getVendorOrders);
router.put('/vendor/profile', protectRoute, roleGuard(['VENDOR']), updateVendorProfile);

// Customer Routes
router.get('/customer/profile', protectRoute, roleGuard(['CUSTOMER']), getCustomerProfile);
router.get('/customer/orders', protectRoute, roleGuard(['CUSTOMER']), getCustomerOrders);
router.put('/customer/profile', protectRoute, roleGuard(['CUSTOMER']), updateCustomerProfile);

// Admin Routes
router.get('/admin/users', protectRoute, roleGuard(['ADMIN']), getAllUsers);
router.get('/admin/orders', protectRoute, roleGuard(['ADMIN']), getAllOrders);
router.put('/admin/user', protectRoute, roleGuard(['ADMIN']), updateUserProfile);

export default router;
