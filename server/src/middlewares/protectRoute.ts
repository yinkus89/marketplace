import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from '../types/payload';  // Import JWTPayload from a separate file

// Extend the Request interface to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload; // User type is now JWTPayload
    }
  }
}

// Protect routes middleware
export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    // Decode the JWT token and get the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JWTPayload;

    // Attach the decoded payload to req.user
    req.user = decoded; // This will be available in other route handlers

    next(); // Proceed to the next middleware/handler
  } catch (err) {
    console.error("JWT verification error:", err);  // Log the error for debugging purposes
    res.status(400).json({ message: "Invalid token" });
  }
};
