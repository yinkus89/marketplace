import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed and imported

const CustomerLoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual API endpoint for customer login
      const response = await axios.post('http://localhost:4001/api/auth/login', {
        email,
        password,
      });

      // Extract role and token from the response
      const { role, token } = response.data;

      // Handle successful login
      console.log('Login successful:', response.data);
      onLogin(token); // Pass the token to the parent component or store it

      // Redirect to the appropriate dashboard based on the role
      switch (role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'VENDOR':
          navigate('/vendor/dashboard');
          break;
        case 'CUSTOMER':
        default:
          navigate('/customer/dashboard'); // Redirect customer to their dashboard
          break;
      }
    } catch (error) {
      // Handle login errors
      setError(
        error.response?.data?.message || 'Invalid credentials, please try again!'
      );
    }
  };

  return (
    <div className="login-page">
      <div className="background-3d"></div> {/* Optional 3D background */}
      <div className="content">
        <h2 className="text-2xl font-semibold text-center mb-6">Customer Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
