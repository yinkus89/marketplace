import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new product review
export const createReview = async (req: Request, res: Response): Promise<void> => {
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
        const review = await prisma.productReview.create({
            data: {
                productId: parsedProductId,
                customerId: parsedCustomerId,
                rating,
                comment,
            },
        });

        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Unable to create review, please try again later.' });
    }
};

// Get all reviews for a product
export const getReviewsByProductId = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;

    // Validate productId as integer
    const parsedProductId = parseInt(productId);

    if (isNaN(parsedProductId)) {
        res.status(400).json({ error: 'Invalid productId.' });
        return;
    }

    try {
        const reviews = await prisma.productReview.findMany({
            where: { productId: parsedProductId },
            include: { customer: true },
        });

        // If no reviews found, return a message
        if (reviews.length === 0) {
            res.status(404).json({ message: 'No reviews found for this product.' });
            return;
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Unable to fetch reviews, please try again later.' });
    }
};
