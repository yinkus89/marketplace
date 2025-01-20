import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Importing framer-motion
import VendorSidebar from "../components/VendorSidebar";
import InventoryManagement from "../dashboards/InventoryManagement";
import SalesAnalytics from "../dashboards/SalesAnalytics";
import OrderManagement from "../dashboards/OrderManagement";
import VendorProfile from "../profiles/VendorProfile";
import StoreList from "../components/StoreList";
import CreateStoreForm from "../components/CreateStoreForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { globalNavigateVendor } from "../utils/globalNavigateVendor";

const VendorDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("inventory");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Wrapper function for navigation
  const handleNavigation = (url) => {
    globalNavigateVendor(navigate, url);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      handleNavigation("/login"); // Use globalNavigateVendor
    } else {
      axios
        .get(`${process.env.REACT_APP_API_URL}/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch((err) => {
          setIsAuthenticated(false);
          setLoading(false);
          localStorage.removeItem("token");
          setError(
            err.response?.data?.message ||
              "Authentication failed. Please login again."
          );
          handleNavigation("/login"); // Use globalNavigateVendor
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    handleNavigation("/login"); // Use globalNavigateVendor
  };

  const renderContent = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {activeComponent === "inventory" && <InventoryManagement />}
      {activeComponent === "sales" && <SalesAnalytics />}
      {activeComponent === "orders" && <OrderManagement />}
      {activeComponent === "profile" && <VendorProfile />}
      {activeComponent === "stores" && <StoreList />}
      {activeComponent === "createStore" && <CreateStoreForm />}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center text-red-500 mt-20">
        {error || "You are not authenticated. Please login."}
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <VendorSidebar
        setActiveComponent={setActiveComponent}
        handleLogout={handleLogout}
      />
      <div className="flex-1 p-6 bg-gray-100">{renderContent()}</div>
    </div>
  );
};

export default VendorDashboard;
