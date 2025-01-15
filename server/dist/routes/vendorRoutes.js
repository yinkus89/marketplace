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
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Ensure correct import path
const router = express_1.default.Router();
// Middleware to check if the logged-in user is a vendor
const checkVendor = (req, res, next) => {
    if (!req.user || req.user.role !== 'VENDOR') {
        return res.status(403).json({ message: "Access denied. Only vendors can access this." });
    }
    next();
};
// Get vendor-specific dashboard data
router.get("/dashboard", authMiddleware_1.verifyToken, checkVendor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // Correct query: Ensure you are querying by the appropriate unique field (like `userId`)
        const vendorData = yield prismaClient_1.default.vendor.findUnique({
            where: { userId: req.user.userId }, // Using `userId`, ensure it's correct
            include: { products: true, orders: true }, // Ensure `products` relation exists in Prisma schema
        });
        if (!vendorData) {
            return res.status(404).json({ message: "Vendor data not found." });
        }
        res.status(200).json(vendorData);
    }
    catch (error) {
        console.error("Error fetching vendor dashboard:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Example: Add another route for vendor's product management
router.post("/create-product", authMiddleware_1.verifyToken, checkVendor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, imageUrl } = req.body;
    // Validate product fields
    if (!name || !price || !description || !imageUrl) {
        return res.status(400).json({ message: "Missing required fields: name, price, description, imageUrl" });
    }
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // Correct product creation: Associate with the correct relation, e.g., `vendorId`
        const newProduct = yield prismaClient_1.default.product.create({
            data: {
                name,
                price,
                description,
                vendorId: req.user.userId, // Correct association with vendorId
                imageUrl, // Make sure to include imageUrl here
            },
        });
        res.status(201).json({ message: "Product created successfully", newProduct });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product" });
    }
}));
exports.default = router;
