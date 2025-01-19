"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const http_1 = __importDefault(require("http")); // Import HTTP server
const prismaClient_1 = __importDefault(require("./prisma/prismaClient"));
const socket_io_1 = __importDefault(require("socket.io")); // Import Socket.IO
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const vendorRoutes_1 = __importDefault(require("./routes/vendorRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const productRoutes_2 = __importDefault(require("./routes/productRoutes"));
const productRoutes_3 = __importDefault(require("./routes/productRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app); // Create HTTP server with express
// Fix Socket.IO initialization
const io = new socket_io_1.default.Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow requests from your frontend domain (adjust for production)
        methods: ['GET', 'POST'],
    },
});
// Rate limiting for all routes
const globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});
app.use(globalRateLimiter);
// Middleware Setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)()); // Adds security headers
app.use((0, compression_1.default)()); // Compresses responses for faster transmission
// Routes
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default); // This will handle both login and register
app.use('/api/vendors', vendorRoutes_1.default); // Add vendor routes
app.use('/api/customers', customerRoutes_1.default); // Add customer routes
app.use('/api/admin', adminRoutes_1.default); // Add admin routes
app.use('/api/stores', storeRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/wishlist', productRoutes_2.default);
app.use('/api/product-reviews/{id}', productRoutes_3.default);
// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    if (err.name === 'ForbiddenError') {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});
// WebSocket server setup
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    // Listen for a message from a customer or vendor
    socket.on('sendMessage', (data) => {
        const { sender, message } = data; // sender can be 'customer' or 'vendor'
        console.log(`New message from ${sender}: ${message}`);
        // Broadcast the message to all clients (vendors or customers)
        io.emit('newMessage', { sender, message });
    });
    // Listen for typing status
    socket.on('typing', (data) => {
        const { sender, isTyping } = data;
        socket.broadcast.emit('typing', { sender, isTyping });
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
// Graceful Shutdown
server.listen(process.env.PORT || 4001, () => {
    console.log(`Server is running on port ${process.env.PORT || 4001}`);
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Gracefully shutting down...');
    yield prismaClient_1.default.$disconnect(); // Ensure Prisma disconnects properly
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Gracefully shutting down...');
    yield prismaClient_1.default.$disconnect(); // Ensure Prisma disconnects properly
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
}));
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
