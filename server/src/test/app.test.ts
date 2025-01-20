// src/app.test.ts
import request from 'supertest';
import server from '../server'; // Import the server instance
// src/app.test.ts
import myUtilityFunction, { sum } from '../types/myUtilityFile';  // Correct import for default and named exports


// Mock Prisma client or other services
jest.mock('./prisma/prismaClient');

describe('Health Check Route', () => {
  it('should return status 200 and message "Server is healthy"', async () => {
    const response = await request(server).get('/health');
    expect(response.status).toBe(200);  // Check if the response status is 200
    expect(response.body.message).toBe('Server is healthy');  // Check if the response body contains the expected message
  });
});

describe('sum function', () => {
  it('should return the correct sum of two numbers', () => {
    const result = sum(1, 2);
    expect(result).toBe(3);  // Ensure the sum function works as expected
  });
});

describe('Utility Functions', () => {
  it('should call myUtilityFunction correctly', () => {
    const result = myUtilityFunction();
    expect(result).toBe(true);  // Ensure the utility function works as expected
  });

  it('should correctly sum two numbers', () => {
    const result = sum(2, 3);
    expect(result).toBe(5);  // Ensure the sum function works as expected
  });
});

// Close the server after tests
afterAll(() => {
  server.close();  // Close the server properly after tests
});
