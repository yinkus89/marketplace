import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";  // Include Navbar for all pages
import Header from "./components/Header";  // Include Header for all pages
import Footer from "./components/Footer";  // Include Footer for all pages
import Home from "./pages/Home";  // Home page component
import Cart from "./pages/Cart";  // Cart page component
import ProductDetails from "./pages/ProductDetails";  // Product details page
import Shop from "./pages/Shop";  // Shop page component
import About from "./pages/About";  // About page component
import Contact from "./pages/Contact";  // Contact page component
import Checkout from "./pages/Checkout";  // Checkout route
import Register from "./pages/Register"; // Register page
import Login from "./pages/Login";  // Login page
import Orders from "./pages/Orders";  // Orders page
import OrderDetails from "./pages/OrderDetails";  // Order details page
import MouseMoveEffect from "./components/MouseMoveEffect";  // Import MouseMoveEffect component
import Sidebar from "./components/Sidebar";  // Import Sidebar component
import "./styles/globalStyles.css";  // Import the global styles for 3D effect

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Router>
      <div className="main-container">
        <div className="background-3d"></div> {/* 3D Background */}

        <Sidebar onCategorySelect={handleCategorySelect} /> {/* Pass category select handler to Sidebar */}

        <div className="content">
          <MouseMoveEffect /> {/* Add MouseMoveEffect component */}
          <Header /> {/* Display the Header on every page */}
          <Navbar /> {/* Display the Navbar on every page */}

          <Routes>
            <Route path="/" element={<Home />} />  {/* Home page route */}
            <Route
              path="/shop"
              element={<Shop selectedCategory={selectedCategory} />} />  {/* Pass selectedCategory to Shop */}
            <Route path="/product/:id" element={<ProductDetails />} />  {/* Product details route */}
            <Route path="/cart" element={<Cart />} />  {/* Cart page route */}
            <Route path="/about" element={<About />} />  {/* About page route */}
            <Route path="/checkout" element={<Checkout />} />  {/* Checkout route */}
            <Route path="/register" element={<Register />} />  {/* Register route */}
            <Route path="/login" element={<Login />} />  {/* Login route */}
            <Route path="/orders" element={<Orders />} />  {/* Orders route */}
            <Route path="/orders/:id" element={<OrderDetails />} />  {/* Order details route */}
            <Route path="/contact" element={<Contact />} />  {/* Contact page route */}
            <Route path="/shop/:category" component={Shop} />
          </Routes>

          <Footer /> {/* Display the Footer on every page */}
        </div>
      </div>
    </Router>
  );
};

export default App;
