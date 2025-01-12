import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all products (excluding soft-deleted products)
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch products excluding soft-deleted ones (deletedAt is NULL)
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null, // Filter out soft-deleted products
      },
    });
    res.status(200).json(products); // Respond with the products
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: 'Error fetching products' }); // Error response
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, imageUrl, categoryId } = req.body;

    // Validate required fields
    if (!name || !description || !price || !imageUrl) {
       res.status(400).json({ message: 'Missing required fields' });
        return
    }

    // Create a new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId: categoryId || null, // Allow categoryId to be nullable
      },
    });

    res.status(201).json(newProduct); // Respond with the newly created product
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: 'Error creating product' }); // Error response
  }
};


