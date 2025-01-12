// AdminSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/categories">Categories</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/orders">Orders</Link></li>
        <li><Link to="/admin/settings">Settings</Link></li>
        <li><Link to="/admin/logout">Logout</Link></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
