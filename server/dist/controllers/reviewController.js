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
exports.getReviewsByStoreId = exports.createStoreReview = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a new store review
const createStoreReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const { customerId, rating, comment } = req.body;
    try {
        const review = yield prisma.storeReview.create({
            data: {
                storeId: parseInt(storeId),
                customerId,
                rating,
                comment,
            },
        });
        res.status(201).json({ message: 'Store review created successfully', review });
    }
    catch (error) {
        console.error('Error creating store review:', error);
        res.status(500).json({ error: 'Unable to create store review' });
    }
});
exports.createStoreReview = createStoreReview;
// Get all reviews for a store
const getReviewsByStoreId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    try {
        const reviews = yield prisma.storeReview.findMany({
            where: { storeId: parseInt(storeId) },
            include: { customer: true },
        });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Unable to fetch store reviews' });
    }
});
exports.getReviewsByStoreId = getReviewsByStoreId;
