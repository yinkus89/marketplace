import React, { useEffect, useState, useMemo } from "react";
import API from "../api/apiClient";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard"; // Assuming you have a ProductCard component
import Sidebar from "../components/Sidebar"; // Sidebar import
import { FaBars } from 'react-icons/fa';  // Importing the Hamburger Icon

const Home = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products based on search term
  const [searchTerm, setSearchTerm] = useState(""); // State to manage search input
  const [loading, setLoading] = useState(true); // Loading state for fetching products
  const { dispatch } = useCart(); // Get the dispatch function from CartContext

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then((res) => {
        setProducts(res.data); // Set products data
        setFilteredProducts(res.data); // Initially, display all products
      })
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Memoized filtered products based on the search term
  const filteredResults = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  useEffect(() => {
    setFilteredProducts(filteredResults);
  }, [filteredResults]);

  // Handle add to cart
  const handleAddToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 },
    });
  };

  if (loading) {
    return <div className="loading">Loading products...</div>; // Display loading state
  }

  return (
    <div className="flex">
      {/* Hamburger Button (Visible on all screen sizes) */}
      <button
        onClick={toggleSidebar}
        className="p-4 text-xl text-blue-500 focus:outline-none lg:hidden"
      >
        {/* Hamburger Icon */}
        <FaBars />
      </button>

      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-6 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } transition-all duration-300`} // Adds smooth transition for margin
      >
        <h1 className="text-2xl font-semibold my-4">Products</h1>

        {/* 3D Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
            className="w-full p-3 border rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:rotate-3d focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        {/* 3D Product Cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
