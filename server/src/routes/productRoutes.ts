import express from "express";
import { getAllProducts, createProduct } from "../controllers/productController";

// Create a new router instance
const router = express.Router();

// Define routes with correct handler types
router.get("/", getAllProducts);  // TypeScript should infer the types correctly here
router.post("/", createProduct);

export default router;
