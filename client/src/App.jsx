import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from './components/Sidebar';  // Import Sidebar
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductReview from "./components/ProductReview";
import ProductDetails from "./pages/ProductDetails";
import CustomerDashboard from "./pages/CustomerDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Spinner from "./components/Spinner";
import NewCollection from "./components/NewCollection";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import MouseMoveEffect from "./components/MouseMoveEffect";
import CustomerSidebar from "./components/CustomerSidebar";
import VendorSidebar from "./components/VendorSidebar";
import LogoutPage from "./pages/LogoutPage";
import { CartProvider } from "./context/CartContext";
import DashboardLayout from "./components/DashboardLayout";
import StoreList from "./components/StoreList";
import StoreReviews from "./components/StoreReviews";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import AdminSidebar from "./components/AdminSidebar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./admin/AdminSettings";
import CategoryPage from "./pages/CategoryPage";
import "./styles/globalstyles.css";

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");  // Assuming you're storing the role in localStorage
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

        {/* Sidebar for Admin, Vendor, and Customer Roles */}
        {userRole && (
          <>
            {userRole === "admin" && (
              <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            )}
            {userRole === "vendor" && (
              <VendorSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            )}
            {userRole === "customer" && (
              <CustomerSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            )}
          </>
        )}

        <div className="content">
          <MouseMoveEffect />
          <Header />
          <Navigation
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isAuthenticated={!!userRole}
            roles={[userRole]}
          />

          {isLoading && <Spinner />}

          <CartProvider>
            <Routes>
              {/* General Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id/review" element={<ProductReview />} />
              <Route path="/new-collection" element={<NewCollection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/categories" element={<CategoryPage />} />

              {/* Role-Based Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute roleRequired="admin">
                    <DashboardLayout sidebar={<AdminSidebar />} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <PrivateRoute roleRequired="admin">
                    <AdminSettings />
                  </PrivateRoute>
                }
              />

              {/* Vendor Routes */}
              <Route
                path="/vendor/dashboard"
                element={
                  <PrivateRoute roleRequired="vendor">
                    <DashboardLayout sidebar={<VendorSidebar />} />
                  </PrivateRoute>
                }
              />

              {/* Customer Routes */}
              <Route
                path="/customer/dashboard"
                element={
                  <PrivateRoute roleRequired="customer">
                    <DashboardLayout sidebar={<CustomerSidebar />} />
                  </PrivateRoute>
                }
              />

              {/* Misc Routes */}
              <Route path="/store-list" element={<StoreList />} />
              <Route path="/store-reviews" element={<StoreReviews />} />
              <Route path="/logout" element={<LogoutPage />} />
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
