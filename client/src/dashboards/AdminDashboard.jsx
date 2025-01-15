import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for data fetching
import { useNavigate } from "react-router-dom"; // For navigation
import { io } from "socket.io-client"; // For Socket.IO real-time updates
import Spinner from "../components/Spinner";  // Assuming you have a Spinner component for loading state

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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
        setProducts(response.data);
      } else if (tab === "categories") {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
        setCategories(response.data);
      } else if (tab === "users") {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        setUsers(response.data);
      } else if (tab === "orders") {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`);
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

  // Setting up real-time updates for products using Socket.IO
  useEffect(() => {
    const socket = io("http://localhost:4001"); // Your socket server URL

    // Listen for product updates
    socket.on("productUpdated", (updatedProduct) => {
      setProducts((prevProducts) => {
        const index = prevProducts.findIndex((prod) => prod.id === updatedProduct.id);
        if (index !== -1) {
          prevProducts[index] = updatedProduct;
          return [...prevProducts];
        } else {
          return [...prevProducts, updatedProduct]; // Add new product if not present
        }
      });
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to render the active tab's content
  const renderContent = () => {
    if (loading) {
      return <Spinner />; // Display loading spinner while loading
    }

    if (error) {
      return (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => fetchData(activeTab)} 
            className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
          >
            Retry
          </button>
        </div>
      );
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-blue-600 text-white p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer p-2 rounded-md ${activeTab === "products" ? "bg-blue-700 text-white" : "hover:bg-blue-700"}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </li>
          <li
            className={`cursor-pointer p-2 rounded-md ${activeTab === "categories" ? "bg-blue-700 text-white" : "hover:bg-blue-700"}`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </li>
          <li
            className={`cursor-pointer p-2 rounded-md ${activeTab === "users" ? "bg-blue-700 text-white" : "hover:bg-blue-700"}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </li>
          <li
            className={`cursor-pointer p-2 rounded-md ${activeTab === "orders" ? "bg-blue-700 text-white" : "hover:bg-blue-700"}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 p-2 rounded-md w-full mt-6"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
