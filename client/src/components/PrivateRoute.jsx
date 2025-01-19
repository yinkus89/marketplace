import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ roleRequired, element, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation(); // Get current location for redirection

  // Check authentication and role on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    setToken(storedToken);
    setRole(storedRole);
    setIsLoading(false); // Loading complete
  }, []);

  // Show a loading spinner or placeholder during the initial check
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a spinner if desired
  }

  // If no token is found, redirect to Shop page
  if (!token) {
    return <Navigate to="/shop" state={{ from: location }} replace />;
  }

  // Redirect to the correct dashboard if role doesn't match
  if (role !== roleRequired) {
    const redirectPaths = {
      vendor: "/vendor/dashboard",
      customer: "/customer/dashboard",
      admin: "/admin/dashboard",
    };
    const redirectPath = redirectPaths[role] || "/shop"; // Fallback to /shop if the role doesn't match

    return <Navigate to={redirectPath} replace />;
  }

  // Render the passed element if authorized
  return element;
};

export default PrivateRoute;
