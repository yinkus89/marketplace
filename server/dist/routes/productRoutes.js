"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const wishlistController_1 = require("../controllers/wishlistController");
const productReviewController_1 = require("../controllers/productReviewController");
// Create a new router instance
const router = express_1.default.Router();
// Define routes with correct handler types
router.get("/", productController_1.getAllProducts); // TypeScript should infer the types correctly here
router.post("/", productController_1.createProduct);
// Wishlist
router.post("/wishlist", wishlistController_1.addToWishlist);
router.get("/wishlist/:customerId", wishlistController_1.getWishlist);
// Reviews
router.post("/:productId/reviews", productReviewController_1.createReview);
router.get("/:productId/reviews", productReviewController_1.getReviewsByProductId);
exports.default = router;
