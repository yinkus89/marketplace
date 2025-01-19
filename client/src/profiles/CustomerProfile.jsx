import React, { useState, useEffect } from 'react';

const CustomerProfile = () => {
  const [customerData, setCustomerData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '123-456-7890',
  });

  useEffect(() => {
    // You can replace this with a real API call to fetch customer data
    // e.g., fetchCustomerData() and update the state accordingly
  }, []);

  return (
    <div className="profile-container p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Customer Profile</h1>
      <div className="profile-info mb-6">
        <p><strong>Name:</strong> {customerData.name}</p>
        <p><strong>Email:</strong> {customerData.email}</p>
        <p><strong>Phone:</strong> {customerData.phone}</p>
      </div>

      {/* Add Edit button or more functionality here */}
      <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Edit Profile
      </button>
    </div>
  );
};

export default CustomerProfile;
