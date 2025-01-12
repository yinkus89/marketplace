import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import InventoryManagement from './InventoryManagement';
import SalesAnalytics from './SalesAnalytics';
import OrderManagement from './OrderManagement';
import VendorProfile from './VendorProfile';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For API requests
import Spinner from '../components/spinner';  // Import a spinner component for loading state

const VendorDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('inventory'); // Default view
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [loading, setLoading] = useState(true);  // Loading state for authentication check
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page if no token found
    } else {
      // Optional: Verify token validity via API
      axios.get('http://localhost:4001/api/verify-token', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setIsAuthenticated(true);
        setLoading(false);  // Set loading to false once authentication is successful
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);  // Set loading to false after failed authentication
        localStorage.removeItem('token'); // Remove invalid token
        navigate('/login'); // Redirect to login
      });
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token on logout
    setIsAuthenticated(false); // Update authentication state
    navigate('/login'); // Redirect to login page
  };

  // Function to render the content based on the active tab
  const renderContent = () => {
    switch (activeComponent) {
      case 'inventory':
        return <InventoryManagement />;
      case 'sales':
        return <SalesAnalytics />;
      case 'orders':
        return <OrderManagement />;
      case 'profile':
        return <VendorProfile />;
      default:
        return <InventoryManagement />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar setActiveComponent={setActiveComponent} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {loading ? (
          <Spinner />  // Show a loading spinner while authentication is being checked
        ) : isAuthenticated ? (
          renderContent()  // Show content if authenticated
        ) : (
          <p className="text-center text-red-500">You are not authenticated. Please login.</p>  // Error message if not authenticated
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
