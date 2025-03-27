import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaff } from './StaffContext'; 
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { staffCredentials } = useStaff(); 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = '1234';
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      navigate('/admin');
    } else {
     
      const staff = staffCredentials.find(s => s.email === email && s.password === password);
      if (staff) {
        navigate('/staff-orders');
      } else {
        
        navigate('/home');
      }
    }
  };

  return (
    <div className="login-box">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default LoginPage;