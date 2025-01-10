import React, { useEffect, useState } from "react";
import API from "../api/apiClient";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products based on search term
  const [searchTerm, setSearchTerm] = useState(""); // State to manage search input
  const { dispatch } = useCart(); // Get the dispatch function from CartContext
  const [newCollection, setNewCollection] = useState([]); // New collection for display
  const [isNewCollectionVisible, setIsNewCollectionVisible] = useState(false); // Controls visibility

  // Fetch products from API
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data); // Set products data
        setFilteredProducts(res.data); // Initially, display all products
        setNewCollection(res.data.slice(0, 5)); // Select the first 5 products as a new collection
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Function to toggle the visibility of the New Collection
  const toggleNewCollectionVisibility = () => {
    setIsNewCollectionVisible(!isNewCollectionVisible);
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
          <p>No products found</p>
        )}
      </div>

      {/* New Collection Section */}
      <section
        className={`new-collection-section ${isNewCollectionVisible ? "translate-x-0" : "-translate-x-full"} transform transition-all duration-500 ease-in-out mt-12 bg-gray-100 p-8 rounded-lg shadow-lg`}
      >
        <h2 className="text-3xl font-bold text-center mb-6">New Collection</h2>

        <div className="flex gap-8 justify-center overflow-x-hidden">
          {newCollection.map((product) => (
            <div
              key={product.id}
              className="product-card bg-white p-4 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:rotate-3d"
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
          ))}
        </div>

        {/* Button to toggle the visibility of New Collection */}
        <div className="text-center mt-6">
          <button
            onClick={toggleNewCollectionVisibility}
            className="bg-blue-500 text-white py-2 px-6 rounded-full transform transition-transform hover:scale-110 hover:rotate-3d"
          >
            {isNewCollectionVisible ? "Hide Collection" : "Show New Collection"}
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;
