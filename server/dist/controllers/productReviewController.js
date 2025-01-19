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
exports.getReviewsByProductId = exports.createReview = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a new product review
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { customerId, rating, comment } = req.body;
    // Check if required fields are provided
    if (!customerId || !rating || !comment) {
        res.status(400).json({ error: 'Missing required fields: customerId, rating, or comment.' });
        return;
    }
    // Validate productId and customerId as integers
    const parsedProductId = parseInt(productId);
    const parsedCustomerId = parseInt(customerId);
    if (isNaN(parsedProductId) || isNaN(parsedCustomerId)) {
        res.status(400).json({ error: 'Invalid productId or customerId.' });
        return;
    }
    try {
        const review = yield prisma.productReview.create({
            data: {
                productId: parsedProductId,
                customerId: parsedCustomerId,
                rating,
                comment,
            },
        });
        res.status(201).json({ message: 'Review created successfully', review });
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Unable to create review, please try again later.' });
    }
});
exports.createReview = createReview;
// Get all reviews for a product
const getReviewsByProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    // Validate productId as integer
    const parsedProductId = parseInt(productId);
    if (isNaN(parsedProductId)) {
        res.status(400).json({ error: 'Invalid productId.' });
        return;
    }
    try {
        const reviews = yield prisma.productReview.findMany({
            where: { productId: parsedProductId },
            include: { customer: true },
        });
        // If no reviews found, return a message
        if (reviews.length === 0) {
            res.status(404).json({ message: 'No reviews found for this product.' });
            return;
        }
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Unable to fetch reviews, please try again later.' });
    }
});
exports.getReviewsByProductId = getReviewsByProductId;
