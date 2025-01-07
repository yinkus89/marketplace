import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Product routes
app.use("/api/products", productRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Authentication routes (separate register and login paths)
app.use("/api/auth/register", authRoutes);  // Register route
app.use("/api/auth/login", authRoutes);     // Login route
app.use("/api/categories", categoryRoutes);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
