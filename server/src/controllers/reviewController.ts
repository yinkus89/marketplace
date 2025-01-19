import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new store review
export const createStoreReview = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params;
    const { customerId, rating, comment } = req.body;

    try {
        const review = await prisma.storeReview.create({
            data: {
                storeId: parseInt(storeId),
                customerId,
                rating,
                comment,
            },
        });

        res.status(201).json({ message: 'Store review created successfully', review });
    } catch (error) {
        console.error('Error creating store review:', error);
        res.status(500).json({ error: 'Unable to create store review' });
    }
};

// Get all reviews for a store
export const getReviewsByStoreId = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params;

    try {
        const reviews = await prisma.storeReview.findMany({
            where: { storeId: parseInt(storeId) },
            include: { customer: true },
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Unable to fetch store reviews' });
    }
};
