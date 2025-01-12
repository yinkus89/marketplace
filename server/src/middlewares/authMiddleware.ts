import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/payload';  // Import the JWT payload type

// Extending the Request interface to include 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;  // Allow the 'user' property on the Request object
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from 'Authorization' header
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    // Verify the token and decode it to your defined JWT payload type
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    req.user = decoded;  // Attach the decoded JWT payload to the request object (note the lowercase 'user')

    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to protect admin routes
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
    
    // Check if the user has an admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, not an admin' });
    }

    req.user = decoded;  // Attach user information to request
    next(); // Continue to the next middleware/route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
