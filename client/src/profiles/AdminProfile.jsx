import React, { useState, useEffect } from 'react';
import API from '../api/apiClient';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch admin profile data when the component mounts
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await API.get('/admin/profile'); // Replace with actual API endpoint
        setAdminData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch admin profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleProfileEdit = () => {
    // Function to handle profile editing (e.g., opening a modal or editing form)
    alert('Edit Profile functionality here!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!adminData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="admin-profile-container p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Admin Profile</h1>
      <div className="admin-profile-info mb-6">
        <p><strong>Name:</strong> {adminData.name}</p>
        <p><strong>Email:</strong> {adminData.email}</p>
        <p><strong>Role:</strong> {adminData.role}</p>
      </div>
      <div className="admin-profile-actions flex space-x-4">
        <button 
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleProfileEdit}
        >
          Edit Profile
        </button>
        {/* Add more action buttons if necessary */}
      </div>
    </div>
  );
};

export default AdminProfile;
