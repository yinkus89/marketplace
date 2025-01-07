import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

// Create context
const CartContext = createContext();

// Load cart from localStorage with error handling
const loadCartItems = () => {
  try {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return { cartItems, totalAmount };
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { cartItems: [], totalAmount: 0 };
  }
};

const { cartItems, totalAmount } = loadCartItems();
const initialState = {
  items: cartItems,
  totalAmount: totalAmount,
};

// Reducer function to manage cart actions
const cartReducer = (state, action) => {
  let updatedItems;
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex >= 0) {
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        updatedItems = [...state.items, action.payload];
      }
      break;

    case 'REMOVE_FROM_CART':
      updatedItems = state.items.filter(item => item.id !== action.payload.id);
      break;

    case 'UPDATE_ITEM_QUANTITY':
      updatedItems = state.items.map(item => 
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      break;

    case 'CLEAR_CART':
      updatedItems = [];
      break;

    default:
      return state;
  }

  // Calculate total amount after updating items
  const totalAmount = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return { ...state, items: updatedItems, totalAmount };
};

// CartProvider component to wrap the app
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({ state, dispatch }), [state]);

  // Effect to update localStorage when the cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access the cart state and dispatch function
export const useCart = () => useContext(CartContext);
