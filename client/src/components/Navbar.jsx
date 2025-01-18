import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // Importing the Hamburger Icon from react-icons

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <Link to="/" className="text-xl font-semibold">
          Welcome to Marketplace
        </Link>

        {/* Hamburger Icon for Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl" // Always visible
        >
          <FaBars />
        </button>

        {/* Cart Link (Optional) */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="text-white">
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
