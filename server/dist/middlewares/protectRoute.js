"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Protect routes middleware
const protectRoute = (req, res, next) => {
    var _a;
    // Get the token from Authorization header
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }
    try {
        // Decode the JWT token and get the payload
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        // Attach the decoded payload to req.user
        req.user = decoded; // This will be available in other route handlers
        next(); // Proceed to the next middleware/handler
    }
    catch (err) {
        console.error("JWT verification error:", err); // Log the error for debugging purposes
        res.status(400).json({ message: "Invalid token" });
    }
};
exports.protectRoute = protectRoute;
