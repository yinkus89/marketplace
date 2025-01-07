import express from 'express';
import { getAllCategories } from '../controllers/categoryController';

const router = express.Router();

// Get all categories
router.get('/', getAllCategories);

export default router;
