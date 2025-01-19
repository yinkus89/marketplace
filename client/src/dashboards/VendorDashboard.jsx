import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Importing framer-motion
import VendorSidebar from "./VendorSidebar";
import InventoryManagement from "./InventoryManagement";
import SalesAnalytics from "./SalesAnalytics";
import OrderManagement from "./OrderManagement";
import VendorProfile from "../profiles/VendorProfile";
import StoreList from "../components/StoreList";
import CreateStoreForm from "../components/CreateStoreForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const VendorDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("inventory");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
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
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
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
