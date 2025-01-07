// src/pages/OrderDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams(); // Get order ID from URL
  // Simulate fetching order details based on ID
  const order = {
    id,
    status: 'Shipped',
    total: 59.99,
    items: [
      { name: 'Product 1', quantity: 1, price: 29.99 },
      { name: 'Product 2', quantity: 1, price: 29.99 },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order #{order.id} Details</h1>

      <div className="mb-6">
        <p>Status: {order.status}</p>
        <p>Total: ${order.total.toFixed(2)}</p>
      </div>

      <h2 className="text-2xl font-semibold">Items</h2>
      <ul>
        {order.items.map((item, index) => (
          <li key={index} className="mb-4">
            <p>{item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>

      <Link to="/orders" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
        Back to Orders
      </Link>
    </div>
  );
};

export default OrderDetails;
