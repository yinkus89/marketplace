import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProfile from '../profiles/AdminProfile';
import VendorProfile from '../profiles/VendorProfile';
import CustomerProfile from '../profiles/CustomerProfile';

const ProfilePage = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      // Redirect to login if the user role is not found
      navigate('/login');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  if (!userRole) return <div>Loading...</div>;

  // Conditionally render the correct profile based on the user role
  switch (userRole) {
    case 'ADMIN':
      return <AdminProfile />;
    case 'VENDOR':
      return <VendorProfile />;
    case 'CUSTOMER':
      return <CustomerProfile />;
    default:
      return <Navigate to="/login" />;
  }
};

export default ProfilePage;
