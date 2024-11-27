import React, { createContext, useState } from 'react';

// Create the CategoriesContext
const CategoriesContext = createContext();

// Create the context provider component
export const CategoriesProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]); // Manage notifications state

  return (
    <CategoriesContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesContext;
