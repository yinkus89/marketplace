import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ setActiveComponent, handleLogout }) => {
  return (
    <div className="sidebar w-60 bg-gray-800 text-white">
      <h2 className="text-2xl p-4">Vendor Dashboard</h2>
      <ul>
        <li onClick={() => setActiveComponent('inventory')}>
          <Link to="#" className="block p-4 hover:bg-gray-700">Inventory Management</Link>
        </li>
        <li onClick={() => setActiveComponent('sales')}>
          <Link to="#" className="block p-4 hover:bg-gray-700">Sales Analytics</Link>
        </li>
        <li onClick={() => setActiveComponent('orders')}>
          <Link to="#" className="block p-4 hover:bg-gray-700">Order Management</Link>
        </li>
        <li onClick={() => setActiveComponent('profile')}>
          <Link to="#" className="block p-4 hover:bg-gray-700">Vendor Profile</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="block w-full p-4 bg-red-600 hover:bg-red-500">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
