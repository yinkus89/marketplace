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
exports.updateUserProfile = exports.getAllOrders = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Example of a route to get all users (Admins only)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});
exports.getAllUsers = getAllUsers;
// Example of a route to get all orders (Admins only)
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany();
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});
exports.getAllOrders = getAllOrders;
// Example of a route to update any user's profile (Admins only)
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, name, email, role } = req.body;
    try {
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: { name, email, role },
        });
        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
});
exports.updateUserProfile = updateUserProfile;
