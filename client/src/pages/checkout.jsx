import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { state } = useCart();
  const cartItems = state.items;
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Use useEffect to fetch user data if the user is already registered or logged in
  useEffect(() => {
    // Simulate fetching user info (this can come from local storage, context, or API)
    const userData = JSON.parse(localStorage.getItem('userData')); // Example: userData from localStorage
    if (userData) {
      setEmail(userData.email);
      setName(userData.name);
      setIsRegistered(true);
    }
  }, []);  // Empty dependency array to run only once on component mount

  if (cartItems.length === 0) {
    return <p>Your cart is empty. Please add items to your cart before proceeding.</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for required fields
    if (!email || !shippingAddress || !paymentMethod || !phoneNumber) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isRegistered && (!name || !password)) {
      alert('Please fill in all registration details.');
      return;
    }

    // Simulate order submission
    console.log('Order Submitted:', {
      cartItems,
      isRegistered,
      email,
      name,
      password,
      shippingAddress,
      phoneNumber, // Added phone number to order details
      paymentMethod,
    });

    // After submission, navigate to the order confirmation page or home page
    navigate('/order-confirmation');
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-semibold mb-4 text-center">Checkout</h1>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Cart Summary</h2>
        <ul className="space-y-2">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        <p className="text-xl font-bold text-right">
          Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-lg font-medium">Checkout as</label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                value="guest"
                checked={!isRegistered}
                onChange={() => setIsRegistered(false)}
                className="mr-2"
              />
              Guest Checkout
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="registered"
                checked={isRegistered}
                onChange={() => setIsRegistered(true)}
                className="mr-2"
              />
              Registered Customer
            </label>
          </div>
        </div>

        {/* Registered Customer Fields */}
        {isRegistered && (
          <>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Shipping Address */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Shipping Address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold">Select Payment Method</h3>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === 'creditCard'}
                onChange={() => handlePaymentMethodChange('creditCard')}
                className="mr-2"
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => handlePaymentMethodChange('paypal')}
                className="mr-2"
              />
              PayPal
            </label>
          </div>
        </div>

        {paymentMethod === 'paypal' && (
          <div className="mb-4">
            <p className="text-xl">You will be redirected to PayPal to complete the payment.</p>
          </div>
        )}

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <div className="mt-4 text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
