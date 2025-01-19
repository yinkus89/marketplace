import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add Product to Wishlist
export const addToWishlist = async (req: Request, res: Response) => {
    const { customerId, productId } = req.body;

    try {
        // Check if the product already exists in the wishlist for this customer
        const existingWishlistItem = await prisma.wishlist.findUnique({
            where: {
                unique_customer_product: {
                    customerId,
                    productId
                }
            }
        });

        if (existingWishlistItem) {
            return res.status(400).json({ error: "Product already in wishlist" });
        }

        // Create a new wishlist entry
        const wishlist = await prisma.wishlist.create({
            data: {
                customerId,
                productId
            }
        });

        res.status(200).json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add to wishlist" });
    }
};

// Get Wishlist for a Customer
export const getWishlist = async (req: Request, res: Response) => {
    const { customerId } = req.params;

    try {
        // Fetch the wishlist for a customer with product details
        const wishlist = await prisma.wishlist.findMany({
            where: { customerId: Number(customerId) },
            include: { product: true }, // Include product details in the result
        });

        if (!wishlist.length) {
            return res.status(404).json({ error: "Wishlist is empty" });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch wishlist" });
    }
};

// Remove Product from Wishlist
export const removeFromWishlist = async (req: Request, res: Response) => {
    const { customerId, productId } = req.body;

    try {
        // Delete the wishlist item for the given customer and product
        const deletedWishlistItem = await prisma.wishlist.delete({
            where: {
                unique_customer_product: {
                    customerId,
                    productId
                },
            },
        });

        res.status(200).json({ message: "Product removed from wishlist", deletedWishlistItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to remove from wishlist" });
    }
};
