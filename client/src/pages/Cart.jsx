import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { state, dispatch } = useCart(); // Use cart context to get cart state and dispatch function
  const cartItems = state.items; // Extract cart items from the state

  const handleRemoveFromCart = (productId) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { id: productId },
    });
  };

  // If cart is empty, display a message
  if (cartItems.length === 0) {
    return <p>Your cart is empty. Please add items to your cart.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Your Cart</h1>
      
      {/* Cart Items List */}
      <div>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg mb-4 transform transition-transform hover:scale-105 hover:rotate-3d hover:shadow-2xl"
          >
            <div className="flex items-center">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => handleRemoveFromCart(item.id)}
              className="bg-red-500 text-white px-4 py-2 rounded transform transition-transform hover:scale-110 hover:rotate-3d"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div className="mt-4">
        <p className="text-xl font-semibold">
          Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
        </p>
      </div>

      {/* Proceed to Checkout Button */}
      <div className="mt-6">
        <Link
          to="/checkout"
          className="bg-blue-500 text-white py-2 px-6 rounded transform transition-transform hover:scale-110 hover:rotate-3d"
          style={{ textDecoration: 'none' }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
