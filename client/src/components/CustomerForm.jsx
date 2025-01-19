import React, { useState } from 'react';
import API from '../api/apiClient';

const CustomerForm = ({ onCustomerAdded }) => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation to ensure all fields are filled
    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // API call to add customer data
      const response = await API.post('/customers', customer);
      onCustomerAdded(response.data); // Pass the added customer back to the parent
      setCustomer({ name: '', email: '', phone: '', address: '', password: '' });
      alert('Customer added!');
    } catch (err) {
      setError('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form space-y-4">
      {error && <p className="error-message text-red-500">{error}</p>}
      
      {/* Name Input */}
      <input
        type="text"
        placeholder="Customer Name"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        className="input-field w-full p-2 border border-gray-300 rounded"
      />
      
      {/* Email Input */}
      <input
        type="email"
        placeholder="Customer Email"
        value={customer.email}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        className="input-field w-full p-2 border border-gray-300 rounded"
      />
      
      {/* Phone Input */}
      <input
        type="text"
        placeholder="Customer Phone"
        value={customer.phone}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        className="input-field w-full p-2 border border-gray-300 rounded"
      />
      
      {/* Address Input */}
      <input
        type="text"
        placeholder="Customer Address"
        value={customer.address}
        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
        className="input-field w-full p-2 border border-gray-300 rounded"
      />
      
      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        value={customer.password}
        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
        className="input-field w-full p-2 border border-gray-300 rounded"
      />
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="submit-btn w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600"
      >
        {loading ? 'Adding...' : 'Add Customer'}
      </button>
    </form>
  );
};

export default CustomerForm;

