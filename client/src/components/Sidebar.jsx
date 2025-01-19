import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For navigation

const Sidebar = ({ handleLogout }) => {
  const [userRole, setUserRole] = useState(''); // Store role of the logged-in user

  // Retrieve user role from localStorage or state
  useEffect(() => {
    const role = localStorage.getItem('userRole'); // Assume role is saved in localStorage
    setUserRole(role);
  }, []);

  // Common sidebar content for all roles
  const commonSidebar = (
    <ul>
      <li>
        <button onClick={handleLogout} className="block py-2 px-4 w-full text-left rounded-md hover:bg-gray-700">
          Logout
        </button>
      </li>
    </ul>
  );

  // Sidebar content for Admin
  const adminSidebar = (
    <>
      <h2 className="text-2xl p-4">Admin Dashboard</h2>
      <ul>
        <li><Link to="/admin/products" className="block p-4 hover:bg-gray-700">Products</Link></li>
        <li><Link to="/admin/categories" className="block p-4 hover:bg-gray-700">Categories</Link></li>
        <li><Link to="/admin/users" className="block p-4 hover:bg-gray-700">Users</Link></li>
        <li><Link to="/admin/orders" className="block p-4 hover:bg-gray-700">Orders</Link></li>
        <li><Link to="/admin/settings" className="block p-4 hover:bg-gray-700">Settings</Link></li>
      </ul>
      {commonSidebar}
    </>
  );

  // Sidebar content for Customer
  const customerSidebar = (
    <>
      <h2 className="text-2xl p-4">Customer Dashboard</h2>
      <ul>
        <li><Link to="/customer/orders" className="block p-4 hover:bg-gray-700">My Orders</Link></li>
        <li><Link to="/customer/profile" className="block p-4 hover:bg-gray-700">Profile</Link></li>
        <li><Link to="/customer/settings" className="block p-4 hover:bg-gray-700">Settings</Link></li>
      </ul>
      {commonSidebar}
    </>
  );

  // Sidebar content for Vendor
  const vendorSidebar = (
    <>
      <h2 className="text-2xl p-4">Vendor Dashboard</h2>
      <ul>
        <li><Link to="/vendor/inventory" className="block p-4 hover:bg-gray-700">Inventory Management</Link></li>
        <li><Link to="/vendor/sales" className="block p-4 hover:bg-gray-700">Sales Analytics</Link></li>
        <li><Link to="/vendor/orders" className="block p-4 hover:bg-gray-700">Order Management</Link></li>
        <li><Link to="/vendor/profile" className="block p-4 hover:bg-gray-700">Vendor Profile</Link></li>
      </ul>
      {commonSidebar}
    </>
  );

  // Render sidebar based on user role
  const renderSidebar = () => {
    switch (userRole) {
      case 'admin':
        return adminSidebar;
      case 'customer':
        return customerSidebar;
      case 'vendor':
        return vendorSidebar;
      default:
        return <div>Unauthorized access</div>;
    }
  };

  return <div className="sidebar w-60 bg-gray-800 text-white">{renderSidebar()}</div>;
};

export default Sidebar;
