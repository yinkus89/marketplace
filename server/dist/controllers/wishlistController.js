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
exports.removeFromWishlist = exports.getWishlist = exports.addToWishlist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Add Product to Wishlist
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId, productId } = req.body;
    try {
        // Check if the product already exists in the wishlist for this customer
        const existingWishlistItem = yield prisma.wishlist.findUnique({
            where: {
                unique_customer_product: {
                    customerId,
                    productId
                }
            }
        });
        if (existingWishlistItem) {
            return res.status(400).json({ error: "Product already in wishlist" });
        }
        // Create a new wishlist entry
        const wishlist = yield prisma.wishlist.create({
            data: {
                customerId,
                productId
            }
        });
        res.status(200).json(wishlist);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add to wishlist" });
    }
});
exports.addToWishlist = addToWishlist;
// Get Wishlist for a Customer
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    try {
        // Fetch the wishlist for a customer with product details
        const wishlist = yield prisma.wishlist.findMany({
            where: { customerId: Number(customerId) },
            include: { product: true }, // Include product details in the result
        });
        if (!wishlist.length) {
            return res.status(404).json({ error: "Wishlist is empty" });
        }
        res.status(200).json(wishlist);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch wishlist" });
    }
});
exports.getWishlist = getWishlist;
// Remove Product from Wishlist
const removeFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId, productId } = req.body;
    try {
        // Delete the wishlist item for the given customer and product
        const deletedWishlistItem = yield prisma.wishlist.delete({
            where: {
                unique_customer_product: {
                    customerId,
                    productId
                },
            },
        });
        res.status(200).json({ message: "Product removed from wishlist", deletedWishlistItem });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to remove from wishlist" });
    }
});
exports.removeFromWishlist = removeFromWishlist;
