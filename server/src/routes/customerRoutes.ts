import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient';  // Assuming prisma client is set up correctly
import { protectRoute } from '../middlewares/protectRoute';  // Import the protectRoute middleware

const router = express.Router();

// Middleware to check if the logged-in user is a customer
const checkCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'CUSTOMER') {
    return res.status(403).json({ message: "Access denied. Only customers can access this." });
  }
  next();
};

// Customer dashboard route (for example, fetching customer info and orders)
router.get("/dashboard", protectRoute, checkCustomer, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const customerData = await prisma.customer.findUnique({
      where: { userId: req.user.userId },  // Corrected from req.user.id to req.user.userId
      include: { orders: true },  // Including orders for customer
    });

    if (!customerData) {
      return res.status(404).json({ message: "Customer data not found." });
    }

    res.status(200).json(customerData);  // Respond with the customer data
  } catch (error) {
    console.error("Error fetching customer dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Example: Fetch all orders for a customer
router.get("/orders", protectRoute, checkCustomer, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: req.user.userId },  // Fetch orders based on userId (linked to customer)
    });

    res.status(200).json(orders);  // Respond with the orders data
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
