import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { globalNavigateAdmin } from "../utils/globalNavigateAdmin";
import { globalNavigateVendor } from "../utils/globalNavigateVendor";
import { globalNavigateUser } from "../utils/globalNavigateUser";

const PrivateRoute = ({ roleRequired, element, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation(); // Get current location for redirection

  // Role-based navigation utilities
  const navigateMap = {
    admin: globalNavigateAdmin,
    vendor: globalNavigateVendor,
    customer: globalNavigateUser,
  };

  // Role redirection mapping
  const redirectPaths = {
    admin: "/admin/dashboard",
    vendor: "/vendor/dashboard",
    customer: "/customer/dashboard",
  };

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
    const navigateToLogin = navigateMap[roleRequired];
    if (navigateToLogin) {
      navigateToLogin(location, "/login");
    }
    return null; // Prevent further rendering
  }

  // If role doesn't match the required role, redirect to appropriate dashboard
  if (role !== roleRequired) {
    const navigateToDashboard = navigateMap[role];
    const redirectPath = redirectPaths[role] || "/login"; // Fallback to /login if role doesn't match

    if (navigateToDashboard) {
      navigateToDashboard(location, redirectPath);
    }
    return null; // Prevent further rendering
  }

  // Render the passed element if authorized
  return element;
};

export default PrivateRoute;
