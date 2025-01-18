import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import Spinner from "./components/Spinner";
import NewCollection from "./components/NewCollection";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import MouseMoveEffect from "./components/MouseMoveEffect";
import Sidebar from "./components/Sidebar";
import AdminSidebar from "./dashboards/AdminSidebar";
import VendorSidebar from "./dashboards/VendorSidebar";
import CustomerSidebar from "./dashboards/CustomerSidebar";
import AdminDashboard from "./dashboards/AdminDashboard";
import LogoutPage from "./pages/LogoutPage";
import { CartProvider } from "./context/CartContext";
import DashboardLayout from "./dashboards/DashboardLayout";
import StoreList from "./components/StoreList";
import StoreReviews from "./components/StoreReviews";

import "./styles/globalStyles.css";

// Utility function to get the user role
const getUserRole = () => localStorage.getItem("role");

// PrivateRoute Component for Role-Based Access
const PrivateRoute = ({ roleRequired, element }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== roleRequired) {
    switch (role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "vendor":
        return <Navigate to="/vendor/dashboard" replace />;
      case "customer":
        return <Navigate to="/customer/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return element;
};

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);

    // Simulate loading (replace with actual logic as needed)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <Router>
      <div className="main-container">
        <div className="background-3d"></div>

        {/* Sidebar for General Visitors */}
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

          {isLoading && <Spinner />}

          <CartProvider>
            <Routes>
              {/* General Routes */}
              <Route path="/" element={<StoreList />} />
              <Route path="/stores/:storeId/reviews" element={<StoreReviews />} />
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

              {/* Role-Based Routes with PrivateRoute */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute
                    roleRequired="admin"
                    element={
                      <DashboardLayout sidebar={<AdminSidebar />}>
                        <AdminDashboard />
                      </DashboardLayout>
                    }
                  />
                }
              />
              <Route
                path="/vendor/dashboard"
                element={
                  <PrivateRoute
                    roleRequired="vendor"
                    element={
                      <DashboardLayout sidebar={<VendorSidebar />}>
                        <VendorDashboard />
                      </DashboardLayout>
                    }
                  />
                }
              />
              <Route
                path="/customer/dashboard"
                element={
                  <PrivateRoute
                    roleRequired="customer"
                    element={
                      <DashboardLayout sidebar={<CustomerSidebar />}>
                        <CustomerDashboard />
                      </DashboardLayout>
                    }
                  />
                }
              />

              {/* Logout Page */}
              <Route path="/logout" element={<LogoutPage />} />

              {/* Catch-All Route */}
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
