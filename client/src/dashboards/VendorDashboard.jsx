import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import InventoryManagement from "./InventoryManagement";
import SalesAnalytics from "./SalesAnalytics";
import OrderManagement from "./OrderManagement";
import VendorProfile from "./VendorProfile";
import StoreList from "../components/StoreList"; // Import StoreList
import CreateStoreForm from "../components/CreateStoreForm"; // Import CreateStoreForm
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For API requests
import Spinner from "../components/Spinner"; // Import a spinner component for loading state

const VendorDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("inventory"); // Default view
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [loading, setLoading] = useState(true); // Loading state for authentication check
  const [error, setError] = useState(null); // Error state for authentication
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if no token found
    } else {
      axios
        .get(`${process.env.REACT_APP_API_URL}/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsAuthenticated(true);
          setLoading(false); // Set loading to false once authentication is successful
        })
        .catch(() => {
          setIsAuthenticated(false);
          setLoading(false); // Set loading to false after failed authentication
          localStorage.removeItem("token"); // Remove invalid token
          setError("Authentication failed. Please login again.");
          navigate("/login"); // Redirect to login
        });
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token on logout
    setIsAuthenticated(false); // Update authentication state
    navigate("/login"); // Redirect to login page
  };

  // Function to render the content based on the active tab
  const renderContent = () => {
    switch (activeComponent) {
      case "inventory":
        return <InventoryManagement />;
      case "sales":
        return <SalesAnalytics />;
      case "orders":
        return <OrderManagement />;
      case "profile":
        return <VendorProfile />;
      case "stores":
        return <StoreList />; // Render StoreList component
      case "createStore":
        return <CreateStoreForm />; // Render CreateStoreForm component
      default:
        return <InventoryManagement />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        setActiveComponent={setActiveComponent}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {loading ? (
          <Spinner /> // Show a loading spinner while authentication is being checked
        ) : isAuthenticated ? (
          renderContent() // Show content if authenticated
        ) : (
          <div className="text-center text-red-500">
            {error || "You are not authenticated. Please login."}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
