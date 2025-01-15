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
const prismaClient_1 = __importDefault(require("../prisma/prismaClient")); // Assuming prisma client is set up correctly
const protectRoute_1 = require("../middlewares/protectRoute"); // Import the protectRoute middleware
const router = express_1.default.Router();
// Middleware to check if the logged-in user is a customer
const checkCustomer = (req, res, next) => {
    if (!req.user || req.user.role !== 'CUSTOMER') {
        return res.status(403).json({ message: "Access denied. Only customers can access this." });
    }
    next();
};
// Customer dashboard route (for example, fetching customer info and orders)
router.get("/dashboard", protectRoute_1.protectRoute, checkCustomer, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const customerData = yield prismaClient_1.default.customer.findUnique({
            where: { userId: req.user.userId }, // Corrected from req.user.id to req.user.userId
            include: { orders: true }, // Including orders for customer
        });
        if (!customerData) {
            return res.status(404).json({ message: "Customer data not found." });
        }
        res.status(200).json(customerData); // Respond with the customer data
    }
    catch (error) {
        console.error("Error fetching customer dashboard:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Example: Fetch all orders for a customer
router.get("/orders", protectRoute_1.protectRoute, checkCustomer, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const orders = yield prismaClient_1.default.order.findMany({
            where: { customerId: req.user.userId }, // Fetch orders based on userId (linked to customer)
        });
        res.status(200).json(orders); // Respond with the orders data
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
