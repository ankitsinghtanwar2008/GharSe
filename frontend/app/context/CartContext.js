"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food) => {

    setCartItems((prev) => {

      const existing = prev.find((item) => item._id === food._id);

      if (existing) {
        return prev.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {

    if (quantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (id) => {

    setCartItems((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}