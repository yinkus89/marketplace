import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AdminSidebar from "../components/AdminSidebar";
import Spinner from "../components/Spinner";
import { globalNavigateAdmin } from "../utils/globalNavigateAdmin";
import "@fortawesome/fontawesome-free/css/all.min.css"; // For icons

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState(localStorage.getItem("adminName") || "Admin"); // New state
  const navigate = useNavigate();

  const handleNavigation = (url) => {
    globalNavigateAdmin(navigate, url);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleNavigation("/admin/login");
    } else {
      const fetchAdminDetails = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/details`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.setItem("adminName", response.data.name); // Cache name
          setAdminName(response.data.name);
        } catch (error) {
          console.error("Error fetching admin details:", error);
        }
      };
      fetchAdminDetails();
    }
  }, [navigate]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      // Fetch data logic...
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

  const renderContent = () => {
    if (loading) return <Spinner />;
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

    // Render content based on tab
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName"); // Clear name cache
    handleNavigation("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-4 text-blue-600"
      >
        ☰
      </button>

      <AdminSidebar
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Welcome {adminName}!</h1> {/* Welcome Message */}
        <h2 className="text-xl mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>
        {renderContent()}
      </div>

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
