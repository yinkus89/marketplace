import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AdminSidebar from "./AdminSidebar";
import Spinner from "../components/Spinner";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products"); // Track the active tab
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Toggle sidebar visibility on mobile
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch data based on the selected tab
  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === "products") {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products`
        );
        setProducts(response.data);
      } else if (tab === "categories") {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/categories`
        );
        setCategories(response.data);
      } else if (tab === "users") {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users`
        );
        setUsers(response.data);
      } else if (tab === "orders") {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders`
        );
        setOrders(response.data);
      }
    } catch (error) {
      setError("Error fetching data. Please try again later.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // Real-time updates with Socket.IO
  useEffect(() => {
    const socket = io("http://localhost:4001");
    socket.on("productUpdated", (updatedProduct) => {
      setProducts((prevProducts) => {
        const index = prevProducts.findIndex(
          (prod) => prod.id === updatedProduct.id
        );
        if (index !== -1) {
          prevProducts[index] = updatedProduct;
          return [...prevProducts];
        } else {
          return [...prevProducts, updatedProduct];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to render content based on the active tab
  const renderContent = () => {
    if (loading) {
      return <Spinner />;
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
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-4 text-blue-600"
      >
        ☰
      </button>

      {/* Admin Sidebar */}
      <AdminSidebar
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Content Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>
        {renderContent()}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md w-full mt-6"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
