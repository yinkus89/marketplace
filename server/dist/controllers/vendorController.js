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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVendorProfile = exports.getVendorOrders = exports.getVendorDetails = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Example of a route to get vendor details
const getVendorDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const vendorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // assuming userId is saved in the token
        if (!vendorId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const vendor = yield prisma.user.findUnique({
            where: { id: vendorId },
        });
        if (!vendor || vendor.role !== 'VENDOR') {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json({ success: true, data: vendor });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching vendor details' });
    }
});
exports.getVendorDetails = getVendorDetails;
const getVendorOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Get the authenticated user ID
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        // Fetch the user and check if their role is VENDOR
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'VENDOR') {
            return res.status(403).json({ message: 'You are not authorized to view this' });
        }
        // Fetch orders related to the vendor
        const orders = yield prisma.order.findMany({
            where: {
                vendorId: userId, // Assuming `vendorId` is the field linking the orders to the vendor
            },
        });
        res.status(200).json({
            success: true,
            data: {
                orders,
                orderCount: orders.length, // Optional: Provide the number of orders for context
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving vendor orders' });
    }
});
exports.getVendorOrders = getVendorOrders;
// Example of a route to update vendor details
const updateVendorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    try {
        const vendorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!vendorId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updatedVendor = yield prisma.user.update({
            where: { id: vendorId },
            data: { name, email },
        });
        res.status(200).json({
            success: true,
            message: 'Vendor profile updated successfully',
            data: updatedVendor,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating vendor profile' });
    }
});
exports.updateVendorProfile = updateVendorProfile;
