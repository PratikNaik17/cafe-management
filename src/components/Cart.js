import React from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, incrementQuantity, decrementQuantity, checkout } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    checkout();
    navigate('/orders');
  };

  const subtotal = () => {
    return cart.reduce((total, item) => {
      if (typeof item.price === 'number' && typeof item.quantity === 'number') {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0).toFixed(2);
  };

  const total = () => {
    const deliveryFee = 6.90;
    const subTotal = parseFloat(subtotal());
    return (subTotal + deliveryFee).toFixed(2);
  };

  return (
    <div className="cart-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
      <h2>My Cart</h2>
      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.imageURL} alt={item.name} className="item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <div className="item-quantity">
                <button onClick={() => decrementQuantity(index)}>-</button>
                <span className="quantity-value">{item.quantity}</span>
                <button onClick={() => incrementQuantity(index)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>Sub Total: &pound;{subtotal()}</p>
        <p>Delivery Fee: &pound;6.9</p>
        <p>Total: &pound;{total()}</p>
      </div>
      <button onClick={handleCheckout} className="checkout-button">Order</button>
    </div>
  );
};

export default Cart;