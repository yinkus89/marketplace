import express from "express";
import { getAllProducts, createProduct } from "../controllers/productController";
import { addToWishlist, getWishlist } from "../controllers/wishlistController";
import { createReview,  getReviewsByProductId } from "../controllers/productReviewController";
// Create a new router instance
const router = express.Router();

// Define routes with correct handler types
router.get("/", getAllProducts);  // TypeScript should infer the types correctly here
router.post("/", createProduct);
// Wishlist
router.post("/wishlist", addToWishlist);
router.get("/wishlist/:customerId", getWishlist);
// Reviews
router.post("/:productId/reviews", createReview);
router.get("/:productId/reviews", getReviewsByProductId);
export default router;