import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/apiClient";
import { useCart } from "../context/CartContext";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { dispatch } = useCart();

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleAddToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 },
    });
  };

  const handleWishlistToggle = (product) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = new Set(prevWishlist);
      if (updatedWishlist.has(product.id)) {
        updatedWishlist.delete(product.id);
      } else {
        updatedWishlist.add(product.id);
      }
      return updatedWishlist;
    });
  };

  const isInWishlist = (productId) => wishlist.has(productId);

  if (loading) return <div className="spinner">Loading...</div>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Our Products</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
        />
      </div>

      <div className="new-collection mb-12">
        <h2 className="text-3xl font-bold mb-4">New Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow hover:scale-105 transition-all"
            >
              <img
                src={product.imageUrl || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-64 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/product/${product.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:scale-110"
                >
                  Add to Cart
                </button>
              </div>
              <button
                onClick={() => handleWishlistToggle(product)}
                className={`mt-4 py-2 px-4 rounded-lg ${
                  isInWishlist(product.id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
              <Link
                to={`/product/${product.id}/review`}
                className="mt-4 inline-block text-center bg-green-500 text-white py-2 px-4 rounded-lg hover:scale-110 transition-transform"
              >
                Review
              </Link>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow hover:scale-105 transition-all"
            >
              <img
                src={product.imageUrl || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-64 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/product/${product.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:scale-110"
                >
                  Add to Cart
                </button>
              </div>
              <button
                onClick={() => handleWishlistToggle(product)}
                className={`mt-4 py-2 px-4 rounded-lg ${
                  isInWishlist(product.id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
              <Link
                to={`/product/${product.id}/review`}
                className="mt-4 inline-block text-center bg-green-500 text-white py-2 px-4 rounded-lg hover:scale-110 transition-transform"
              >
                Review
              </Link>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
