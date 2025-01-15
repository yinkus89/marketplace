"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const vendorController_1 = require("../controllers/vendorController");
const customerController_1 = require("../controllers/customerController");
const adminController_1 = require("../controllers/adminController");
const protectRoute_1 = require("../middlewares/protectRoute");
const roleGuard_1 = __importDefault(require("../middlewares/roleGuard"));
const router = express_1.default.Router();
// Vendor Routes
router.get('/vendor/details', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['VENDOR']), vendorController_1.getVendorDetails);
router.get('/vendor/orders', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['VENDOR']), vendorController_1.getVendorOrders);
router.put('/vendor/profile', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['VENDOR']), vendorController_1.updateVendorProfile);
// Customer Routes
router.get('/customer/profile', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['CUSTOMER']), customerController_1.getCustomerProfile);
router.get('/customer/orders', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['CUSTOMER']), customerController_1.getCustomerOrders);
router.put('/customer/profile', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['CUSTOMER']), customerController_1.updateCustomerProfile);
// Admin Routes
router.get('/admin/users', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['ADMIN']), adminController_1.getAllUsers);
router.get('/admin/orders', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['ADMIN']), adminController_1.getAllOrders);
router.put('/admin/user', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['ADMIN']), adminController_1.updateUserProfile);
exports.default = router;
