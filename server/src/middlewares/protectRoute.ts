import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number; // Change this from string to number
        email: string;
        role: string;
      };
    }
  }
}

// Define the JWT payload type, ensuring the userId matches the type in your database
interface JWTPayload {
  userId: number;  // Ensure this matches your database type (number or string)
  email: string;
  role: string;
}

// Protect routes middleware
export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  
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
    res.status(400).json({ message: "Invalid token" });
  }
};
