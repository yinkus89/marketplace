import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ onCategorySelect }) => {
  const categories = [
    { name: "Electronics", description: "Devices, gadgets, and accessories" },
    { name: "Clothing", description: "Apparel, shoes, and accessories" },
    { name: "Home Appliances", description: "Kitchen and home appliances" },
    { name: "Furniture", description: "Furniture for home and office" },
    { name: "Books", description: "All kinds of books" },
    { name: "Sports", description: "Sports equipment and apparel" },
    { name: "Toys", description: "Toys for children" },
    { name: "Beauty", description: "Beauty and personal care products" },
    { name: "Food & Beverages", description: "Grocery and beverages" },
  ];

  return (
    <div className="sidebar bg-gray-800 text-white p-4 w-64 sm:w-48 shadow-lg rounded-lg transform transition-all hover:scale-105">
      <h2 className="text-2xl font-semibold mb-6 text-center">Categories</h2>
      
      <ul>
        {categories.map((category) => (
          <li key={category.name} className="mb-4">
            <Link
              to={`/shop/${category.name.toLowerCase()}`}
              onClick={() => onCategorySelect(category.name)}
              className="block text-lg font-medium hover:text-blue-400 transition duration-300"
            >
              {category.name}
            </Link>
            <p className="text-xs text-gray-400 mt-1">{category.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
