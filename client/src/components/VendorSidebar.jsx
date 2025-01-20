import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for active styles

const VendorSidebar = ({ setActiveComponent, handleLogout }) => {
  return (
    <div className="sidebar w-60 bg-gray-800 text-white">
      <h2 className="text-2xl p-4">Vendor Dashboard</h2>
      <ul>
        <li>
          <NavLink
            to="/vendor/inventory"
            className={({ isActive }) =>
              `block p-4 hover:bg-gray-700 cursor-pointer ${isActive ? 'bg-gray-600' : ''}`
            }
          >
            Inventory Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vendor/sales"
            className={({ isActive }) =>
              `block p-4 hover:bg-gray-700 cursor-pointer ${isActive ? 'bg-gray-600' : ''}`
            }
          >
            Sales Analytics
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vendor/orders"
            className={({ isActive }) =>
              `block p-4 hover:bg-gray-700 cursor-pointer ${isActive ? 'bg-gray-600' : ''}`
            }
          >
            Order Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vendor/profile"
            className={({ isActive }) =>
              `block p-4 hover:bg-gray-700 cursor-pointer ${isActive ? 'bg-gray-600' : ''}`
            }
          >
            Vendor Profile
          </NavLink>
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
