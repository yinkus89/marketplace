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
exports.updateCustomerProfile = exports.getCustomerOrders = exports.getCustomerProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Example of a route to get customer profile
const getCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // assuming userId is saved in the token
        const customer = yield prisma.user.findUnique({
            where: { id: customerId },
        });
        if (!customer || customer.role !== 'CUSTOMER') {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: customer });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching customer profile' });
    }
});
exports.getCustomerProfile = getCustomerProfile;
// Example of a route to get customer orders
const getCustomerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const orders = yield prisma.order.findMany({
            where: { customerId },
        });
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});
exports.getCustomerOrders = getCustomerOrders;
// Example of a route to update customer profile
const updateCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email } = req.body;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const updatedCustomer = yield prisma.user.update({
            where: { id: customerId },
            data: { name, email },
        });
        res.status(200).json({
            success: true,
            message: 'Customer profile updated successfully',
            data: updatedCustomer,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating customer profile' });
    }
});
exports.updateCustomerProfile = updateCustomerProfile;
