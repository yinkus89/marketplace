// CustomerSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const CustomerSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Customer Dashboard</h2>
      <ul>
        <li><Link to="/customer/orders">My Orders</Link></li>
        <li><Link to="/customer/profile">Profile</Link></li>
        <li><Link to="/customer/settings">Settings</Link></li>
        <li><Link to="/customer/logout">Logout</Link></li>
      </ul>
    </div>
  );
};

export default CustomerSidebar;
