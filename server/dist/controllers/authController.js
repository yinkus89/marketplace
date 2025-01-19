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
exports.deleteProfile = exports.updateProfile = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer")); // Nodemailer for sending emails
const crypto_1 = __importDefault(require("crypto")); // For generating random reset token
const prisma = new client_1.PrismaClient();
// Setup nodemailer transport
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
});
// Register controller
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, name, password, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        // Create new user
        const newUser = yield prisma.user.create({
            data: { email, name, password: hashedPassword, role },
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});
exports.register = register;
// Login controller
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare passwords
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.login = login;
// Forgot Password controller
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // Find the user by email, which is a unique identifier
        const user = yield prisma.user.findUnique({
            where: { email }, // Use email to identify the user
        });
        if (!user) {
            return res.status(400).json({ message: 'No user found with that email address' });
        }
        // Generate reset token and expiration
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiration
        // Update user with reset token and expiration
        yield prisma.user.update({
            where: { email }, // Use email here as well
            data: {
                resetToken,
                resetTokenExpiration,
            },
        });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        // Send reset email (you would need to implement the email sending logic here)
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending reset email' });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        // Use findFirst to query by non-unique field (resetToken)
        const user = yield prisma.user.findFirst({
            where: { resetToken: token }, // Searching by resetToken (non-unique field)
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        // Check token expiration
        if (user.resetTokenExpiration && Date.now() > user.resetTokenExpiration.getTime()) {
            return res.status(400).json({ message: 'Reset token has expired' });
        }
        // Hash new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
        // Update user password and clear resetToken fields using user id
        yield prisma.user.update({
            where: { id: user.id }, // Use user.id to uniquely identify the user
            data: {
                password: hashedPassword,
                resetToken: null, // Clear the reset token after successful reset
                resetTokenExpiration: null, // Clear the expiration time
            },
        });
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});
exports.resetPassword = resetPassword;
// Update Profile controller
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const userId = req.user.userId;
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: { name, email },
        });
        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            data: { user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role } },
        });
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
});
exports.updateProfile = updateProfile;
// Delete Profile controller
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const userId = req.user.userId;
        yield prisma.user.delete({
            where: { id: userId },
        });
        res.status(200).json({
            success: true,
            message: 'User profile deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting user profile:', error);
        res.status(500).json({ message: 'Error deleting user profile' });
    }
});
exports.deleteProfile = deleteProfile;
