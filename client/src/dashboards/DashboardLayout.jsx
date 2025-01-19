import React, { useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar"; // Corrected path
import VendorSidebar from "./VendorSidebar"; // Corrected path
import CustomerSidebar from "./CustomerSidebar"; // Corrected path
import AdminDashboard from "../admin/AdminDashboard";
import VendorDashboard from "../dashboards/VendorDashboard";
import CustomerDashboard from "../dashboards/CustomerDashboard";
import AdminSettings from "../admin/AdminSettings"; // Admin settings page
import Orders from "../pages/Orders"; // Admin orders page
import AdminProfile from "../profiles/AdminProfile";
import ProductPage from "../dashboards/ProductsPage";
import CategoryPage from "../components/CategoryPage";

const DashboardLayout = () => {
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const sidebarState = localStorage.getItem("isSidebarOpen");

    if (role) {
      setUserRole(role); // Set the user role if it exists
    } else {
      setUserRole(""); // If no role found, set to an empty string (unauthorized)
    }

    if (sidebarState !== null) {
      setIsSidebarOpen(JSON.parse(sidebarState)); // Set sidebar state from localStorage
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => {
      const newState = !prevState;
      localStorage.setItem("isSidebarOpen", JSON.stringify(newState)); // Save sidebar state
      return newState;
    });
  };

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return (
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        );
      case "vendor":
        return <VendorDashboard />;
      case "customer":
        return <CustomerDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  const renderSidebar = () => {
    switch (userRole) {
      case "admin":
        return <AdminSidebar />;
      case "vendor":
        return <VendorSidebar />;
      case "customer":
        return <CustomerSidebar />;
      default:
        return null;
    }
  };

  // Show loading state while determining the role
  if (userRole === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}>
        {renderSidebar()}
      </div>

      {/* Main Content */}
      <div className={`content-container ${isSidebarOpen ? "" : "full-width"}`}>
        <header className="dashboard-header">
          {/* Toggle Sidebar button visible only on desktop */}
          <button
            className="hamburger-icon"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
          <h1>Dashboard</h1>
        </header>
        {renderDashboard()}
      </div>
    </div>
  );
};

export default DashboardLayout;
