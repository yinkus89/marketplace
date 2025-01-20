import request from 'supertest';
import app from '../server'; // Ensure this points to the actual app file
import { mockRequest, mockResponse } from 'mock-req-res'; 
import { Request, Response } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import jwt from 'jsonwebtoken'; // Use this to generate a mock token

// Mock user object (for valid token test)
const mockUser = {
  userId: 1,
  role: 'user',
  email: 'testuser@example.com',
};

// Mock JWT token generation function
const generateMockToken = (user: { userId: number; role: string; email: string }) => {
  return jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
};

describe('Auth Middleware', () => {
  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/protected-route');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');  // Adjust this according to your actual response structure
  });

  it('should return 403 if token is invalid', async () => {
    const response = await request(app)
      .get('/protected-route')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Invalid token');  // Adjust this according to your actual response structure
  });

  it('should allow access if token is valid', async () => {
    const validToken = generateMockToken(mockUser);  // Generate mock token
    const response = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${validToken}`);  // Set valid token
    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(mockUser);  // Ensure that the response body contains the mock user object
  });
});

// Unit test for verifyToken middleware (isolated test with mockRequest and mockResponse)
describe('verifyToken Middleware', () => {
  it('should attach user object to the request when token is valid', async () => {
    const validToken = generateMockToken(mockUser);
    const req = mockRequest({ headers: { Authorization: `Bearer ${validToken}` } });
    const res = mockResponse();
    const next = jest.fn();

    // Call the verifyToken middleware
    await verifyToken(req as Request, res as Response, next);

    // Check if the middleware attached the decoded user to the request
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledTimes(1); // Ensure next() was called
  });

  it('should throw an error when token is invalid', async () => {
    const req = mockRequest({ headers: { Authorization: 'Bearer invalidtoken' } });
    const res = mockResponse();
    const next = jest.fn();

    // Call the verifyToken middleware
    await verifyToken(req as Request, res as Response, next);

    // Check if the middleware sent a 403 response for invalid token
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });

  it('should throw an error if no token is provided', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();

    // Call the verifyToken middleware
    await verifyToken(req as Request, res as Response, next);

    // Check if the middleware sent a 401 response for no token
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied, no token provided' });
  });
});
