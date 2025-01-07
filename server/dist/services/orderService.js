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
exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
// src/services/orderService.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrder = (customerName, customerEmail, shippingAddress, items) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalAmount = yield calculateTotalAmount(items);
        const order = yield prisma.order.create({
            data: {
                customerName,
                customerEmail,
                shippingAddress,
                totalAmount,
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                items: true,
            },
        });
        return order;
    }
    catch (error) {
        throw new Error('Error creating order');
    }
});
exports.createOrder = createOrder;
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    catch (error) {
        throw new Error('Error fetching orders');
    }
});
exports.getAllOrders = getAllOrders;
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order)
            throw new Error('Order not found');
        return order;
    }
    catch (error) {
        throw new Error('Error fetching order by ID');
    }
});
exports.getOrderById = getOrderById;
const updateOrder = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.order.update({
            where: { id },
            data,
        });
    }
    catch (error) {
        throw new Error('Error updating order');
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.order.delete({
            where: { id },
        });
    }
    catch (error) {
        throw new Error('Error deleting order');
    }
});
exports.deleteOrder = deleteOrder;
const calculateTotalAmount = (items) => __awaiter(void 0, void 0, void 0, function* () {
    let total = 0;
    for (let item of items) {
        const product = yield prisma.product.findUnique({
            where: { id: item.productId },
        });
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
});
