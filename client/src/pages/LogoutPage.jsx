import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');
    
    // Redirect to login page
    navigate('/login');
  };

  const handleLoginBack = () => {
    // Simply navigate back to the login page without removing the token
    navigate('/login');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Are you sure you want to log out?</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          Log Out
        </button>
        
        <button
          onClick={handleLoginBack}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login Back
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;
