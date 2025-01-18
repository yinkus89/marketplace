// VendorSidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const VendorSidebar = ({ setActiveComponent, handleLogout }) => {
  return (
    <div className="sidebar w-60 bg-gray-800 text-white">
      <h2 className="text-2xl p-4">Vendor Dashboard</h2>
      <ul>
        <li>
          <Link to="/vendor/inventory">
            <div className="block p-4 hover:bg-gray-700 cursor-pointer">
              Inventory Management
            </div>
          </Link>
        </li>
        <li>
          <Link to="/vendor/sales">
            <div className="block p-4 hover:bg-gray-700 cursor-pointer">
              Sales Analytics
            </div>
          </Link>
        </li>
        <li>
          <Link to="/vendor/orders">
            <div className="block p-4 hover:bg-gray-700 cursor-pointer">
              Order Management
            </div>
          </Link>
        </li>
        <li>
          <Link to="/vendor/profile">
            <div className="block p-4 hover:bg-gray-700 cursor-pointer">
              Vendor Profile
            </div>
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="block w-full p-4 bg-red-600 hover:bg-red-500"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default VendorSidebar;
