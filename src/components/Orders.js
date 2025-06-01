import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import './Orders.css';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3001/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log('Orders data:', data);
        setOrders(data.filter(order => order.status !== 'completed'));
        setCompletedOrders(data.filter(order => order.status === 'completed'));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const getOrderItems = (order) => {
    try {
      if (Array.isArray(order.items)) {
        return order.items;
      }
      return JSON.parse(order.items);
    } catch (e) {
      console.error('Error parsing order items:', e);
      return [];
    }
  };

  const subtotal = () => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((total, order) => {
      const items = getOrderItems(order);
      return total + items.reduce((orderTotal, item) => {
        return orderTotal + (item.price * item.quantity);
      }, 0);
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
        <button 
          className="history-bt"
          onClick={() => setShowHistory(true)}
        >
          Order History
        </button>
      </div>
      
      <div className="order-card">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            getOrderItems(order).map((item, index) => (
              <div key={`${order.id}-${index}`} className="order-item">
                <img src={item.imageURL} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            ))
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
      
      {orders && orders.length > 0 && (
        <div className="cart-summary">
          <p>Sub Total: &pound;{subtotal()}</p>
          <p>Delivery Fee: &pound;6.9</p>
          <p>Total: &pound;{total()}</p>
        </div>
      )}
      
      {/* Order History Popup */}
      {showHistory && (
        <div className="history-popup">
          <div className="history-popup-content">
            <button 
              className="close-button"
              onClick={() => setShowHistory(false)}
            >
              ×
            </button>
            <h2>Order History</h2>
            <div className="history-items">
              {completedOrders && completedOrders.length > 0 ? (
                completedOrders.map((order) => (
                  getOrderItems(order).map((item, index) => (
                    <div key={`history-${order.id}-${index}`} className="history-item">
                      <img src={item.imageURL} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price}</p>
                        <p>Ordered on: {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ))
              ) : (
                <p>No completed orders found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;