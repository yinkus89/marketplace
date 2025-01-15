import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google'; // Use the new Google Login component

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle traditional login (email/password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null); // Clear previous success message

    try {
      const response = await axios.post("http://localhost:4001/api/auth/login", { email, password });

      const { token } = response.data.data;
      localStorage.setItem("token", token);

      const decodedToken = jwt_decode(token);
      setSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => {
        if (decodedToken.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (decodedToken.role === "CUSTOMER") {
          navigate("/customer/dashboard");
        } else if (decodedToken.role === "VENDOR") {
          navigate("/vendor/dashboard");
        }
      }, 1000); // Delay for showing success message

    } catch (error) {
      // Improved error handling
      const errorMessage = error.response ? error.response.data.message : "Network error, please try again later.";
      setError(errorMessage);
      setSuccessMessage(null); // Clear any previous success messages
    } finally {
      setIsLoading(false); // Stop the loading indicator
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async (response) => {
    const { credential } = response; // Get the Google credential (ID token)

    try {
      // Send token to the backend for authentication
      const res = await axios.post("http://localhost:4001/api/auth/google-login", { credential });
      
      const { token } = res.data.data;
      localStorage.setItem("token", token);

      const decodedToken = jwt_decode(token);
      setSuccessMessage("Google Login successful! Redirecting...");

      setTimeout(() => {
        if (decodedToken.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (decodedToken.role === "CUSTOMER") {
          navigate("/customer/dashboard");
        } else if (decodedToken.role === "VENDOR") {
          navigate("/vendor/dashboard");
        }
      }, 1000); // Delay for showing success message

    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Network error, please try again later.";
      setError(errorMessage);
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  // Handle Google Login failure
  const handleGoogleFailure = (error) => {
    setError("Google Login failed. Please try again.");
    console.log(error);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Login</h2>

        {error && (
          <div className="bg-red-200 text-red-800 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-200 text-green-800 p-3 mb-4 rounded">
            {successMessage}
          </div>
        )}

        {/* Traditional Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loader">Logging in...</span> // Add a loader here if you like
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Google Login Button */}
        <div className="mt-4 text-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={handleGoogleFailure}
            useOneTap
            shape="pill"
            className="w-full py-2 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500">Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
