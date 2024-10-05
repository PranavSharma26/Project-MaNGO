import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // Add role state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // Retrieve role from localStorage
    if (token) {
      setIsLoggedIn(true);
      setRole(userRole); // Set the role
    } else {
      setIsLoggedIn(false);
      setRole(null); // Reset role if not logged in
    }
  }, []);

  const login = (token, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole); // Store role in localStorage
    setIsLoggedIn(true);
    setRole(userRole); // Set the role in context
    navigate('/'); // Redirect to Home
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Clear role on logout
    setIsLoggedIn(false);
    setRole(null); // Reset role
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
