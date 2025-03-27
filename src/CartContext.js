import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const incrementQuantity = (index) => {
    const updatedCart = [...cart];
    if (index >= 0 && index < updatedCart.length) {
      updatedCart[index].quantity += 1;
      setCart(updatedCart);
    }
  };

  const decrementQuantity = (index) => {
    const updatedCart = [...cart];
    if (index >= 0 && index < updatedCart.length && updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    }
  };

  const checkout = () => {
    if (cart.length > 0) {
      setOrders([...orders, ...cart]);
      setCart([]);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, incrementQuantity, decrementQuantity, checkout, orders, updateOrderStatus }}>
      {children}
    </CartContext.Provider>
  );
};