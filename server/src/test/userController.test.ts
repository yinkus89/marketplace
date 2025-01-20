import request from 'supertest';
import app from '../server'; // Path to your Express app
import prismaClient from '../prisma/prismaClient'; // Correct import of Prisma client

jest.mock('../prisma/prismaClient'); // Mock Prisma Client

describe('User Controller', () => {
  // Reset mocks between tests to avoid state carry-over
  afterEach(() => {
    jest.clearAllMocks(); // Clears all mocks
    prismaClient.$disconnect(); // Ensure Prisma disconnects after tests
  });

  describe('GET /user/:id', () => {
    it('should return status 200 and user data when user is found', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };
      prismaClient.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app).get('/user/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user is not found', async () => {
      prismaClient.user.findUnique = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/user/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 if server encounters an error', async () => {
      prismaClient.user.findUnique = jest.fn().mockRejectedValue(new Error('Server Error'));

      const response = await request(app).get('/user/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server Error');
    });
  });
});
