import React, { useEffect, useState } from 'react';
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { cart, setCart } = useCart();
  const [foodItems, setFoodItems] = useState([]);


  const fetchFoodItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/food-items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };


  const addToCart = (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
  };


  useEffect(() => {
    fetchFoodItems();
  }, []);

  return (
    <div className="home">
      <header className="header">
        <div className="logo">Cafe Goa</div>
        <div className="buttons">
          <Link to="/orders" className="ctaa">Orders</Link>
          <Link to="/cart" className="cta">My Cart {cart.length > 0 && <span className="cart-dot">1</span>}</Link>
          <Link to="/" className="cta">Log Out</Link>
      
        </div>
      </header>
      <section className="hero">
        <h1>We are always here to serve you.</h1>
        <p>This is a type of restaurant which typically serves food and drinks in addition to light refreshment such as baked good or snacks.</p>
      </section>
      <section className="featured">
        <h2>Our Featured Food</h2>
        <div className="food-items">
          {foodItems.map((item) => (
            <div key={item.id} className="food-item">
              <img src={item.imageURL} alt={item.name} />
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <p>Ratings: {item.ratings} / 5</p>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;