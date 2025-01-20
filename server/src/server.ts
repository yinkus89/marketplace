import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import http from 'http';
import prisma from './prisma/prismaClient';
import { Server } from 'socket.io'; // Import Socket.IO
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import vendorRoutes from './routes/vendorRoutes';
import customerRoutes from './routes/customerRoutes';
import adminRoutes from './routes/adminRoutes';
import storeRoutes from './routes/storeRoutes';
import reviewRoutes from './routes/reviewRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import productReviewRoutes from './routes/productReviewRoutes';
import { adminMiddleware, vendorMiddleware } from './middlewares/authMiddleware';
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    methods: ['GET', 'POST'],
  },
});

// Rate limiting for all routes
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
});
app.use(globalRateLimiter);

// Middleware Setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true, 
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(compression());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/product-reviews/:id', productReviewRoutes);
app.use('/api/admin', adminMiddleware, adminRoutes);
app.use('/api/vendor', vendorMiddleware, vendorRoutes);

// Health Check Route
app.get('/health', (_, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Error Handling Middleware
app.use((err: any, _: express.Request, res: express.Response) => {
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

  socket.on('sendMessage', (data) => {
    const { sender, message } = data;
    console.log(`New message from ${sender}: ${message}`);

    io.emit('newMessage', { sender, message }); // Broadcast to all clients
  });

  socket.on('typing', (data) => {
    const { sender, isTyping } = data;
    socket.broadcast.emit('typing', { sender, isTyping });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  await prisma.$disconnect();
  io.close(); // Close WebSocket server
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Gracefully shutting down...');
  await prisma.$disconnect();
  io.close();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
server.listen(process.env.PORT || 4001, () => {
  console.log(`Server is running on port ${process.env.PORT || 4001}`);
});

export default server;
