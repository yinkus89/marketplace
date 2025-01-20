import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ categories = [] }) => {
  const navigate = useNavigate();

  // Handle category click and navigate to the shop page with category filter
  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${categoryName}`);
  };

  if (categories.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-64 bg-gray-800 text-white fixed top-0 left-0 h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            className="cursor-pointer hover:bg-gray-600 p-2 rounded-lg"
            onClick={() => handleCategoryClick(category.name)} // Navigate to shop with category
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default Sidebar;
