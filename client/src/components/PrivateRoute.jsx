import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ roleRequired, element, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation(); // Get current location for redirection

  // Role redirection mapping (you can centralize this if you have multiple roles)
  const redirectPaths = {
    vendor: "/vendor/dashboard",
    customer: "/customer/dashboard",
    admin: "/admin/dashboard",
  };

  // Check authentication and role on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    // If token exists, set token and role in state
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }

    setIsLoading(false); // Loading complete
  }, []);

  // Show a loading spinner or placeholder during the initial check
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a spinner if desired
  }

  // If no token is found, redirect to login page
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role doesn't match the required role, redirect to appropriate dashboard
  if (role !== roleRequired) {
    const redirectPath = redirectPaths[role] || "/login"; // Fallback to /login if role doesn't match

    return <Navigate to={redirectPath} replace />;
  }

  // Render the passed element if authorized
  return element;
};

export default PrivateRoute;
