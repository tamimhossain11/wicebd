import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const JudgeRoute = ({ children }) => {
  const token = localStorage.getItem('judgeToken');
  if (!token) return <Navigate to="/judge/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded?.role === 'judge' && decoded.exp * 1000 > Date.now()) {
      return children;
    }
    localStorage.removeItem('judgeToken');
    return <Navigate to="/judge/login" replace />;
  } catch {
    localStorage.removeItem('judgeToken');
    return <Navigate to="/judge/login" replace />;
  }
};

export default JudgeRoute;
