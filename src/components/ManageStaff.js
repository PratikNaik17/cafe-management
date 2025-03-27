import React, { useState } from 'react';
import { useStaff } from './StaffContext';
import './ManageStaff.css';
import { Link } from 'react-router-dom';

const ManageStaff = () => {
  const { staffCredentials, handleAddStaff, handleRemoveStaff, handleEditStaff } = useStaff();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddNewStaff = () => {
      const newStaff = {
       name: formData.name,
       email: formData.email,
       password: formData.password
     };
      handleAddStaff(newStaff);
      setFormData({
       name: '',
        email: '',
        password: ''
      });
    };

  const handleRemoveStaffLocal = (index) => {
    handleRemoveStaff(index);
  };

  const handleEditStaffLocal = (index) => {
    setEditIndex(index);
    setFormData({
      name: staffCredentials[index].name,
      email: staffCredentials[index].email,
      password: staffCredentials[index].password
    });
  };

  const handleSaveEdits = (e, index) => {
    e.preventDefault();
    const updatedStaff = {
      ...staffCredentials[index],
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    handleEditStaff(index, updatedStaff);
    setEditIndex(null);
  };

  return (
    <div className="manage-staff">
        <div className="heading">
        <Link to="/admin" className="homebtn">Back</Link>
        <h1 className='h1'>Manage Staff</h1>
      <button className='add' onClick={handleAddNewStaff}>Add Staff</button>
            </div>
      <div className="staff-list">
        {staffCredentials.map((staff, index) => (
          <div key={index} className="staff-card">
            <div className="staff-info">
              <p>Name: {staff.name}</p>
              <p>Email: {staff.email}</p>
              <p>Password: {staff.password}</p>
            </div>
            <div className="staff-actions">
              <button onClick={() => handleRemoveStaffLocal(index)}>Remove</button>
              {editIndex !== index && <button onClick={() => handleEditStaffLocal(index)}>Edit</button>}
              {editIndex === index && (
                <form className='form' onSubmit={(e) => handleSaveEdits(e, index)}>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                  <button type="submit">Save</button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageStaff;