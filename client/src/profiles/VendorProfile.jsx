import React, { useState, useEffect } from 'react';
import API from '../api/apiClient'; // Ensure API client is correctly imported

const VendorProfile = () => {
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendor data from API
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const response = await API.get('/vendor/profile'); // Adjust endpoint as needed
        setVendorData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch vendor data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
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

  if (!vendorData) {
    return (
      <div className="p-6 text-center">
        <p>No vendor data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Vendor Profile</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Business Information</h2>
        <p><strong>Name:</strong> {vendorData.name}</p>
        <p><strong>Email:</strong> {vendorData.email}</p>
        <p><strong>Business Name:</strong> {vendorData.businessName}</p>
        <p><strong>Phone:</strong> {vendorData.phone}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Inventory and Orders</h2>
        <p><strong>Items in Inventory:</strong> {vendorData.inventoryCount}</p>
        <p><strong>Orders Received:</strong> {vendorData.ordersReceived}</p>
      </div>

      <div>
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default VendorProfile;
