import React, { useState, useEffect } from 'react';

const VendorProfile = () => {
  // Mocking vendor data
  const [vendorData, setVendorData] = useState({
    name: 'Vendor A',
    email: 'vendorA@example.com',
    businessName: 'Vendor A LLC',
    phone: '987-654-3210',
    inventoryCount: 150,
    ordersReceived: 200
  });

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchVendorData = () => {
      // Simulate API call for vendor data
      setVendorData({
        name: 'Vendor A',
        email: 'vendorA@example.com',
        businessName: 'Vendor A LLC',
        phone: '987-654-3210',
        inventoryCount: 150,
        ordersReceived: 200
      });
    };

    fetchVendorData();
  }, []);

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
