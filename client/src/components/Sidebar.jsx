import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ onCategorySelect, isSidebarOpen, toggleSidebar }) => {
  const categories = [
    { name: "Electronics", description: "Devices and gadgets" },
    { name: "Clothing", description: "Apparel and accessories" },
    { name: "Home & Kitchen", description: "Furniture and kitchen appliances" },
    { name: "Sports", description: "Sports equipment and gear" },
    { name: "Toys", description: "Toys for children" },
    { name: "Books", description: "Books of all genres" },
    { name: "Beauty", description: "Beauty products and skincare" },
    { name: "Furniture", description: "Furniture for home and office" },
    { name: "Food & Beverage", description: "Groceries and beverages" },
    { name: "Automotive", description: "Automobile parts and accessories" },
    { name: "Health", description: "Health and wellness products" },
    { name: "Gaming", description: "Gaming consoles and accessories" },
    { name: "Music", description: "Musical instruments and accessories" },
    { name: "Photography", description: "Cameras and photography equipment" },
    { name: "Office Supplies", description: "Office equipment and supplies" },
    { name: "Jewelry", description: "Gold, silver, and precious jewelry" },
    { name: "Pet Supplies", description: "Products for pets" },
    { name: "Garden", description: "Gardening tools and accessories" },
    { name: "Travel", description: "Travel accessories and luggage" },
    { name: "Gift Cards", description: "Gift cards for various brands" },
  ];

  return (
    <div
      className={`sidebar bg-gray-800 text-white p-4 shadow-lg rounded-lg fixed left-0 top-0 h-full z-10 transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`} // Tailwind class for sliding effect
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Categories</h2>

      {/* Close button */}
      <button
        onClick={toggleSidebar}
        className="text-white mb-4 p-2 rounded bg-blue-500 hover:bg-blue-400 transition absolute top-4 right-4 sm:hidden"
      >
        Close
      </button>

      <ul>
        {categories.map((category) => (
          <li key={category.name} className="mb-4">
            <Link
              to={`/shop/${category.name
                .toLowerCase()
                .replace(/ & /g, "-")
                .replace(/ /g, "-")}`}
              onClick={() => {
                onCategorySelect(category.name); // Set selected category
                toggleSidebar(); // Close sidebar
              }}
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
