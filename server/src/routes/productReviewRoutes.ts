import { Router } from 'express';
import { createReview, getReviewsByProductId } from '../controllers/productReviewController';

const router = Router();

// Route to create a review for a product
router.post('/:productId/reviews', createReview);

// Route to get all reviews for a product
router.get('/:productId/reviews', getReviewsByProductId);

export default router;
