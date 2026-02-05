import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name: string, role: 'admin' | 'student', id: string }
  const [loading, setLoading] = useState(false); 

  const login = (role) => {
    setLoading(true);
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
          setUser({
            id: Math.random().toString(36).substr(2, 9),
            name: role === 'admin' ? 'Admin User' : 'Student User',
            role,
          });
          setLoading(false);
          resolve();
        }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
  );
};
