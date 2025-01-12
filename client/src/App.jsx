import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";
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
import { CartProvider } from "./context/CartContext";
import DashboardLayout from './dashboards/DashboardLayout';
import "./styles/globalStyles.css";

const getUserRole = () => {
  return localStorage.getItem("role");
};

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);  // Empty dependency array to avoid re-renders on role change

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

          <Routes>
            {/* General routes (for all users, whether logged in or not) */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop selectedCategory={selectedCategory} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/new-collection" element={<NewCollection />} />

            {/* Role-Based Routes */}
            {userRole === "admin" && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<DashboardLayout sidebar={<AdminSidebar />} />} />
              </>
            )}

            {userRole === "vendor" && (
              <>
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/dashboard" element={<DashboardLayout sidebar={<VendorSidebar />} />} />
              </>
            )}

            {userRole === "customer" && (
              <>
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/dashboard" element={<DashboardLayout sidebar={<CustomerSidebar />} />} />
              </>
            )}

            {/* Logout Page */}
            <Route path="/logout" element={<LogoutPage />} />

            {/* Catch-all route for invalid paths */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>

          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
