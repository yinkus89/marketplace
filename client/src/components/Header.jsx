import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-sky-600 text-black p-4 shadow-md bg-[url('')] bg-cover bg-center">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">Marketplace</Link>

        

        {/* Cart Icon (Removed from here) */}
        {/* <div>
          <Link to="/cart" className="flex items-center space-x-2 hover:text-gray-300">
            <span className="material-icons"></span>
            <span>Cart</span>
          </Link>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
