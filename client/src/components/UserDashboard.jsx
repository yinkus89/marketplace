import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>User Dashboard</h2>
        <Link to="/user/orders">Orders</Link>
        <Link to="/user/settings">Settings</Link>
        <Link to="/logout">Logout</Link>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
        </div>
        <div className="card">
          <div className="card-title">Recent Orders</div>
          <div className="card-content">
            <p>Order #1: Product A</p>
            <p>Order #2: Product B</p>
            <p>Order #3: Product C</p>
          </div>
          <div className="card-footer">
            <button>View All Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
