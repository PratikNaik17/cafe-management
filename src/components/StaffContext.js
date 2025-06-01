import React, { createContext, useState, useContext, useCallback } from 'react';

const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [staffCredentials, setStaffCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const fetchStaff = useCallback(async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    
    console.log('Using token:', token); // Debug log
    
    const response = await fetch('http://localhost:3001/api/staff', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status); // Debug log
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch staff');
    }
    
    const data = await response.json();
    setStaffCredentials(data);
    setError(null);
  } catch (err) {
    console.error('Full error:', err); // Debug log
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []);

  const handleAddStaff = async (newStaff) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newStaff)
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required');
        }
        throw new Error('Failed to add staff');
      }

      const addedStaff = await response.json();
      setStaffCredentials(prev => [...prev, addedStaff]);
      return addedStaff;
    } catch (err) {
      console.error('Error adding staff:', err);
      throw err;
    }
  };

  const handleRemoveStaff = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required');
        }
        throw new Error('Failed to delete staff');
      }

      setStaffCredentials(prev => prev.filter(staff => staff.id !== id));
    } catch (err) {
      console.error('Error removing staff:', err);
      throw err;
    }
  };

  const handleEditStaff = async (id, updatedStaff) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedStaff)
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required');
        }
        throw new Error('Failed to update staff');
      }

      const editedStaff = await response.json();
      setStaffCredentials(prev => prev.map(staff => 
        staff.id === id ? editedStaff : staff
      ));
      return editedStaff;
    } catch (err) {
      console.error('Error editing staff:', err);
      throw err;
    }
  };

  return (
    <StaffContext.Provider value={{ 
      staffCredentials, 
      loading, 
      error,
      fetchStaff,
      handleAddStaff, 
      handleRemoveStaff, 
      handleEditStaff 
    }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => useContext(StaffContext);