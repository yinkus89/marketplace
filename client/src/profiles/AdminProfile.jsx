import React, { useState } from 'react';

const AdminProfile = () => {
  // Example state for storing and managing the admin profile
  const [adminData, setAdminData] = useState({
    name: 'John Doe',
    email: 'admin@example.com',
    role: 'Administrator',
  });

  const handleProfileEdit = () => {
    // Function to handle profile editing (e.g., opening a modal or editing form)
    alert('Edit Profile functionality here!');
  };

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
