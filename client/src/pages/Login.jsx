import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Added state for success message
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true while waiting for the request

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:4001/api/auth/login", {
        email,
        password,
      });

      const { token, role } = response.data;

      // Store the token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Set success message
      setSuccessMessage("Login successful! Redirecting...");

      // Redirect based on user role immediately after success
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "customer") {
          navigate("/customer/dashboard");
        } else if (role === "vendor") {
          navigate("/vendor/dashboard");
        }
      }, 1000); // Reduce the delay to make the redirect faster

    } catch (error) {
      setError("Invalid credentials or server error.");
      setSuccessMessage(null); // Clear success message on error
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false when the request is finished
    }
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
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-500">Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
