import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home"; // Import Home
import Cart from "./pages/Cart";
import ProductReview from "./components/ProductReview";
import ProductDetails from "./pages/ProductDetails";
import CustomerDashboard from "./dashboards/CustomerDashboard";
import VendorDashboard from "./dashboards/VendorDashboard";
import Shop from "./pages/Shop"; // Import Shop
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Spinner from "./components/Spinner";
import NewCollection from "./components/NewCollection";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import MouseMoveEffect from "./components/MouseMoveEffect";
import CustomerSidebar from "./dashboards/CustomerSidebar";
import VendorSidebar from "./dashboards/VendorSidebar";
import LogoutPage from "./pages/LogoutPage";
import { CartProvider } from "./context/CartContext";
import DashboardLayout from "./dashboards/DashboardLayout";
import StoreList from "./components/StoreList"; // Import StoreList
import StoreReviews from "./components/StoreReviews"; // Import StoreReviews
import CustomerProfile from "./profiles/CustomerProfile";
import VendorProfile from "./profiles/VendorProfile";
import ProfilePage from "./components/ProfilePage"; // Import the ProfilePage
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import AdminSidebar from "./admin/AdminSidebar"; // Import AdminSidebar
import AdminDashboard from "./admin/AdminDashboard"; // Import AdminDashboard
import AdminSettings from "./admin/AdminSettings"; // Import AdminSettings
import AdminProfile from "./profiles/AdminProfile";
import CategoryPage from './components/CategoryPage';
import UserPage from './components/UserPage';
import "./styles/globalstyles.css";

// Utility function to get the user role
const getUserRole = () => localStorage.getItem("role");

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
          <Navigation
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isAuthenticated={!!userRole}
            roles={[userRole]}
          />

          {isLoading && <Spinner />}

          <CartProvider>
            <Routes>
              {/* General Routes */}
              <Route path="/" element={<Home />} /> {/* Render Home */}
              <Route path="/shop" element={<Shop />} /> {/* Render Shop */}
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

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute roleRequired="admin">
                    <DashboardLayout sidebar={<AdminSidebar />}>
                      <AdminDashboard />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/categories" element={<CategoryPage />} /> {/* Add CategoryPage route */}
              <Route path="/users" element={<UserPage />} />

              {/* Vendor Routes */}
              <Route
                path="/vendor/dashboard"
                element={
                  <PrivateRoute roleRequired="vendor">
                    <DashboardLayout sidebar={<VendorSidebar />}>
                      <VendorDashboard />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route path="/vendor/profile" element={<VendorProfile />} />

              {/* Customer Routes */}
              <Route
                path="/customer/dashboard"
                element={
                  <PrivateRoute roleRequired="customer">
                    <DashboardLayout sidebar={<CustomerSidebar />}>
                      <CustomerDashboard />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route path="/customer/profile" element={<CustomerProfile />} />

              {/* Store List Route */}
              <Route path="/store-list" element={<StoreList />} /> {/* Render StoreList */}

              {/* Profile Routes for Each Role */}
              <Route
                path="/admin/profile"
                element={
                  <PrivateRoute roleRequired="admin" element={<ProfilePage role="admin" />} />
                }
              />
              <Route
                path="/vendor/profile"
                element={
                  <PrivateRoute roleRequired="vendor" element={<ProfilePage role="vendor" />} />
                }
              />
              <Route
                path="/customer/profile"
                element={
                  <PrivateRoute roleRequired="customer" element={<ProfilePage role="customer" />} />
                }
              />

              {/* Store Reviews Route */}
              <Route path="/store-reviews" element={<StoreReviews />} /> {/* Render StoreReviews */}

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
