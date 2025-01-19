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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const google_auth_library_1 = require("google-auth-library"); // Google OAuth client
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto")); // For generating reset tokens
const protectRoute_1 = require("../middlewares/protectRoute"); // Import the protectRoute middleware
const roleGuard_1 = __importDefault(require("../middlewares/roleGuard")); // Import the roleGuard middleware
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID || ''); // Google Client ID
// Utility function for role validation (optionally can move it to a separate file)
const normalizeRole = (role) => {
    const validRoles = ['ADMIN', 'CUSTOMER', 'VENDOR'];
    return validRoles.includes(role.toUpperCase()) ? role.toUpperCase() : 'CUSTOMER'; // Default to CUSTOMER
};
// Register Route
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    (0, express_validator_1.body)('name').isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 and 20 characters'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .matches(/\d/).withMessage('Password must be at least 8 characters long and contain a number'),
    (0, express_validator_1.body)('role')
        .isIn(['ADMIN', 'CUSTOMER', 'VENDOR'])
        .withMessage('Role must be one of: ADMIN, CUSTOMER, VENDOR')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, role } = req.body;
    const normalizedRole = normalizeRole(role);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = yield prisma.user.create({
            data: { email, name, password: hashedPassword, role: normalizedRole },
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
}));
// Forgot Password Route
router.post('/forgot-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour
        // Save the reset token and expiry time in the database
        yield prisma.user.update({
            where: { email },
            data: { resetToken, tokenExpiry },
        });
        // Create the reset link
        const resetUrl = `http://localhost:4001/reset-password/${resetToken}`;
        // Set up the email transporter
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        // Send the reset link to the user's email
        const mailOptions = {
            from: 'YourAppName <yourapp@example.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>If you didn't request this, please ignore this email.</p>`,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong, please try again' });
    }
}));
// Reset Password Route
router.post('/reset-password/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                resetToken: token,
                tokenExpiry: { gte: new Date() }, // Check if the token is expired
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
        yield prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, tokenExpiry: null },
        });
        res.status(200).json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong, please try again' });
    }
}));
// Login Route (Standard Login)
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token },
        });
    }
    catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
}));
// Google Login Route
router.post('/google-login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    try {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload || {};
        if (!email || !name) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }
        let user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            user = yield prisma.user.create({
                data: {
                    email,
                    name,
                    password: '',
                    role: 'CUSTOMER',
                },
            });
        }
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const newToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token: newToken },
        });
    }
    catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: 'Error logging in with Google' });
    }
}));
// Protected Routes
// Admin Dashboard
router.get('/admin-dashboard', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['ADMIN']), (req, res) => {
    res.status(200).json({ message: 'Welcome to the Admin Dashboard!' });
});
// Vendor Dashboard (Both Admin and Vendor can access)
router.get('/vendor-dashboard', protectRoute_1.protectRoute, (0, roleGuard_1.default)(['ADMIN', 'VENDOR']), (req, res) => {
    res.status(200).json({ message: 'Welcome to the Vendor Dashboard!' });
});
// Customer Dashboard (Accessible by all authenticated users)
router.get('/customer-dashboard', protectRoute_1.protectRoute, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json({ message: 'Welcome to your profile!', user: req.user });
});
exports.default = router;
