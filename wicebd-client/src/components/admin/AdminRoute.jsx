// src/components/AdminRoute.js
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    
    // Check both role and token expiration
    if (decoded?.role === 'admin' && decoded.exp * 1000 > Date.now()) {
      return children;
    }
    
    // Token expired or wrong role - clear invalid token
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin/login" replace />;
    
  } catch (err) {
    console.error('Invalid token:', err);
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminRoute;