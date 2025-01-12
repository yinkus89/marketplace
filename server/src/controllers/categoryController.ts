import { Request, Response } from "express";
import prisma from "../prisma/prismaClient"; // Assuming you are using Prisma

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};
