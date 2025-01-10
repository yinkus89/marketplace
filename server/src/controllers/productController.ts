import { Request, Response } from 'express'; // Importing Request and Response types
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products); // Respond with the products
  } catch (error) {
    console.error(error); // Logging the error
    res.status(500).json({ message: 'Error fetching products' }); // Sending error response
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body; // Assuming the product data is sent in the request body
    const newProduct = await prisma.product.create({
      data: productData,
    });
    res.status(201).json(newProduct); // Respond with the newly created product
  } catch (error) {
    console.error(error); // Logging the error
    res.status(500).json({ message: 'Error creating product' }); // Sending error response
  }
};

