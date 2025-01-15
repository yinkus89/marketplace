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
exports.deleteUserProfile = exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// Register a new user (Admin can specify role)
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, role } = req.body;
    try {
        // Validate role - Only allow certain roles for registration
        if (!["admin", "vendor", "customer"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        // Check if email already exists
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        // Hash password
        const SALT_ROUNDS = 12;
        const hashedPassword = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
        // Create new user
        const newUser = yield prisma.user.create({
            data: { name, email, password: hashedPassword, role },
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } },
        });
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Error registering user" });
    }
});
exports.registerUser = registerUser;
// Login a user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Verify password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Generate JWT token for authentication
        const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: "1h" });
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { token },
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});
exports.loginUser = loginUser;
// Get user profile (Vendor/Customer/Admin can view their profile)
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const userId = req.user.userId;
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            data: { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Error fetching user profile" });
    }
});
exports.getUserProfile = getUserProfile;
// Update user profile (Admin can update any user's profile, Vendor/Customer can update their own profile)
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const userId = req.user.userId;
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: { name, email },
        });
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: { user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role } },
        });
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Error updating user profile" });
    }
});
exports.updateUserProfile = updateUserProfile;
// Delete user profile (Only Admin can delete user profiles)
const deleteUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const userId = req.user.userId;
        // Only admins can delete profiles
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Only admins can delete profiles" });
        }
        yield prisma.user.delete({ where: { id: userId } });
        res.status(200).json({
            success: true,
            message: "User profile deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting user profile:", error);
        res.status(500).json({ message: "Error deleting user profile" });
    }
});
exports.deleteUserProfile = deleteUserProfile;
