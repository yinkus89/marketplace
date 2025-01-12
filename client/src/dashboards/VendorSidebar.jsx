// VendorSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const VendorSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Vendor Dashboard</h2>
      <ul>
        <li><Link to="/vendor/inventory">Inventory</Link></li>
        <li><Link to="/vendor/orders">Orders</Link></li>
        <li><Link to="/vendor/profile">Profile</Link></li>
        <li><Link to="/vendor/logout">Logout</Link></li>
      </ul>
    </div>
  );
};

export default VendorSidebar;
