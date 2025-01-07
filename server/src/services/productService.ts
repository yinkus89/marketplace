// src/services/productService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async () => {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    throw new Error('Error fetching products');
  }
};

export const getProductById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    throw new Error('Error fetching product by ID');
  }
};

export const createProduct = async (data: { name: string, description: string, price: number, imageUrl: string }) => {
  try {
    return await prisma.product.create({
      data,
    });
  } catch (error) {
    throw new Error('Error creating product');
  }
};

export const updateProduct = async (id: number, data: { name?: string, description?: string, price?: number, imageUrl?: string }) => {
  try {
    return await prisma.product.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error('Error updating product');
  }
};

export const deleteProduct = async (id: number) => {
  try {
    return await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error('Error deleting product');
  }
};
