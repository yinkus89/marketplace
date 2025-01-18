import React from "react";
import { Link } from "react-router-dom";

// Import the global navigation utility
import { globalNavigate } from "../utils/globalNavigation";

const Navigation = ({ toggleSidebar }) => {
  const handleLinkClick = (url) => {
    // Using the globalNavigate function for navigation
    globalNavigate(url);
  };

  return (
    <nav className="navbar flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg rounded-lg">
      {/* Left Section (Logo and Sidebar Toggle) */}
      <div className="navbar-left flex items-center space-x-4">
        <button 
          className="sidebar-toggle p-2 text-white bg-gray-700 rounded-full hover:bg-gray-600 transform hover:scale-110 transition-all"
          onClick={toggleSidebar}
        >
          <span className="sidebar-toggle-icon">☰</span>
        </button>
        <Link 
          to="/" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }} 
          className="logo text-3xl font-bold text-yellow-400 transform hover:scale-110 hover:rotate-6 transition-all"
        >
          MyShop
        </Link>
      </div>

      {/* Center Section (Links) */}
      <div className="navbar-center">
        <ul className="navbar-links flex space-x-6">
          {/* General Routes */}
          <li>
            <Link 
              to="/" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }} 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/shop" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('/shop'); }} 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('/about'); }} 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('/contact'); }} 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Contact
            </Link>
          </li>

          {/* Role-Specific Routes */}
          <li>
            <Link 
              to="/admin/dashboard" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('/admin/dashboard'); }} 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Admin Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/vendor/dashboard" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('/vendor/dashboard'); }} 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Vendor Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/customer/dashboard" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('/customer/dashboard'); }} 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Customer Dashboard
            </Link>
          </li>

          {/* Cart */}
          <li>
            <Link 
              to="/cart" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('/cart'); }} 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Cart
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Section (Login Button) */}
      <div className="navbar-right">
        <button 
          onClick={() => handleLinkClick("/login")} 
          className="login-btn px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transform hover:scale-110 transition-all"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
