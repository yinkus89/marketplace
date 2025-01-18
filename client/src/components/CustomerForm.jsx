// CustomerForm.jsx
import React, { useState } from 'react';
import API from '../api/apiClient';

const CustomerForm = ({ onCustomerAdded }) => {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post('/customers', customer);
      onCustomerAdded(response.data); // Pass the added customer back to the parent
      setCustomer({ name: '', email: '', phone: '' });
      alert('Customer added!');
    } catch (err) {
      setError('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Customer Name"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        className="input-field"
      />
      <input
        type="email"
        placeholder="Customer Email"
        value={customer.email}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Customer Phone"
        value={customer.phone}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        className="input-field"
      />
      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Adding...' : 'Add Customer'}
      </button>
    </form>
  );
};

export default CustomerForm;
