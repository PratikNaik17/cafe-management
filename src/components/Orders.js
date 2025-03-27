import React from 'react';
import { useCart } from '../CartContext';
import './Orders.css';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { orders } = useCart();

  const subtotal = () => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((total, item) => {
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
    <div className="orders-container">
      <div className='order-top'>
        <Link to="/home" className="back-button">Back</Link>
        <h2>Orders</h2>
        <h2 className='t'>O</h2>
      </div>
      <div className="order-card">
        {orders && orders.length > 0 ? (
          orders.map((item, index) => (
            <div key={index} className="order-item">
              <img src={item.imageURL} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Total Price: ${(item.price * item.quantity).toFixed(2)}</p>
                <p>Status: {item.status}</p> {}
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
      <div className="cart-summary">
        <p>Sub Total: &pound;{subtotal()}</p>
        <p>Delivery Fee: &pound;6.9</p>
        <p>Total: &pound;{total()}</p>
      </div>
    </div>
  );
};

export default Orders;