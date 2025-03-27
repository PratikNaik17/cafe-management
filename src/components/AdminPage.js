import React, { useEffect, useState } from 'react';
// import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
//   const { cart, setCart } = useCart();
  const [foodItems, setFoodItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    imageURL: '',
    price: '',
    ratings: ''
  });

 
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

  
  const handleAddItem = () => {
    setFormData({
      name: '',
      imageURL: '',
      price: '',
      ratings: ''
    });
    setIsModalOpen(true);
    setItemToEdit(null);
  };

 
  const handleEditItem = (item) => {
    setFormData({
      name: item.name,
      imageURL: item.imageURL,
      price: item.price.toString(),
      ratings: item.ratings.toString()
    });
    setIsModalOpen(true);
    setItemToEdit(item.id);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: itemToEdit !== null ? itemToEdit : foodItems.length + 1
    };

    if (itemToEdit) {
      await fetch(`http://localhost:3001/api/food-items/${itemToEdit}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });
    } else {
      await fetch('http://localhost:3001/api/food-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });
    }

    setIsModalOpen(false);
    fetchFoodItems();
  };


  const handleDeleteItem = async (itemId) => {
    await fetch(`http://localhost:3001/api/food-items/${itemId}`, {
      method: 'DELETE'
    });
    setFoodItems(foodItems.filter(item => item.id !== itemId));
  };


  useEffect(() => {
    fetchFoodItems();
  }, []);

  return (
    <div className="admin-page">
      <header className="header">
        <div className="logo">Cafe Goa</div>
        <div className="admin-header"> 
        <h1 className='ad' >Admin Control Panel</h1>
        <Link to="/" className="admin-button">Back to login Page</Link>
        </div>

        <div className="buttons">
          <Link to="/staff-orders" className="ctaa" >Staff Panel</Link>
          <Link to="/manage-staff" className="ctaa">Manage Staff</Link>
          {/* <Link to="/cart" className="cta">
            My Cart
            {cart.length > 0 && <span className="cart-dot">1</span>}
          </Link> */}
        </div>
      </header>
      <section className="hero">
        <h1>We are always here to serve you.</h1>
        <p>This is a type of restaurant which typically serves food and drinks in addition to light refreshment such as baked good or snacks.</p>
      </section>
      <section className="featured">
        <h2>Our Featured Food</h2>
        <button className="add-item" onClick={handleAddItem}>Add Item</button>
        <div className="food-items">
          {foodItems.map((item) => (
            <div key={item.id} className="food-item">
              <img src={item.imageURL} alt={item.name} />
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <p>Ratings: {item.ratings} / 5</p>
              <button onClick={() => handleEditItem(item)}>Edit</button>
              <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
      {isModalOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.imageURL}
              onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Ratings"
              value={formData.ratings}
              onChange={(e) => setFormData({ ...formData, ratings: e.target.value })}
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;