import express, { Request, Response } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";

const router = express.Router();

// Create a new order
router.post("/", async (req: Request, res: Response) => {
  await createOrder(req, res);
});

// Get all orders
router.get("/", async (req: Request, res: Response) => {
  await getAllOrders(req, res);
});

// Get a single order by ID
router.get("/:id", async (req: Request, res: Response) => {
  await getOrderById(req, res);
});

// Update an order
router.put("/:id", async (req: Request, res: Response) => {
  await updateOrder(req, res);
});

// Delete an order
router.delete("/:id", async (req: Request, res: Response) => {
  await deleteOrder(req, res);
});

export default router;
