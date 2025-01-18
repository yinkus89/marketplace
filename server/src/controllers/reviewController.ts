import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Export the getReviews function
export const getReviews = async (req: Request, res: Response): Promise<void> => {
  const { storeId } = req.params;

  try {
    // Fetch reviews for the given storeId
    const reviews = await prisma.review.findMany({
      where: { storeId: parseInt(storeId) },  // Make sure the storeId is parsed correctly
      include: { store: true, product: true },
    });

    // Respond with the reviews
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Export the createReview function
export const createReview = async (req: Request, res: Response): Promise<void> => {
  const { storeId } = req.params;
  const { rating, comment, customerId } = req.body;  // Destructure customerId instead of buyerId

  try {
    // Create a new review for the store
    const newReview = await prisma.review.create({
      data: {
        storeId: parseInt(storeId),  // Make sure storeId is parsed as an integer
        customerId: customerId,      // Use customerId here
        rating: rating,
        comment: comment,
      }
    });

    // Respond with the created review
    res.status(201).json(newReview);  // Return the correct variable, which is newReview
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
};
