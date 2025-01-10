"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const validateRegister = (data) => {
    try {
        registerSchema.parse(data);
        return { success: true };
    }
    catch (err) {
        return { success: false, error: err };
    }
};
exports.validateRegister = validateRegister;
const validateLogin = (data) => {
    try {
        loginSchema.parse(data);
        return { success: true };
    }
    catch (err) {
        return { success: false, error: err };
    }
};
exports.validateLogin = validateLogin;
