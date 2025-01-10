// src/services/productService.ts
import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await prisma.product.findMany();
  } catch (error: any) {
    console.error('Error fetching products:', error.message);
    throw new Error('Error fetching products');
  }
};

// Get a product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error: any) {
    console.error('Error fetching product by ID:', error.message);
    throw new Error('Error fetching product by ID');
  }
};

// Create a new product
export const createProduct = async (data: { name: string; description: string; price: number; imageUrl: string }): Promise<Product> => {
  try {
    return await prisma.product.create({
      data,
    });
  } catch (error: any) {
    console.error('Error creating product:', error.message);
    throw new Error('Error creating product');
  }
};

// Update an existing product
export const updateProduct = async (id: number, data: { name?: string; description?: string; price?: number; imageUrl?: string }): Promise<Product> => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });
    return updatedProduct;
  } catch (error: any) {
    console.error('Error updating product:', error.message);
    throw new Error('Error updating product');
  }
};

// Delete a product by ID
export const deleteProduct = async (id: number): Promise<Product> => {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
    return deletedProduct;
  } catch (error: any) {
    console.error('Error deleting product:', error.message);
    throw new Error('Error deleting product');
  }
};
