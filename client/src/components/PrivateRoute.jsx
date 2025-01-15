import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ roleRequired, element: Component, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation(); // To get the current location for redirection

  // Check for token and role in the useEffect hook
  useEffect(() => {
    if (token && role) {
      setIsLoading(false); // Stop loading once we have token and role
    } else {
      setIsLoading(false); // If no token, stop loading and redirect
    }
  }, [token, role]);

  // Display a loading spinner or text while checking auth status
  if (isLoading) {
    return <div>Loading...</div>; // Or use a spinner component here
  }

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user's role doesn't match the required role, redirect accordingly
  if (role !== roleRequired) {
    const redirectPath = {
      "VENDOR": "/vendor-dashboard",
      "CUSTOMER": "/customer-dashboard",
      "ADMIN": "/admin-dashboard",
    }[role] || "/unauthorized"; // Default to unauthorized if no matching role

    return <Navigate to={redirectPath} replace />;
  }

  // If the user is authorized, render the requested component
  return <Component {...rest} />;
};

export default PrivateRoute;
