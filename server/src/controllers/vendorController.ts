import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Example of a route to get vendor details
export const getVendorDetails = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user?.userId; // assuming userId is saved in the token

    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const vendor = await prisma.user.findUnique({
      where: { id: vendorId },
    });

    if (!vendor || vendor.role !== 'VENDOR') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching vendor details' });
  }
};

export const getVendorOrders = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Get the authenticated user ID

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Fetch the user and check if their role is VENDOR
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'VENDOR') {
      return res.status(403).json({ message: 'You are not authorized to view this' });
    }

    // Fetch orders related to the vendor
    const orders = await prisma.order.findMany({
      where: {
        vendorId: userId, // Assuming `vendorId` is the field linking the orders to the vendor
      },
    });

    res.status(200).json({
      success: true,
      data: {
        orders,
        orderCount: orders.length, // Optional: Provide the number of orders for context
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving vendor orders' });
  }
};

// Example of a route to update vendor details
export const updateVendorProfile = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const vendorId = req.user?.userId;

    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedVendor = await prisma.user.update({
      where: { id: vendorId },
      data: { name, email },
    });

    res.status(200).json({
      success: true,
      message: 'Vendor profile updated successfully',
      data: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating vendor profile' });
  }
};
