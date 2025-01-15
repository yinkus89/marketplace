// src/services/orderService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (
  customerId: number,  // Add the customerId
  customerName: string, 
  customerEmail: string, 
  shippingAddress: string, 
  items: { productId: number, quantity: number }[]
) => {
  try {
    const totalAmount = await calculateTotalAmount(items);
    
    // Create the order and associate it with the customer
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        shippingAddress,
        totalAmount,
        customer: {  // Associate with customer
          connect: { id: customerId },  // Ensure that the customerId exists
        },
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  } catch (error) {
    throw new Error('Error creating order');
  }
};

export const getAllOrders = async () => {
  try {
    return await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error('Error fetching orders');
  }
};

export const getOrderById = async (id: number) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) throw new Error('Order not found');
    return order;
  } catch (error) {
    throw new Error('Error fetching order by ID');
  }
};

export const updateOrder = async (id: number, data: { customerName?: string, customerEmail?: string, shippingAddress?: string }) => {
  try {
    return await prisma.order.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error('Error updating order');
  }
};

export const deleteOrder = async (id: number) => {
  try {
    return await prisma.order.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error('Error deleting order');
  }
};

const calculateTotalAmount = async (items: { productId: number, quantity: number }[]) => {
  let total = 0;
  for (let item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
};
