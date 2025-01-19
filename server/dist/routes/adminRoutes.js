"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Middleware for role validation
const verifyRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: `Access denied. Only ${role}s can access this.` });
        }
        next();
    };
};
// Middleware for input validation
const validateUserData = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
    (0, express_validator_1.body)('role').isIn(['ADMIN', 'CUSTOMER', 'VENDOR']).withMessage('Invalid role'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
];
// Middleware for vendor validation (check if vendor-specific fields are provided)
const validateVendorData = [
    (0, express_validator_1.body)('businessName').notEmpty().withMessage('Business name is required for vendors'),
    (0, express_validator_1.body)('businessAddress').notEmpty().withMessage('Business address is required for vendors')
];
// Route to create a new user (Admin only)
router.post("/create-user", authMiddleware_1.verifyToken, verifyRole('ADMIN'), validateUserData, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, name } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUserData = { email, password: hashedPassword, role, name };
        // If the user is a vendor, create vendor-specific data
        if (role === 'VENDOR') {
            newUserData.vendor = {
                create: {
                    businessName: req.body.businessName,
                    businessAddress: req.body.businessAddress,
                },
            };
        }
        const newUser = yield prismaClient_1.default.user.create({
            data: newUserData,
            include: { vendor: true }, // Include vendor data for vendor users
        });
        res.status(201).json({ message: "User created successfully", newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
}));
// Route to update user info (Admin only)
router.put("/user/:id", authMiddleware_1.verifyToken, verifyRole('ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    const { email, role, name } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedUserData = { email, role, name };
        if (role === 'VENDOR') {
            updatedUserData.vendor = {
                update: {
                    businessName: req.body.businessName,
                    businessAddress: req.body.businessAddress,
                },
            };
        }
        const updatedUser = yield prismaClient_1.default.user.update({
            where: { id: userId },
            data: updatedUserData,
            include: { vendor: true },
        });
        res.status(200).json({ message: "User updated successfully", updatedUser });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
}));
// Route to soft delete a user (Admin only)
router.delete("/user/:id", authMiddleware_1.verifyToken, verifyRole('ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        const deletedUser = yield prismaClient_1.default.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() }, // Soft delete by setting deletedAt field
        });
        res.status(200).json({ message: "User deleted successfully", deletedUser });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
}));
// Route to get all users (Admin only)
router.get("/users", authMiddleware_1.verifyToken, verifyRole('ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prismaClient_1.default.user.findMany({
            include: { vendor: true }, // Include vendor data if present
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Route to get a user by ID (Admin only)
router.get("/user/:id", authMiddleware_1.verifyToken, verifyRole('ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: userId },
            include: { vendor: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Route to get all products (Admin only)
router.get("/products", authMiddleware_1.verifyToken, verifyRole('ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prismaClient_1.default.product.findMany({
            include: { category: true, vendor: true }, // Include category and vendor data
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Route to create a new product (Admin only)
router.post("/create-product", authMiddleware_1.verifyToken, verifyRole('ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, imageUrl, categoryId } = req.body;
    if (!name || !description || !price || !imageUrl) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const category = yield prismaClient_1.default.category.findUnique({ where: { id: categoryId } });
        if (!category) {
            return res.status(400).json({ message: "Category does not exist" });
        }
        const newProduct = yield prismaClient_1.default.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
                category: { connect: { id: categoryId } },
            },
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product" });
    }
}));
// Route to soft delete a product (Admin only)
router.delete("/product/:id", authMiddleware_1.verifyToken, verifyRole('ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    try {
        const deletedProduct = yield prismaClient_1.default.product.update({
            where: { id: productId },
            data: { deletedAt: new Date() }, // Soft delete the product
        });
        res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
}));
exports.default = router;
