// src/pages/Orders.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  // Simulate order data
  const orders = [
    { id: 1, status: 'Shipped', total: 59.99 },
    { id: 2, status: 'Pending', total: 89.99 },
    { id: 3, status: 'Delivered', total: 29.99 },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Order #{order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <Link to={`/orders/${order.id}`} className="text-blue-500 hover:text-blue-700">
              View Order Details
            </Link>
          </div>
        ))}
      </div>

      <Link to="/shop" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
        Go to Shop
      </Link>
    </div>
  );
};

export default Orders;
