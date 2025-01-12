"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const zod_1 = require("zod");
// Define schemas
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
// Helper function to parse Zod errors
const parseZodErrors = (err) => {
    if (err.errors) {
        return err.errors.map((error) => error.message).join(', ');
    }
    return 'Invalid input';
};
// Generic validation function
const validateData = (schema, data) => {
    try {
        schema.parse(data);
        return { success: true };
    }
    catch (err) {
        return { success: false, error: parseZodErrors(err) };
    }
};
// Exported validation functions
const validateRegister = (data) => validateData(registerSchema, data);
exports.validateRegister = validateRegister;
const validateLogin = (data) => validateData(loginSchema, data);
exports.validateLogin = validateLogin;
