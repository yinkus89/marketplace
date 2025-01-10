import { z } from 'zod';

// Define schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Helper function to parse Zod errors
const parseZodErrors = (err: any) => {
  if (err.errors) {
    return err.errors.map((error: any) => error.message).join(', ');
  }
  return 'Invalid input';
};

// Generic validation function
const validateData = (schema: z.ZodSchema, data: any) => {
  try {
    schema.parse(data);
    return { success: true };
  } catch (err) {
    return { success: false, error: parseZodErrors(err) };
  }
};

// Exported validation functions
export const validateRegister = (data: any) => validateData(registerSchema, data);
export const validateLogin = (data: any) => validateData(loginSchema, data);
