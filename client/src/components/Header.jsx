import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  return (
    <header className="bg-sky-600 text-black p-4 shadow-md bg-[url('')] bg-cover bg-center">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">Marketplace</Link>

        {/* Profile and Logout Links */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/profile" 
            className="flex items-center space-x-2 text-lg font-medium hover:text-gray-300"
          >
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </Link>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
