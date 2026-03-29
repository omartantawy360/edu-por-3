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
  const [user, setUser] = useState(null); // { name: string, role: 'admin' | 'student' | 'judge', id: string }
  const [loading, setLoading] = useState(false); 

  const login = (role, customUserId = null) => {
    setLoading(true);
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
          if (role === 'admin') {
            setUser({
              id: 'ADMIN-001',
              name: 'Admin User',
              role: 'admin',
            });
          } else if (role === 'judge') {
            setUser({
              id: 'JUDGE-001',
              name: 'Dr. Sarah Mitchell',
              role: 'judge',
            });
          } else {
            // Default student is Omar Tantawy
            const students = {
              'ST-001': 'Omar Tantawy',
              'ST-002': 'Alice Smith',
              'ST-003': 'Bob Johnson',
              'ST-004': 'Charlie Brown',
              'ST-005': 'Diana Prince',
              'ST-006': 'Evan Wright',
              'ST-007': 'Fiona Gallagher',
              'ST-008': 'George Costanza',
              'ST-009': 'Hannah Abbott',
            };
            const studentId = customUserId && students[customUserId] ? customUserId : 'ST-001';
            setUser({
              id: studentId,
              name: students[studentId],
              role: 'student',
            });
          }
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
