import React, { useState, useEffect } from 'react';
import API from '../api/apiClient';

const CustomerProfile = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const response = await API.get('/customer/profile'); // Replace with your actual API endpoint
        setCustomerData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch customer data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="p-6 text-center">
        <p>No customer data available.</p>
      </div>
    );
  }

  return (
    <div className="profile-container p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Customer Profile</h1>
      <div className="profile-info mb-6">
        <p><strong>Name:</strong> {customerData.name}</p>
        <p><strong>Email:</strong> {customerData.email}</p>
        <p><strong>Phone:</strong> {customerData.phone}</p>
      </div>

      <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Edit Profile
      </button>
    </div>
  );
};

export default CustomerProfile;
