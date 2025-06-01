import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ManageStaff.css';
import { useStaff } from './StaffContext';

const ManageStaff = () => {
  const { 
    staffCredentials, 
    loading, 
    error,
    handleAddStaff, 
    handleRemoveStaff, 
    handleEditStaff,
    fetchStaff
  } = useStaff();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddNewStaff = async () => {
    try {
      await handleAddStaff(formData);
      setFormData({ name: '', email: '', password: '' });
      setLocalError('');
    } catch (error) {
      setLocalError(error.message);
    }
  };

  const handleRemoveStaffLocal = async (id) => {
    try {
      await handleRemoveStaff(id);
      setLocalError('');
    } catch (error) {
      setLocalError(error.message);
    }
  };

  const handleEditStaffLocal = (index) => {
    setEditIndex(index);
    setFormData({
      name: staffCredentials[index].name,
      email: staffCredentials[index].email,
      password: ''
    });
  };

  const handleSaveEdits = async (e, index) => {
    e.preventDefault();
    try {
      const staffId = staffCredentials[index].id;
      await handleEditStaff(staffId, formData);
      setEditIndex(null);
      setFormData({ name: '', email: '', password: '' });
      setLocalError('');
    } catch (error) {
      setLocalError(error.message);
    }
  };

  if (loading) {
    return <div className="manage-staff">Loading staff data...</div>;
  }

  return (
    <div className="manage-staff">
      <div className="heading">
        <Link to="/admin" className="homebtn">Back</Link>
        <h1 className='h1'>Manage Staff</h1>
        {/* <button className='add' onClick={handleAddNewStaff}>Add Staff</button> */}
      </div>
      
      {(error || localError) && <p className="error-message">{error || localError}</p>}

      <div className="staff-form">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (editIndex !== null) {
            handleSaveEdits(e, editIndex);
          } else {
            handleAddNewStaff();
          }
        }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder={editIndex !== null ? 'New Password (leave blank to keep)' : 'Password'}
            value={formData.password}
            onChange={handleInputChange}
            required={editIndex === null}
          />
          <button type="submit">
            {editIndex !== null ? 'Save Changes' : 'Add Staff'}
          </button>
          {editIndex !== null && (
            <button 
              type="button" 
              onClick={() => {
                setEditIndex(null);
                setFormData({ name: '', email: '', password: '' });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="staff-list">
        <h2>Staff Members</h2>
        {staffCredentials.length === 0 ? (
          <p>No staff members found</p>
        ) : (
          staffCredentials.map((staff, index) => (
            <div key={staff.id} className="staff-card">
              <div className="staff-info">
                <p>Name: {staff.name}</p>
                <p>Email: {staff.email}</p>
                {editIndex !== index && <p>Password: ******</p>}
              </div>
              <div className="staff-actions">
                <button 
                  className="remove"
                  onClick={() => handleRemoveStaffLocal(staff.id)}
                >
                  Remove
                </button>
                {editIndex !== index && (
                  <button onClick={() => handleEditStaffLocal(index)}>
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageStaff;