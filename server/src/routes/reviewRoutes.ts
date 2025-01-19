import { Router } from 'express';
import { createStoreReview, getReviewsByStoreId } from '../controllers/reviewController';

const router = Router();

// Create a new store review
router.post('/:storeId/reviews', createStoreReview);

// Get all reviews for a store
router.get('/:storeId/reviews', getReviewsByStoreId);

export default router;
