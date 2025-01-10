import React from 'react';
import { Link } from 'react-router-dom';  // Ensure that Link is imported
import { useCart } from '../context/CartContext';

const Navbar = ({ toggleSidebar }) => {
  const { state } = useCart();

  // Safely access the items array and count the quantity of items
  const cartItemCount = state?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="navbar-content flex justify-between items-center">
        {/* Logo/Title */}
        <Link to="/" className="navbar-logo">
          <h2 className="text-xl font-semibold">Welcome to Marketplace</h2>
        </Link>

        <div className="navbar-links flex space-x-4">
          {/* Toggle Sidebar Button */}
          <button
            onClick={toggleSidebar}
            className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600"
          >
            Open Sidebar
          </button>

          {/* Cart Link */}
          <Link to="/cart" className="navbar-link text-white">
            Cart ({cartItemCount})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
