// src/components/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProfile from '../profiles/AdminProfile';
import VendorProfile from '../profiles/VendorProfile';
import CustomerProfile from '../profiles/CustomerProfile';

const ProfilePage = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role'); // Assuming role is stored in localStorage
    if (!role) {
      // Redirect to login if no role is found
      navigate('/login');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  if (!userRole) return <div>Loading...</div>;

  // Conditionally render based on user role
  switch (userRole) {
    case 'admin':
      return <AdminProfile />;
    case 'vendor':
      return <VendorProfile />;
    case 'customer':
      return <CustomerProfile />;
    default:
      return <div>You are not authorized to view this page.</div>;
  }
};

export default ProfilePage;
