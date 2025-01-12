import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();

  // Logout function that clears the token from storage and redirects
  const logout = () => {
    // Remove the JWT token from localStorage or sessionStorage
    localStorage.removeItem("token");  // or sessionStorage.removeItem("token");

    // Navigate to the login page directly
    navigate("/login");  // React Router v6 uses navigate instead of history.push
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">You have been logged out</h2>
        <p className="text-gray-600 mb-6">You have successfully logged out. Click below to log back in.</p>
        <button
          onClick={logout}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Log back in
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;
