import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  if (!token) {
    // If no token, redirect to login page
    navigate("/admin/login");
    return null; // Don't render the protected component
  }

  // If token exists, render the protected component
  return children;
};

// Wrap the AdminDashboard route in ProtectedRoute
<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />
