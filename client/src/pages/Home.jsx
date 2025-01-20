import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom"; // To read query params
import axios from "axios"; // Axios for API calls
import API from "../api/apiClient"; // Assuming you have a configured API client
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import StoreList from "../components/StoreList";
import StoreReviews from "../components/StoreReviews";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); 
  const selectedCategory = queryParams.get("category"); // Get category from query params

  // Fetch categories from the API
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:4001/api/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error("Failed to fetch categories:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data); // Initially display all products
      })
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Memoized filtered products based on the search term and selected category
  const filteredResults = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
      const matchesStore = selectedStoreId ? product.storeId === selectedStoreId : true;
      return matchesSearch && matchesCategory && matchesStore;
    });
  }, [searchTerm, selectedCategory, selectedStoreId, products]);

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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <div className="sidebar-container hidden lg:block">
        <Sidebar categories={categories} /> {/* Pass categories to Sidebar */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:ml-64 transition-all duration-300">
        <h1 className="text-3xl font-semibold mb-6">Products</h1>

        {/* Store List Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Stores</h2>
          <StoreList onSelectStore={(storeId) => setSelectedStoreId(storeId)} />
        </section>

        {/* Store Reviews Section */}
        {selectedStoreId && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Store Reviews</h2>
            <StoreReviews storeId={selectedStoreId} />
          </section>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        {/* Product Cards */}
        <div className="flex flex-wrap justify-start gap-6">
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

Shop.propTypes = {
  // PropTypes can be defined if there are props passed to Shop component
};

export default Shop;
