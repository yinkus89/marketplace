import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();  // Initialize PrismaClient

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, shippingAddress, totalAmount, items, password } = req.body;

    // Step 1: Check if customer exists, if not create one
    const customer = await prisma.customer.upsert({
      where: { email: customerEmail },
      update: {},  // Don't update anything if the customer exists
      create: {
        name: customerName,  // Include the name here
        email: customerEmail,
        passwordHash: password ? await bcrypt.hash(password, 10) : 'placeholderPasswordHash',
        user: {  // Ensure the 'user' field is included
          create: {
            name: customerName,  // Ensure name is passed to the user
            email: customerEmail,
            password: password ? await bcrypt.hash(password, 10) : 'placeholderPasswordHash',
          },
        },
      },
    });
    

    // Step 2: Create the order and link to the customer
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        shippingAddress,
        totalAmount,
        customer: { connect: { id: customer.id } },  // Connect the order to the customer
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            product: {
              connect: { id: item.productId },  // Connect products via productId
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,  // Include product data in the response
          },
        },
        customer: true,  // Include customer data in the response
      },
    });

    res.status(201).json(order);  // Respond with the created order
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,  // Include customer data
      },
    });

    res.status(200).json(orders);  // Respond with all orders
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get a single order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,  // Include customer info
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);  // Respond with the order
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Update an order
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { customerName, customerEmail, shippingAddress, totalAmount } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        customerName,
        customerEmail,
        shippingAddress,
        totalAmount,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,  // Include customer info in the response
      },
    });

    res.status(200).json(updatedOrder);  // Respond with the updated order
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();  // Respond with no content after deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
