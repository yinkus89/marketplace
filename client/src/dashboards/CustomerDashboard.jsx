import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios for API requests
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const response = await axios.get('http://localhost:4001/api/orders', {
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
    <div className="dashboard">
      <div className="sidebar">
        <h2>Customer Dashboard</h2>
        <Link to="/user/orders">Orders</Link>
        <Link to="/user/settings">Settings</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
        </div>

        {/* Orders Section */}
        <div className="card">
          <div className="card-title">Recent Orders</div>
          <div className="card-content">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    <p><strong>Order #{order.id}</strong></p>
                    <p>{order.shippingAddress}</p>
                    <p>{order.totalAmount} USD</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card-footer">
            {/* Link to the full orders page */}
            <Link to="/user/orders" className="view-all-btn">View All Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
