import React from 'react';
import { useCart } from '../CartContext';
import './StaffOrders.css';
import { Link } from 'react-router-dom';

const StaffOrders = () => {
  const { orders, updateOrderStatus } = useCart();

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="staff-orders-container">
      <div className='mid'>
              <h2 className='txt'>Staff Panel</h2>
      <Link to="/" className="backbtn">Back to login Page</Link>
      </div>
      
      <div className="orders-table">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-row">
              <div className="order-details">
                <p>Order ID: {order.id}</p>
                <p>Status: {order.status}</p>
              </div>
              <div className="order-actions">
                <select onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="ready">Ready</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default StaffOrders;