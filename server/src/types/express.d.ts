import { JWTPayload } from './payload';  // Import your JWT payload type
import { Vendor } from '@prisma/client';  // Import Vendor type from Prisma (or modify based on your actual Prisma model)

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;  // Attach the user object from JWT to the request
      vendor?: Vendor;    // Attach vendor object to the request (optional, based on JWT)
    }
  }
}
