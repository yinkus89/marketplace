import React from "react";

const AdminSidebar = ({ setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const handleTabChange = (tab) => {
    setActiveTab(tab);  // Update active tab when a link is clicked
    if (window.innerWidth < 1024) {
      setSidebarOpen(false); // Close sidebar after selecting a tab on mobile
    }
  };

  return (
    <div
      className={`fixed z-50 bg-blue-600 text-white p-4 flex flex-col lg:static lg:w-64 ${
        sidebarOpen ? "block" : "hidden"
      } lg:block`}
    >
      <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => handleTabChange("products")}
            className="p-2 rounded-md hover:bg-blue-700 w-full text-left"
          >
            Products
          </button>
        </li>
        <li>
          <button
            onClick={() => handleTabChange("categories")}
            className="p-2 rounded-md hover:bg-blue-700 w-full text-left"
          >
            Categories
          </button>
        </li>
        <li>
          <button
            onClick={() => handleTabChange("users")}
            className="p-2 rounded-md hover:bg-blue-700 w-full text-left"
          >
            Users
          </button>
        </li>
        <li>
          <button
            onClick={() => handleTabChange("orders")}
            className="p-2 rounded-md hover:bg-blue-700 w-full text-left"
          >
            Orders
          </button>
        </li>
        <li>
          <button
            onClick={() => handleTabChange("settings")}
            className="p-2 rounded-md hover:bg-blue-700 w-full text-left"
          >
            Settings
          </button>
        </li>
        {/* Admin Profile Link */}
        <li>
          <button
            onClick={() => handleTabChange("adminProfile")}
            className="p-2 rounded-md hover:bg-blue-700 w-full text-left"
          >
            Admin Profile
          </button>
        </li>
        <li>
          <button
            onClick={() => handleTabChange("logout")}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md w-full text-left mt-6"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
