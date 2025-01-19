import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { globalNavigate } from '../utils/globalNavigation';

const Navigation = ({ toggleSidebar, isAuthenticated, roles }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="navbar-left flex items-center space-x-4">
        <button 
          className="sidebar-toggle p-2 text-white bg-gray-700 rounded-full hover:bg-gray-600 transform hover:scale-110 transition-all"
          onClick={toggleSidebar}
        >
          <span className="sidebar-toggle-icon">☰</span>
        </button>
        <Link 
          to="/" 
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
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/shop" 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Contact
            </Link>
          </li>

          {/* Role-Specific Routes */}
          {isAuthenticated && roles.includes('admin') && (
            <li>
              <Link 
                to="/admin/dashboard" 
                className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
              >
                Admin Dashboard
              </Link>
            </li>
          )}
          {isAuthenticated && roles.includes('vendor') && (
            <li>
              <Link 
                to="/vendor/dashboard" 
                className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
              >
                Vendor Dashboard
              </Link>
            </li>
          )}
          {isAuthenticated && roles.includes('customer') && (
            <li>
              <Link 
                to="/customer/dashboard" 
                className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
              >
                Customer Dashboard
              </Link>
            </li>
          )}

          {/* Cart */}
          <li>
            <Link 
              to="/cart" 
              className="text-lg hover:text-yellow-400 transform hover:scale-110 transition-all"
            >
              Cart
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Section (Login Button) */}
      <div className="navbar-right">
        {!isAuthenticated ? (
          <button 
            onClick={() => globalNavigate(navigate, "/login")} 
            className="login-btn px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transform hover:scale-110 transition-all"
          >
            Login
          </button>
        ) : (
          <button 
            onClick={() => globalNavigate(navigate, "/logout")} 
            className="login-btn px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
