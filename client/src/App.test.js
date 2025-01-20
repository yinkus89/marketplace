// src/App.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import supertest from 'supertest';

let server: any;

beforeAll((done) => {
  server = app.listen(4001, done);  // Start the server
});

afterAll((done) => {
  server.close(done);  // Close the server after tests
});
describe('App Component', () => {
  
  test('renders welcome message', () => {
    render(<App />);
    const linkElement = screen.getByText(/Welcome to My App/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('button click updates state', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /Click Me/i });
    fireEvent.click(button);
    const updatedText = screen.getByText(/You clicked the button!/i);
    expect(updatedText).toBeInTheDocument();
  });

});
