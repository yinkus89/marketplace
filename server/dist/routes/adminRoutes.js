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
const prismaClient_1 = __importDefault(require("../prisma/prismaClient")); // Prisma client import
const bcryptjs_1 = __importDefault(require("bcryptjs")); // Import bcrypt for hashing passwords
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Custom auth middleware to verify user
const express_validator_1 = require("express-validator"); // Input validation
const router = express_1.default.Router();
// Middleware to check if the logged-in user is an admin
const adminRoleMiddleware = (req, res, next) => {
    // Check if req.user exists and has a role of 'ADMIN'
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Access denied. Only admins can access this." });
    }
    next();
};
// Middleware for input validation
const validateUserData = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
    (0, express_validator_1.body)('role').isIn(['ADMIN', 'CUSTOMER', 'VENDOR']).withMessage('Invalid role'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'), // Ensure name is included
];
// Create new user
router.post("/create-user", authMiddleware_1.verifyToken, adminRoleMiddleware, validateUserData, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, name } = req.body;
    // Validate input
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Hash the password before saving it to the database
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // If the role is 'VENDOR', we should ensure the user has vendor-related data
        const newUserData = {
            email,
            password: hashedPassword,
            role,
            name,
        };
        // If user is a vendor, create vendor-related data
        if (role === 'VENDOR') {
            newUserData.vendor = {
                create: {
                    // Vendor-specific fields (You should update these according to your schema)
                    businessName: req.body.businessName,
                    businessAddress: req.body.businessAddress,
                    // Add any other vendor-specific data here
                },
            };
        }
        const newUser = yield prismaClient_1.default.user.create({
            data: newUserData,
            include: {
                vendor: true, // Include vendor data in the response
            },
        });
        res.status(201).json({ message: "User created successfully", newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
}));
// Update user info
router.put("/user/:id", authMiddleware_1.verifyToken, adminRoleMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    const { email, role, name } = req.body; // Include name in the update
    // Validate input
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedUserData = {
            email,
            role,
            name,
        };
        // If user is being updated as a vendor, ensure vendor data is included
        if (role === 'VENDOR') {
            updatedUserData.vendor = {
                update: {
                    // Update vendor-specific fields if needed
                    businessName: req.body.businessName,
                    businessAddress: req.body.businessAddress,
                    // Add any other vendor-specific data here
                },
            };
        }
        const updatedUser = yield prismaClient_1.default.user.update({
            where: { id: userId },
            data: updatedUserData,
            include: {
                vendor: true, // Include updated vendor data in the response
            },
        });
        res.status(200).json({ message: "User updated successfully", updatedUser });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
}));
// Soft delete user
router.delete("/user/:id", authMiddleware_1.verifyToken, adminRoleMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        const deletedUser = yield prismaClient_1.default.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() }, // Soft delete the user by setting deletedAt
        });
        res.status(200).json({ message: "User deleted successfully", deletedUser });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
}));
router.get("/products", authMiddleware_1.verifyToken, adminRoleMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prismaClient_1.default.product.findMany({
            include: {
                category: true, // Include category information
                vendor: true, // Include vendor information
            },
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Get product by ID
// Example for finding a product and including vendor through the order
router.get("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    try {
        const product = yield prismaClient_1.default.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
                orderItems: {
                    include: {
                        order: {
                            include: {
                                vendor: true, // Include vendor through the order relation
                            },
                        },
                    },
                },
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Error fetching product" });
    }
}));
// Get all users
router.get("/users", authMiddleware_1.verifyToken, adminRoleMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prismaClient_1.default.user.findMany({
            include: {
                vendor: true, // Include vendor data for users with the 'VENDOR' role
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Get a single user by ID
router.get("/user/:id", authMiddleware_1.verifyToken, adminRoleMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id); // Ensure the ID is a number
    try {
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: userId },
            include: {
                vendor: true, // Include vendor data if the user is a vendor
            },
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
// Soft delete product
router.delete("/product/:id", authMiddleware_1.verifyToken, adminRoleMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    try {
        const deletedProduct = yield prismaClient_1.default.product.update({
            where: { id: productId },
            data: { deletedAt: new Date() }, // Soft delete
        });
        res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
}));
// Create new product
router.post("/create-product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, imageUrl, categoryId } = req.body;
    // Validate required fields
    if (!name || !description || !price || !imageUrl) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        // Create a new product
        const newProduct = yield prismaClient_1.default.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
                category: {
                    connect: { id: categoryId }, // Connect to an existing category by categoryId
                },
            },
        });
        // Respond with the newly created product
        return res.status(201).json(newProduct);
    }
    catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Error creating product" });
    }
}));
exports.default = router;
