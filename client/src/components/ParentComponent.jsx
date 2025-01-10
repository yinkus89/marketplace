import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Make sure the path is correct based on your file structure

const ParentComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  return (
    <div>
      <Sidebar onCategorySelect={handleCategorySelect} />
      {/* Other content, you can display selectedCategory or other parts of your app here */}
      {selectedCategory && <p>Selected Category: {selectedCategory}</p>}
    </div>
  );
};

export default ParentComponent;
