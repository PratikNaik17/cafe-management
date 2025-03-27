import React, { createContext, useState, useContext } from 'react';

const StaffContext = createContext();

export const useStaff = () => useContext(StaffContext);

export const StaffProvider = ({ children }) => {
  const [staffCredentials, setStaffCredentials] = useState([
    { name: 'Staff 1', email: 'staff1@gmail.com', password: '1111' },
    { name: 'Staff 2', email: 'staff2@gmail.com', password: '2222' },
    
  ]);

  const handleAddStaff = (newStaff) => {
     setStaffCredentials([...staffCredentials, newStaff]);
   };

   const handleRemoveStaff = (index) => {
     setStaffCredentials(staffCredentials.filter((_, idx) => idx !== index));
   };

   const handleEditStaff = (index, updatedStaff) => {
     setStaffCredentials(staffCredentials.map((staff, idx) => (idx === index ? updatedStaff : staff)));
   };

   return (
     <StaffContext.Provider value={{ staffCredentials, handleAddStaff, handleRemoveStaff, handleEditStaff }}>
       {children}
     </StaffContext.Provider>
   );
};