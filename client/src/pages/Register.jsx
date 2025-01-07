import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for navigation

const Register = () => {
  const [name, setName] = useState("");  // State for name
  const [email, setEmail] = useState("");  // State for email
  const [password, setPassword] = useState("");  // State for password

  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add registration logic here (API request or validation)

    // Navigate to login page after successful registration
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="background-3d"></div> {/* 3D background */}
      <div className="content">
        <h1 className="text-4xl font-bold mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Update name state
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
          </div>
          <button type="submit" className="submit-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
