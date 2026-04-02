import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on app load
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');

    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, name: decoded.name, email: decoded.email, avatar: decoded.avatar });
          setRole('user');
        } else {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
        }
      } catch {
        localStorage.removeItem('userToken');
      }
    } else if (adminToken) {
      try {
        const decoded = jwtDecode(adminToken);
        if (decoded.exp * 1000 > Date.now() && decoded.role === 'admin') {
          setUser({ id: decoded.id, name: decoded.username, email: decoded.username });
          setRole('admin');
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      } catch {
        localStorage.removeItem('adminToken');
      }
    }

    setLoading(false);
  }, []);

  const loginAsUser = (token, userData) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setRole('user');
  };

  const loginAsAdmin = (token, adminData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setUser(adminData);
    setRole('admin');
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginAsUser, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
