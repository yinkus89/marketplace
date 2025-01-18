import { Request, Response } from 'express';
import prisma from '../prisma/prismaClient';

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await prisma.store.findMany({
      include: { reviews: true },
    });
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createStore = async (req: Request, res: Response) => {
  const { name, description, logo, sellerId } = req.body;
  try {
    const store = await prisma.store.create({
      data: { name, description, logo, sellerId },
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
