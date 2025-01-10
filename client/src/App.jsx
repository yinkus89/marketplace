import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin"; // Corrected import
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./components/AdminDashboard";
import Dashboard from "./components/UserDashboard";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NewCollection from "./components/NewCollection"; // Updated path
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import MouseMoveEffect from "./components/MouseMoveEffect";
import Sidebar from "./components/Sidebar";
import "./styles/globalStyles.css";

// Assume this function retrieves user authentication data, such as role
const getUserRole = () => {
  // Example: check localStorage or a global state
  const user = JSON.parse(localStorage.getItem("user")); // Check if user exists in localStorage
  return user ? user.role : null; // Return role or null if no user
};

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Set user role on app load
  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);

  return (
    <Router>
      <div className="main-container">
        {/* Background effect */}
        <div className="background-3d"></div>

        {/* Sidebar Component */}
        <Sidebar
          onCategorySelect={handleCategorySelect}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="content">
          <MouseMoveEffect /> {/* Mouse effect */}
          <Header /> {/* Header across all pages */}
          {/* Navbar with Sidebar Toggle */}
          <Navbar toggleSidebar={toggleSidebar} />
          {/* Main Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/shop"
              element={<Shop selectedCategory={selectedCategory} />}
            />
            <Route
              path="/shop/:category"
              element={<Shop selectedCategory={selectedCategory} />}
            />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />{" "}
            {/* Corrected the route to /admin-login */}
            <Route path="/user/dashboard" element={<Dashboard />} />{" "}
            {/* Dashboard for user */}
            {/* Admin route with authentication check */}
            <Route
              path="/admin"
              element={
                userRole === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/admin-login" /> // Redirect non-admin users to the admin login page
                )
              }
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/new-collection" element={<NewCollection />} />{" "}
            {/* NewCollection Route */}
          </Routes>
          <Footer /> {/* Footer across all pages */}
        </div>
      </div>
    </Router>
  );
};

export default App;
