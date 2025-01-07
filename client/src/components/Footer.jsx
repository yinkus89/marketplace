// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-10">
      <div className="container mx-auto flex justify-between">
        {/* Footer Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link to="/shop" className="hover:text-gray-400">Shop</Link></li>
            <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-gray-400">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Contact</h4>
          <p>123 Marketplace St.</p>
          <p>info@marketplace.com</p>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Follow Us</h4>
          <div className="flex space-x-4">
            <Link to="#" className="hover:text-gray-400">Facebook</Link>
            <Link to="#" className="hover:text-gray-400">Instagram</Link>
            <Link to="#" className="hover:text-gray-400">Twitter</Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-6 text-sm">
        <p>&copy; 2025 Marketplace, All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
