import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import Orders from './components/Orders';
import StaffOrders from './components/StaffOrders';
import AdminPage from './components/AdminPage';
import { CartProvider } from './CartContext';
import ManageStaff from './components/ManageStaff';
import { StaffProvider } from './components/StaffContext'; 
import './App.css';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <CartProvider>
        <StaffProvider> {}
          <div className="App">
            <Routes>
            <Route path="/" element={<LoginPage />} />

              <Route path="/home" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/staff-orders" element={<StaffOrders />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/manage-staff" element={<ManageStaff />} />
            </Routes>
          </div>
        </StaffProvider>
      </CartProvider>
    </Router>
  );
}

export default App;