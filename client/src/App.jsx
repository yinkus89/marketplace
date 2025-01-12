import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import CustomerDashboard from "./dashboards/CustomerDashboard";
import VendorDashboard from "./dashboards/VendorDashboard";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Spinner from "./components/spinner";  // Correct import path
import NewCollection from "./components/NewCollection";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import MouseMoveEffect from "./components/MouseMoveEffect";
import Sidebar from "./components/Sidebar"; // General Sidebar for Home
import AdminSidebar from "./dashboards/AdminSidebar"; // Admin Sidebar in Dashboard
import VendorSidebar from "./dashboards/VendorSidebar"; // Vendor Sidebar in Dashboard
import CustomerSidebar from "./dashboards/CustomerSidebar"; // Customer Sidebar in Dashboard
import AdminDashboard from "./dashboards/AdminDashboard";
import LogoutPage from "./pages/LogoutPage";
import { CartProvider } from "./context/CartContext"; // Cart Provider
import DashboardLayout from "./dashboards/DashboardLayout";
import "./styles/globalStyles.css";

// Utility function to get the user role
const getUserRole = () => {
  return localStorage.getItem("role");
};

// Main App Component
const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for showing the spinner

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);

    // Simulate loading for demo purposes (you can replace it with actual loading logic)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);  // Stop loading after 2 seconds for demonstration
    }, 2000);
  }, []); // Empty dependency array to avoid re-renders on role change

  return (
    <Router>
      <div className="main-container">
        <div className="background-3d"></div>

        {/* Sidebar for Home Pages (only if no role is set, for general visitors) */}
        {!userRole && (
          <Sidebar
            onCategorySelect={setSelectedCategory}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        <div className="content">
          <MouseMoveEffect />
          <Header />
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          {/* Conditionally render Spinner if loading */}
          {isLoading && <Spinner />}

          {/* Wrap the main Routes with CartProvider to make cart context available */}
          <CartProvider>
            <Routes>
              {/* General routes (for all users, whether logged in or not) */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/shop" element={<Shop selectedCategory={selectedCategory} />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/new-collection" element={<NewCollection />} />

              {/* Role-Based Routes */}
              {userRole && (
                <>
                  <Route path="/admin/dashboard" element={<DashboardLayout sidebar={<AdminSidebar />} />} />
                  <Route path="/vendor/dashboard" element={<DashboardLayout sidebar={<VendorSidebar />} />} />
                  <Route path="/customer/dashboard" element={<DashboardLayout sidebar={<CustomerSidebar />} />} />
                </>
              )}

              {/* Role-based Access */}
              {userRole === "admin" && (
                <Route path="/admin" element={<AdminDashboard />} />
              )}
              {userRole === "vendor" && (
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              )}
              {userRole === "customer" && (
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              )}

              {/* Logout Page */}
              <Route path="/logout" element={<LogoutPage />} />

              {/* Catch-all route for invalid paths */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </CartProvider>

          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
