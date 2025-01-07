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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
// src/services/productService.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.product.findMany();
    }
    catch (error) {
        throw new Error('Error fetching products');
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.product.findUnique({
            where: { id },
        });
        if (!product)
            throw new Error('Product not found');
        return product;
    }
    catch (error) {
        throw new Error('Error fetching product by ID');
    }
});
exports.getProductById = getProductById;
const createProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.product.create({
            data,
        });
    }
    catch (error) {
        throw new Error('Error creating product');
    }
});
exports.createProduct = createProduct;
const updateProduct = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.product.update({
            where: { id },
            data,
        });
    }
    catch (error) {
        throw new Error('Error updating product');
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.product.delete({
            where: { id },
        });
    }
    catch (error) {
        throw new Error('Error deleting product');
    }
});
exports.deleteProduct = deleteProduct;
