import React, { useEffect, useState } from "react";
import API from "../api/apiClient";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products based on search term
  const [searchTerm, setSearchTerm] = useState(""); // State to manage search input
  const { dispatch } = useCart(); // Get the dispatch function from CartContext

  // Fetch products from API
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data); // Set products data
        setFilteredProducts(res.data); // Initially, display all products
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by name (case-insensitive)
    );
    setFilteredProducts(results); // Update filtered products
  }, [searchTerm, products]);

  // Handle add to cart
  const handleAddToCart = (product) => {
    const existingProduct = products.find((item) => item.id === product.id);

    if (existingProduct) {
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...product, quantity: 1 },
      });
    } else {
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...product, quantity: 1 },
      });
    }
  };

  return (
    <div>
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
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:rotate-3d hover:shadow-3xl"
            >
              <img
                src={product.imageUrl || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full h-64 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg transform transition-transform hover:scale-110 hover:rotate-3d"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p> // Display message if no products match the search term
        )}
      </div>
    </div>
  );
};

export default Home;
