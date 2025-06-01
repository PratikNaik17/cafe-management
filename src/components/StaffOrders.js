import React, { useState, useEffect } from 'react';
import './StaffOrders.css';
import { Link } from 'react-router-dom';

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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
        
        // Separate active and completed orders
        setOrders(data.filter(order => order.status !== 'completed'));
        setCompletedOrders(data.filter(order => order.status === 'completed'));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state
      if (newStatus === 'completed') {
        // Move to completed orders
        const orderToComplete = orders.find(order => order.id === orderId);
        setCompletedOrders([...completedOrders, {...orderToComplete, status: 'completed'}]);
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        // Just update status
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="staff-orders-container">
      <div className='mid'>
        <h2 className='txt'>Staff Panel</h2>
        <Link to="/" className="backbtn">Back to login Page</Link>
        <button 
          className="history-btn"
          onClick={() => setShowHistory(true)}
        >
          Order History
        </button>
      </div>
      
      <div className="orders-table">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-row">
              <div className="order-details">
                <p>Order ID: {order.id}</p>
                <p>Status: {order.status}</p>
                <p>Customer ID: {order.user_id}</p>
                <p>Total: ${order.total}</p>
              </div>
              <div className="order-actions">
                <select 
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p>No active orders found.</p>
        )}
      </div>

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
                  <div key={`completed-${order.id}`} className="history-item">
                    <div className="order-details">
                      <p>Order ID: {order.id}</p>
                      <p>Customer ID: {order.user_id}</p>
                      <p>Total: ${order.total}</p>
                      <p>Completed on: {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>
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

export default StaffOrders;