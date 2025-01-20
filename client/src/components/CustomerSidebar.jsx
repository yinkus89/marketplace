import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const CustomerSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Clear token or user session
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className={`lg:flex ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
      {/* Sidebar content */}
      <div className="sidebar p-4 bg-gray-800 text-white h-full lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-full">
        <h2 className="text-2xl font-semibold mb-6">Customer Dashboard</h2>
        <ul>
          <li>
            <NavLink
              to="/customer/orders"
              className={({ isActive }) =>
                `block py-2 px-4 rounded-md hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
              }
            >
              My Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/profile"
              className={({ isActive }) =>
                `block py-2 px-4 rounded-md hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/settings"
              className={({ isActive }) =>
                `block py-2 px-4 rounded-md hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
              }
            >
              Settings
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="block py-2 px-4 w-full text-left rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Hamburger Menu */}
      <button
        className="lg:hidden text-white text-2xl absolute top-4 right-4"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default CustomerSidebar;
