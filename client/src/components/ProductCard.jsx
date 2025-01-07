// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/150'}
        alt={`Image of ${product.name}`}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      <div className="flex justify-between items-center">
        <Link
          to={`/product/${product.id}`}
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          View Details
        </Link>
        <button
          onClick={() => onAddToCart(product)} // Passing product to handler
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

