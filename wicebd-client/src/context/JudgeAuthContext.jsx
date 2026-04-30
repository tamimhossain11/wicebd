import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const JudgeAuthContext = createContext(null);

export const JudgeAuthProvider = ({ children }) => {
  const [judge, setJudge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('judgeToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now() && decoded.role === 'judge') {
          setJudge({
            id: decoded.id, name: decoded.name, username: decoded.username,
            judge_type: decoded.judge_type, subcategory: decoded.subcategory,
          });
        } else {
          localStorage.removeItem('judgeToken');
          localStorage.removeItem('judgeData');
        }
      } catch {
        localStorage.removeItem('judgeToken');
      }
    }
    setLoading(false);
  }, []);

  const loginAsJudge = (token, judgeData) => {
    localStorage.setItem('judgeToken', token);
    localStorage.setItem('judgeData', JSON.stringify(judgeData));
    setJudge(judgeData);
  };

  const logoutJudge = () => {
    localStorage.removeItem('judgeToken');
    localStorage.removeItem('judgeData');
    setJudge(null);
  };

  return (
    <JudgeAuthContext.Provider value={{ judge, loading, loginAsJudge, logoutJudge }}>
      {children}
    </JudgeAuthContext.Provider>
  );
};

export const useJudgeAuth = () => useContext(JudgeAuthContext);
