import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios for API requests
import { Link, useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader"; // Import the loader

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);  // State for sidebar
  const navigate = useNavigate();

  // Fetch the orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // If no token, redirect to login
          navigate('/login');
          return;
        }

        // Fetch orders from the API
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the fetched orders
        setOrders(response.data);
      } catch (err) {
        setError('Error fetching orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);  // Set loading to false after the request completes
      }
    };

    fetchOrders();
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`lg:w-64 w-48 bg-blue-600 text-white p-6 flex flex-col ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <h2 className="text-2xl font-semibold mb-6">Customer Dashboard</h2>
        <Link to="/user/orders" className="mb-4 text-lg hover:text-blue-200">Orders</Link>
        <Link to="/user/settings" className="mb-4 text-lg hover:text-blue-200">Settings</Link>
        <button 
          onClick={handleLogout} 
          className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full"
        >
          Logout
        </button>
      </div>

      {/* Overlay for mobile view */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Content Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Hamburger Icon for all screens */}
        <button 
          className="text-2xl text-blue-600 mb-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Welcome to Your Dashboard</h1>
        </div>

        {/* Orders Section */}
        <div className="bg-white p-6 rounded-md shadow-lg">
          <div className="text-xl font-semibold mb-4">Recent Orders</div>
          
          {/* Loading, Error, and Data Display */}
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader color={"#000"} loading={loading} size={50} />
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500">No orders found.</div>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="mb-4 border-b pb-4">
                  <p className="text-lg font-semibold">Order #{order.id}</p>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                  <p className="font-bold">{order.totalAmount} USD</p>
                  <Link to={`/user/order/${order.id}`} className="text-blue-500 hover:underline">
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* View All Orders Button */}
        <div className="mt-4 text-center">
          <Link to="/user/orders" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
