import { JWTPayload } from './payload';  // Import your JWT payload type


declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;  // Ensure 'user' is lowercase
    }
  }
}
