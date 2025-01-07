import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/apiClient"; // API client for fetching products
import { useCart } from "../context/CartContext"; // Cart context to add products to cart

const Shop = () => {
  const [products, setProducts] = useState([]); // State for products
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [wishlist, setWishlist] = useState([]); // State for wishlist
  const [loading, setLoading] = useState(true); // Loading state for API request
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const { dispatch } = useCart(); // Get the dispatch function from CartContext

  useEffect(() => {
    // Fetch products from the API
    API.get("/products")
      .then((res) => {
        setProducts(res.data); // Update products state
        setFilteredProducts(res.data); // Set initial filtered products
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((err) => {
        setError("Failed to load products."); // Handle error
        setLoading(false);
      });
  }, []);

  // Filter products based on the search term
  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]); // Re-run filtering when search term or products change

  // Handle adding a product to the cart
  const handleAddToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 },
    });
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      // Remove from wishlist
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      // Add to wishlist
      setWishlist([...wishlist, product]);
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Loading state UI
  if (loading) {
    return <p>Loading products...</p>;
  }

  // Error handling UI
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Our Products</h1>

      {/* 3D Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
          className="w-full p-3 border rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:rotate-3d focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      {/* 3D Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:rotate-3d hover:shadow-3xl"
            >
              <img
                src={product.imageUrl || 'https://via.placeholder.com/150'} // Default image if none provided
                alt={product.name}
                className="w-full h-64 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                {/* View Details link */}
                <Link
                  to={`/product/${product.id}`}  // Correct string interpolation
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg transform transition-transform hover:scale-110 hover:rotate-3d"
                >
                  Add to Cart
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlistToggle(product)}
                  className={`py-2 px-4 rounded-lg transition-transform ${
                    isInWishlist(product.id)
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
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

export default Shop;
