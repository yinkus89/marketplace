import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import http from 'http';  // Import HTTP server
import prisma from './prisma/prismaClient';
import socketIO from 'socket.io';  // Import Socket.IO
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
import wishlistRoutes from './routes/productRoutes';
import productReviewRoutes from './routes/productRoutes';
dotenv.config();

const app = express();
const server = http.createServer(app);  // Create HTTP server with express

// Fix Socket.IO initialization
const io = new socketIO.Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from your frontend domain (adjust for production)
    methods: ['GET', 'POST'],
  },
});

// Rate limiting for all routes
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
app.use(globalRateLimiter);

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());  // Adds security headers
app.use(compression());  // Compresses responses for faster transmission

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);  // This will handle both login and register
app.use('/api/vendors', vendorRoutes);  // Add vendor routes
app.use('/api/customers', customerRoutes);  // Add customer routes
app.use('/api/admin', adminRoutes);  // Add admin routes
app.use('/api/stores', storeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/product-reviews/{id}', productReviewRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  await prisma.$disconnect();  // Ensure Prisma disconnects properly
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Gracefully shutting down...');
  await prisma.$disconnect();  // Ensure Prisma disconnects properly
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
