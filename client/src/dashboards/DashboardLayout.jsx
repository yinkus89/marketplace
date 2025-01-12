import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar'; // Assuming you have an AdminSidebar component
import VendorSidebar from './VendorSidebar'; // Assuming you have a VendorSidebar component
import CustomerSidebar from './CustomerSidebar'; // Assuming you have a CustomerSidebar component
import AdminDashboard from './AdminDashboard'; // Your Admin Dashboard Component
import VendorDashboard from './VendorDashboard'; // Your Vendor Dashboard Component
import CustomerDashboard from './CustomerDashboard'; // Your Customer Dashboard Component

const DashboardLayout = () => {
  const [userRole, setUserRole] = useState(null);  // To store user role

  // Effect to get the user role from localStorage or another source
  useEffect(() => {
    const role = localStorage.getItem('userRole');  // Assuming role is stored in localStorage
    if (!role) {
      // Redirect or show an error if role is not found
      window.location.href = '/login';  // For example, redirect to login
    } else {
      setUserRole(role);
    }
  }, []);

  // Render the correct dashboard based on the user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'VENDOR':
        return <VendorDashboard />;
      case 'CUSTOMER':
        return <CustomerDashboard />;
      default:
        return <p>Unauthorized</p>;
    }
  };

  // Conditionally render the sidebar based on the user role
  const renderSidebar = () => {
    switch (userRole) {
      case 'ADMIN':
        return <AdminSidebar />;
      case 'VENDOR':
        return <VendorSidebar />;
      case 'CUSTOMER':
        return <CustomerSidebar />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar-container">
        {renderSidebar()}
      </div>

      {/* Main Content Section */}
      <div className="content-container">
        <nav>Shared Navigation</nav>  {/* Shared navigation */}
        {renderDashboard()} {/* Render the dashboard content based on user role */}
      </div>
    </div>
  );
};

export default DashboardLayout;
