import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviewController';

const router = Router();

router.get('/:storeId', getReviews);
router.post('/:storeId', createReview);

export default router;
