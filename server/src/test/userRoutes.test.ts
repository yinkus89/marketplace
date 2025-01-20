import request from 'supertest';
import app from '../server'; // Path to your Express app

describe('User Routes', () => {
  it('should return status 401 if no token is provided', async () => {
    const response = await request(app).get('/user/1');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token, authorization denied');
  });

  it('should return status 200 and user data when authenticated', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };

    // Mock token in headers and mock database response
    const response = await request(app)
      .get('/user/1')
      .set('Authorization', 'valid_token'); // Add valid token in the header

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });
});
