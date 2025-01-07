import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { state, dispatch } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Simulate fetching product data (replace with actual API call)
    const fetchProduct = async () => {
      const fetchedProduct = {
        id,
        name: "Sample Product",
        description: "This is a detailed description of the product.",
        price: 29.99,
        imageUrl: "https://via.placeholder.com/150",
      };
      setProduct(fetchedProduct);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const addToCart = (product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity: 1 },  // Ensure the quantity is added
    });
    setSuccessMessage('Product added to cart!');
    setTimeout(() => setSuccessMessage(''), 3000);  // Clear success message after 3 seconds
  };

  if (loading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (!product) {
    return <p className="text-center text-xl">Product not found!</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
        <div className="flex flex-col justify-between w-full md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
          <p className="text-lg mb-4">{product.description}</p>
          <p className="text-xl font-bold text-gray-800 mb-6">Price: ${product.price}</p>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
          <Link to="/cart" className="text-blue-500 mt-4 inline-block hover:underline">
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
