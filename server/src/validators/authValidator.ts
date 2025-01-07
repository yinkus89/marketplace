import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const validateRegister = (data: any) => {
  try {
    registerSchema.parse(data);
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const validateLogin = (data: any) => {
  try {
    loginSchema.parse(data);
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};
