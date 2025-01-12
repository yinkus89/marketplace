import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for data fetching
import { useNavigate } from "react-router-dom"; // For navigation

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for data fetching
  const navigate = useNavigate();

  // UseEffect to handle authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login"); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  // Function to fetch data based on selected tab
  const fetchData = async (tab) => {
    setLoading(true); // Set loading to true before making the request
    try {
      if (tab === "products") {
        const response = await axios.get("http://localhost:4001/api/products");
        setProducts(response.data);
      } else if (tab === "categories") {
        const response = await axios.get("http://localhost:4001/api/categories");
        setCategories(response.data);
      } else if (tab === "users") {
        const response = await axios.get("http://localhost:4001/api/users");
        setUsers(response.data);
      } else if (tab === "orders") {
        const response = await axios.get("http://localhost:4001/api/orders");
        setOrders(response.data);
      }
    } catch (error) {
      setError("Error fetching data. Please try again later.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  // Effect to fetch data when the active tab changes
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // Function to render the active tab's content
  const renderContent = () => {
    if (loading) {
      return <p>Loading...</p>; // Display loading message
    }

    if (error) {
      return <p>{error}</p>; // Display error message
    }

    switch (activeTab) {
      case "products":
        return (
          <div>
            <h2>Manage Products</h2>
            <ul>
              {products.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </div>
        );
      case "categories":
        return (
          <div>
            <h2>Manage Categories</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
          </div>
        );
      case "users":
        return (
          <div>
            <h2>Manage Users</h2>
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.email}</li>
              ))}
            </ul>
          </div>
        );
      case "orders":
        return (
          <div>
            <h2>Manage Orders</h2>
            <ul>
              {orders.map((order) => (
                <li key={order.id}>{order.shippingAddress}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return <div>Welcome to the Admin Dashboard!</div>;
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/admin/login"); // Redirect to login page
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <div className="sidebar open">
        <h2>Admin Dashboard</h2>
        <ul className="category-list">
          <li
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Products
          </li>
          <li
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </li>
          <li
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Content Section */}
      <div className="content">
        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
