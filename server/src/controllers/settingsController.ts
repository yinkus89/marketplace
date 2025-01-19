import { Request, Response } from 'express';
import prisma from '../prisma/prismaClient';  // Prisma client import

// Get all settings (Admin only)
export const getAllSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany();  // Get all settings
    res.status(200).json({ success: true, data: settings });  // Send response with settings
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific setting by key (Admin only)
export const getSettingByKey = async (req: Request, res: Response) => {
  const { key } = req.params;  // Get the key from request parameters

  try {
    const setting = await prisma.setting.findUnique({
      where: { key }  // Find the setting using the key
    });

    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });  // If setting not found, return 404
    }

    res.status(200).json({ success: true, data: setting });  // Return the found setting
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a setting by key (Admin only)
export const updateSettingByKey = async (req: Request, res: Response) => {
  const { key } = req.params;  // Get the key from request parameters
  const { value } = req.body;  // Get the new value from the request body

  if (!value) {
    return res.status(400).json({ message: "Setting value is required" });  // Return 400 if value is missing
  }

  try {
    // Use upsert to either update or create the setting
    const updatedSetting = await prisma.setting.upsert({
      where: { key },
      update: { value },  // Update the setting with new value
      create: { key, value },  // If the setting does not exist, create it
    });

    res.status(200).json({ success: true, message: "Setting updated successfully", data: updatedSetting });
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new setting (Admin only)
export const createSetting = async (req: Request, res: Response) => {
  const { key, value } = req.body;  // Get key and value from request body

  if (!key || !value) {
    return res.status(400).json({ message: "Key and value are required" });  // Return 400 if key or value is missing
  }

  try {
    const newSetting = await prisma.setting.create({
      data: { key, value },  // Create a new setting in the database
    });

    res.status(201).json({ success: true, message: "Setting created successfully", data: newSetting });
  } catch (error) {
    console.error("Error creating setting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a setting (Admin only)
export const deleteSetting = async (req: Request, res: Response) => {
  const { key } = req.params;  // Get the key from request parameters

  try {
    const deletedSetting = await prisma.setting.delete({
      where: { key },  // Delete the setting with the given key
    });

    res.status(200).json({ success: true, message: "Setting deleted successfully", data: deletedSetting });
  } catch (error) {
    console.error("Error deleting setting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
