import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Assuming you are using axios for API calls

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // Default to "CUSTOMER" (uppercase)
  const [error, setError] = useState(null); // For handling errors
  const [success, setSuccess] = useState(null); // For handling success message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation (you can expand this with more checks)
    if (!name || !email || !password) {
      setError("All fields are required!");
      return;
    }

    // Convert role to uppercase to match backend validation
    const normalizedRole = role.toUpperCase();

    try {
      // Assuming you have an API endpoint for user registration
      const response = await axios.post("http://localhost:4001/api/auth/register", {
        name,
        email,
        password,
        role: normalizedRole,  // Send the uppercase role
      });

      // On successful registration, clear any previous error and show success message
      setError(null);
      setSuccess("Registration successful!");

      // Optionally, store the role in localStorage (although backend should handle roles)
      localStorage.setItem("role", normalizedRole);

      // Redirect based on the selected role
      if (normalizedRole === "ADMIN") {
        navigate("/admin");
      } else if (normalizedRole === "VENDOR") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      // Handle registration errors (e.g., email already in use)
      setError(err.response ? err.response.data.message : "Something went wrong.");
    }
  };

  return (
    <div className="register-container min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        
        {/* Display success message */}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        {/* Display error message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="VENDOR">Vendor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;