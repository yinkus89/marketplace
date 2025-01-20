import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // Used to render nested routes
import AdminSidebar from './AdminSidebar'; // Assuming these are your sidebar components
import VendorSidebar from './VendorSidebar';
import CustomerSidebar from './CustomerSidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';

const DashboardLayout = () => {
  const [role, setRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // To toggle sidebar visibility

  useEffect(() => {
    // Fetch the user role from localStorage or context
    const storedRole = localStorage.getItem('role'); // Or use context API if available
    setRole(storedRole);
  }, []);

  if (!role) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="lds-dual-ring"></div> {/* Loading spinner */}
      </div>
    ); // Show a loading spinner if the role isn't available
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render the correct sidebar based on the role
  const renderSidebar = () => {
    if (role === 'admin') return <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />;
    if (role === 'vendor') return <VendorSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />;
    if (role === 'customer') return <CustomerSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />;
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'} w-64 bg-secondary-bg text-white p-4 shadow-lg transition-transform duration-300`}>
        {renderSidebar()} {/* Render the sidebar based on role */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="dashboard-header flex justify-between items-center bg-white p-4 shadow-md mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {role === 'admin' && 'Admin Dashboard'}
            {role === 'vendor' && 'Vendor Dashboard'}
            {role === 'customer' && 'Customer Dashboard'}
          </h1>

          {/* Mobile Sidebar toggle button */}
          <button 
            onClick={toggleSidebar}
            className="hamburger-menu p-2 bg-primary-bg text-white rounded-lg md:hidden">
            <i className="fas fa-bars"></i> {/* Hamburger icon */}
          </button>
        </div>

        {/* Render Outlet (Nested routes) */}
        <div className="content-area bg-white p-6 rounded-lg shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
