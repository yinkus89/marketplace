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
exports.verifyToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../prisma/prismaClient")); // Adjust to match your import structure
// Register a new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, role } = req.body; // Changed 'username' to 'name'
    // Validate that necessary fields are provided
    if (!email || !password || !name) {
        // Changed 'username' to 'name'
        return res
            .status(400)
            .json({ error: "Email, password, and name are required." }); // Changed 'username' to 'name'
    }
    // Check if the email already exists in the database
    const existingUser = yield prismaClient_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
    }
    try {
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create a new user in the database
        const newUser = yield prismaClient_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name, // Changed 'username' to 'name'
                role: role || "CUSTOMER", // Default to 'CUSTOMER' if no role is provided
            },
        });
        // Send success response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name, // Changed 'username' to 'name'
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during registration" });
    }
});
exports.register = register;
// Login a user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validate that necessary fields are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }
    try {
        // Find the user by email
        const user = yield prismaClient_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Create a JWT token with a 1-hour expiration time
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        // Send the token and user information back to the client
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name, // Changed 'username' to 'name'
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during login" });
    }
});
exports.login = login;
// Function to verify token in protected routes
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};
exports.verifyToken = verifyToken;
