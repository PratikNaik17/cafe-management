import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

// In CartContext.js
useEffect(() => {
  fetchCart();
}, []);

const fetchCart = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('http://localhost:3001/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setCart(data.items || []);
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
};

const removeFromCart = (index) => {
  const updatedCart = [...cart];
  updatedCart.splice(index, 1);
  setCart(updatedCart);
};

const addToCart = (item) => {
  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  
  let updatedCart;
  if (existingItemIndex >= 0) {
    updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity += 1;
  } else {
    updatedCart = [...cart, { ...item, quantity: 1 }];
  }
  
  setCart(updatedCart);
  saveCart(updatedCart); // Save immediately after updating
};

// Update saveCart to accept cart parameter
const saveCart = async (cartToSave = cart) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    await fetch('http://localhost:3001/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items: cartToSave })
    });
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

  const checkout = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const subtotal = cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    const deliveryFee = 6.90;
    const total = subtotal + deliveryFee;

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total: total.toFixed(2)
        })
      });
      
      if (!response.ok) {
        throw new Error('Checkout failed');
      }
      
      setCart([]);
      return await response.json();
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

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

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      incrementQuantity, 
      decrementQuantity, 
      checkout,
      saveCart,
      removeFromCart,
      addToCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);