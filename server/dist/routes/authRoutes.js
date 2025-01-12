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
exports.protectRoute = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Rate limiting for auth routes
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
});
router.use(authRateLimiter);
// Register a new user
router.post("/register", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
    (0, express_validator_1.body)("name").isLength({ min: 3, max: 20 }).withMessage("Name must be 3-20 characters long"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8 })
        .matches(/\d/).withMessage("Password must be at least 8 characters and include a number"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, name, password } = req.body;
    try {
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
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user: { id: newUser.id, email: newUser.email, name: newUser.name } },
        });
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Error registering user" });
    }
}));
// Login a user
router.post("/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Compare password with stored hash
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" });
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
}));
// Protect routes middleware
const protectRoute = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token)
        return res.status(401).json({ message: "Access denied, no token provided" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        req.user = decoded;
        next(); // Allow the request to proceed to the next middleware/handler
    }
    catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};
exports.protectRoute = protectRoute;
exports.default = router;
