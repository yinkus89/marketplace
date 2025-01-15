import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/vendor/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Manage Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order.product} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
