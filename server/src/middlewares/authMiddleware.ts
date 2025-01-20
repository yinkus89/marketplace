import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/payload';  // Import the JWT payload type
import { Vendor } from '@prisma/client';  // Import Vendor from Prisma

// Extending the Request interface to include 'user' and 'vendor' properties
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;   // Attach the user object from JWT to the request
      vendor?: Vendor;     // Attach vendor object to the request (optional, based on JWT)
    }
  }
}

// Utility to verify the token and add decoded data to request
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: number; role: string; email: string };
    req.user = decoded;  // Attach the decoded user to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

// Middleware to protect routes based on role
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
      
      // Check if the user has one of the required roles
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied, insufficient role' });
      }

      req.user = decoded;  // Attach user information to request
      next(); // Continue to the next middleware/route handler
    } catch (err) {
      res.status(400).json({ message: 'Invalid token' });
    }
  };
};

// Middleware to protect admin routes
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return roleMiddleware(['admin'])(req, res, next);
};

// Example of how to use the roleMiddleware:
export const vendorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return roleMiddleware(['vendor'])(req, res, next);
};
