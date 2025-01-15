import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Example of a route to get all users (Admins only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Example of a route to get all orders (Admins only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Example of a route to update any user's profile (Admins only)
export const updateUserProfile = async (req: Request, res: Response) => {
  const { userId, name, email, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role },
    });

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};
