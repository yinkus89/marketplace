"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSetting = exports.createSetting = exports.updateSettingByKey = exports.getSettingByKey = exports.getAllSettings = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient")); // Prisma client import
// Get all settings (Admin only)
const getAllSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield prismaClient_1.default.setting.findMany(); // Get all settings
        res.status(200).json({ success: true, data: settings }); // Send response with settings
    }
    catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllSettings = getAllSettings;
// Get a specific setting by key (Admin only)
const getSettingByKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key } = req.params; // Get the key from request parameters
    try {
        const setting = yield prismaClient_1.default.setting.findUnique({
            where: { key } // Find the setting using the key
        });
        if (!setting) {
            return res.status(404).json({ message: "Setting not found" }); // If setting not found, return 404
        }
        res.status(200).json({ success: true, data: setting }); // Return the found setting
    }
    catch (error) {
        console.error("Error fetching setting:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSettingByKey = getSettingByKey;
// Update a setting by key (Admin only)
const updateSettingByKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key } = req.params; // Get the key from request parameters
    const { value } = req.body; // Get the new value from the request body
    if (!value) {
        return res.status(400).json({ message: "Setting value is required" }); // Return 400 if value is missing
    }
    try {
        // Use upsert to either update or create the setting
        const updatedSetting = yield prismaClient_1.default.setting.upsert({
            where: { key },
            update: { value }, // Update the setting with new value
            create: { key, value }, // If the setting does not exist, create it
        });
        res.status(200).json({ success: true, message: "Setting updated successfully", data: updatedSetting });
    }
    catch (error) {
        console.error("Error updating setting:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateSettingByKey = updateSettingByKey;
// Create a new setting (Admin only)
const createSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, value } = req.body; // Get key and value from request body
    if (!key || !value) {
        return res.status(400).json({ message: "Key and value are required" }); // Return 400 if key or value is missing
    }
    try {
        const newSetting = yield prismaClient_1.default.setting.create({
            data: { key, value }, // Create a new setting in the database
        });
        res.status(201).json({ success: true, message: "Setting created successfully", data: newSetting });
    }
    catch (error) {
        console.error("Error creating setting:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createSetting = createSetting;
// Delete a setting (Admin only)
const deleteSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key } = req.params; // Get the key from request parameters
    try {
        const deletedSetting = yield prismaClient_1.default.setting.delete({
            where: { key }, // Delete the setting with the given key
        });
        res.status(200).json({ success: true, message: "Setting deleted successfully", data: deletedSetting });
    }
    catch (error) {
        console.error("Error deleting setting:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteSetting = deleteSetting;
