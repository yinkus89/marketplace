import React, { useState } from "react";
import Sidebar from "./Sidebar";  // Assuming Sidebar is in the same directory

const ParentComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Example of category selection handler
  const handleCategorySelect = (category) => {
    console.log("Selected category:", category);
    // You can add additional logic for when a category is selected
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Sidebar
        onCategorySelect={handleCategorySelect} // Ensure this function is passed
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
};

export default ParentComponent;
