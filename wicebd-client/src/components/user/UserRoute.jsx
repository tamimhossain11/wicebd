import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user || role !== 'user') {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default UserRoute;
