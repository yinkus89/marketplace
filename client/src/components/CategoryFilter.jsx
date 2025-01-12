import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryFilter = ({ categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    // Navigate to the filtered shop page for the selected category
    navigate(`/shop/${categoryName}`);
  };

  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.name} onClick={() => handleCategoryClick(category.name)}>
            <strong>{category.name}</strong>
            <p>{category.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
