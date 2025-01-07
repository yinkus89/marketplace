// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulating authentication
    if (email === 'user@example.com' && password === 'password123') {
      // Redirect user to order tracking/dashboard
      navigate('/orders');
    } else {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
