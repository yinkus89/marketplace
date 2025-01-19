import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Corrected path
import VendorSidebar from "./VendorSidebar"; // Corrected path
import CustomerSidebar from "./CustomerSidebar"; // Corrected path
import AdminDashboard from "../dashboards/AdminDashboard";
import VendorDashboard from "../dashboards/VendorDashboard";
import CustomerDashboard from "../dashboards/CustomerDashboard";

const DashboardLayout = () => {
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role"); // Get role from localStorage
    if (role) {
      setUserRole(role); // Set the user role if it exists
    } else {
      setUserRole(""); // If no role found, set to an empty string (unauthorized)
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
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
