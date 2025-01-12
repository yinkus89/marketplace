// src/server.ts or src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';  // Import the admin routes
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import userRoutes from './routes/userRoute'; // Make sure the path matches your directory structure

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Product routes
app.use("/api/products", productRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


// Admin routes (admin login, etc.)
app.use("/api/admin", adminRoutes);  // All admin-specific actions

// Category routes
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
