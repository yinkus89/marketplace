// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';  // Ensure that Link is imported
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { state } = useCart();

  // Safely access the items array
  const cartItemCount = state?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <h2>Welcome to Marketplace  </h2>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link"></Link>
          <Link to="/cart" className="navbar-link">
            Cart ({cartItemCount})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

