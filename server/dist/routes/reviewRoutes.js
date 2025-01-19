"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const router = (0, express_1.Router)();
// Create a new store review
router.post('/:storeId/reviews', reviewController_1.createStoreReview);
// Get all reviews for a store
router.get('/:storeId/reviews', reviewController_1.getReviewsByStoreId);
exports.default = router;
