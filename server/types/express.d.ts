// src/types/express.d.ts (or src/types/custom.d.ts)
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;  // Or you can specify a more detailed type for `user` if needed
    }
  }
}
