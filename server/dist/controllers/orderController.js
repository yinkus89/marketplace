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
exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient(); // Initialize PrismaClient
// Create a new order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerName, customerEmail, shippingAddress, totalAmount, items, password } = req.body;
        // Step 1: Check if customer exists, if not create one
        const customer = yield prisma.customer.upsert({
            where: { email: customerEmail },
            update: {}, // Don't update anything if the customer exists
            create: {
                name: customerName, // Include the name here
                email: customerEmail,
                passwordHash: password ? yield bcryptjs_1.default.hash(password, 10) : 'placeholderPasswordHash',
                user: {
                    create: {
                        name: customerName, // Ensure name is passed to the user
                        email: customerEmail,
                        password: password ? yield bcryptjs_1.default.hash(password, 10) : 'placeholderPasswordHash',
                    },
                },
            },
        });
        // Step 2: Create the order and link to the customer
        const order = yield prisma.order.create({
            data: {
                customerName,
                customerEmail,
                shippingAddress,
                totalAmount,
                customer: { connect: { id: customer.id } }, // Connect the order to the customer
                items: {
                    create: items.map((item) => ({
                        quantity: item.quantity,
                        product: {
                            connect: { id: item.productId }, // Connect products via productId
                        },
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true, // Include product data in the response
                    },
                },
                customer: true, // Include customer data in the response
            },
        });
        res.status(201).json(order); // Respond with the created order
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});
exports.createOrder = createOrder;
// Get all orders
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true, // Include customer data
            },
        });
        res.status(200).json(orders); // Respond with all orders
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
exports.getAllOrders = getAllOrders;
// Get a single order by ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true, // Include customer info
            },
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order); // Respond with the order
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});
exports.getOrderById = getOrderById;
// Update an order
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { customerName, customerEmail, shippingAddress, totalAmount } = req.body;
        const updatedOrder = yield prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                customerName,
                customerEmail,
                shippingAddress,
                totalAmount,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true, // Include customer info in the response
            },
        });
        res.status(200).json(updatedOrder); // Respond with the updated order
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});
exports.updateOrder = updateOrder;
// Delete an order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.order.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // Respond with no content after deletion
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});
exports.deleteOrder = deleteOrder;
