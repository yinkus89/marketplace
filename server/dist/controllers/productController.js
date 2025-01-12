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
exports.createProduct = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all products (excluding soft-deleted products)
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch products excluding soft-deleted ones (deletedAt is NULL)
        const products = yield prisma.product.findMany({
            where: {
                deletedAt: null, // Filter out soft-deleted products
            },
        });
        res.status(200).json(products); // Respond with the products
    }
    catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching products' }); // Error response
    }
});
exports.getAllProducts = getAllProducts;
// Create a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, imageUrl, categoryId } = req.body;
        // Validate required fields
        if (!name || !description || !price || !imageUrl) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        // Create a new product
        const newProduct = yield prisma.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
                categoryId: categoryId || null, // Allow categoryId to be nullable
            },
        });
        res.status(201).json(newProduct); // Respond with the newly created product
    }
    catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error creating product' }); // Error response
    }
});
exports.createProduct = createProduct;
