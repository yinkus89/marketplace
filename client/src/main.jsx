// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from 'react-dom/client' in React 18
import App from './App';
import { CartProvider } from './context/CartContext';
import './styles/index.css';
import './styles/globalStyles.css';


// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with the CartProvider
root.render(
  <CartProvider>
    <App />
  </CartProvider>
);
