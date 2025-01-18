import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setIsLoggedIn(true);
        // Redirect based on role
        if (decodedToken.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (decodedToken.role === "CUSTOMER") {
          navigate("/customer/dashboard");
        } else if (decodedToken.role === "VENDOR") {
          navigate("/vendor/dashboard");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Clear invalid token
      }
    }
  }, [navigate]);

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("http://localhost:4001/api/auth/login", { email, password });

      const { token } = response.data.data;
      localStorage.setItem("token", token);

      const decodedToken = jwt_decode(token);
      setSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => {
        setIsLoggedIn(true);
        if (decodedToken.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (decodedToken.role === "CUSTOMER") {
          navigate("/customer/dashboard");
        } else if (decodedToken.role === "VENDOR") {
          navigate("/vendor/dashboard");
        }
      }, 1000);

    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Network error, please try again later.";
      setError(errorMessage);
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axios.post("http://localhost:4001/api/auth/forgot-password", { email: resetEmail });
      setSuccessMessage("Password reset link has been sent to your email.");
      setShowResetPassword(false);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Network error, please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Welcome Back!</h2>
          <button
            onClick={handleLogout}
            className="w-full py-2 mt-4 bg-gray-600 text-white text-lg font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

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

        {showResetPassword ? (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label htmlFor="resetEmail" className="block text-lg font-medium text-gray-700 mb-2">
                Enter your email
              </label>
              <input
                type="email"
                id="resetEmail"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => setShowResetPassword(false)}
              className="w-full py-2 mt-4 bg-gray-600 text-white text-lg font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to Login
            </button>
          </form>
        ) : (
          // Login Form
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
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {!showResetPassword && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowResetPassword(true)}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-gray-500">
            Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
