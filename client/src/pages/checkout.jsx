import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your-publishable-key-here');  // Use your own Stripe publishable key

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
  const stripe = useStripe();
  const elements = useElements();

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

    if (paymentMethod === 'creditCard' && !stripe) {
      alert('Stripe is not loaded yet.');
      return;
    }

    // Handle Stripe payment method
    if (paymentMethod === 'creditCard') {
      const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      console.log('Payment method created: ', stripePaymentMethod);
      // Here you would send the paymentMethod.id to your server to complete the payment process.
      
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
        stripePaymentMethod,
      });

      // After submission, navigate to the order confirmation page or home page
      navigate('/order-confirmation');
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Checkout</h1>

      <div className="mb-4">
        <h2 className="text-2xl">Cart Summary</h2>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        <p className="text-xl font-bold">
          Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>
            <input
              type="radio"
              value="guest"
              checked={!isRegistered}
              onChange={() => setIsRegistered(false)}
            />
            Guest Checkout
          </label>
          <label>
            <input
              type="radio"
              value="registered"
              checked={isRegistered}
              onChange={() => setIsRegistered(true)}
            />
            Registered Customer
          </label>
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
                className="border px-4 py-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
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
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-xl">Select Payment Method</h3>
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === 'creditCard'}
                onChange={() => handlePaymentMethodChange('creditCard')}
              />
              Credit/Debit Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => handlePaymentMethodChange('paypal')}
              />
              PayPal
            </label>
          </div>
        </div>

        {paymentMethod === 'creditCard' && (
          <div className="mb-4">
            <h4 className="text-xl">Credit Card Details</h4>
            <CardElement className="border px-4 py-2 rounded-md w-full" />
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div className="mb-4">
            <p className="text-xl">You will be redirected to PayPal to complete the payment.</p>
          </div>
        )}

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md" disabled={!stripe}>
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

const StripeWrapper = () => (
  <Elements stripe={stripePromise}>
    <Checkout />
  </Elements>
);

export default StripeWrapper;
