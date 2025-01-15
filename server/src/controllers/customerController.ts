import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Example of a route to get customer profile
export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.userId; // assuming userId is saved in the token
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer || customer.role !== 'CUSTOMER') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching customer profile' });
  }
};

// Example of a route to get customer orders
export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.userId;
    const orders = await prisma.order.findMany({
      where: { customerId },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Example of a route to update customer profile
export const updateCustomerProfile = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const customerId = req.user?.userId;

    const updatedCustomer = await prisma.user.update({
      where: { id: customerId },
      data: { name, email },
    });

    res.status(200).json({
      success: true,
      message: 'Customer profile updated successfully',
      data: updatedCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating customer profile' });
  }
};
