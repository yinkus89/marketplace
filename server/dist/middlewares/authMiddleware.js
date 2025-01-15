"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        req.user = decoded; // Attach the decoded user to the request object
        next(); // Continue to the next middleware or route handler
    }
    catch (error) {
        res.status(400).json({ error: "Invalid or expired token" });
    }
};
exports.verifyToken = verifyToken;
// Middleware to protect admin routes
const adminMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token)
        return res.status(401).json({ message: 'Access denied, no token provided' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // Check if the user has an admin role
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, not an admin' });
        }
        req.user = decoded; // Attach user information to request
        next(); // Continue to the next middleware/route handler
    }
    catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
exports.adminMiddleware = adminMiddleware;
