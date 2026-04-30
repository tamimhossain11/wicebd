import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useJudgeAuth } from '../../context/JudgeAuthContext';
import { unifiedLogin, googleLogin } from '../../api/userAuth';
import FooterV2 from '../../components/footer/FooterV2';
import HeaderV1 from '../../components/header/HeaderV1';

/* ── MUI theme overrides for dark glass inputs ─────────────────────── */
const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(6px)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#e94560' },
    // Override browser autofill white background on mobile
    '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
      WebkitTextFillColor: '#fff',
      WebkitBoxShadow: '0 0 0 1000px #1a0010 inset',
      caretColor: '#fff',
      transition: 'background-color 5000s ease-in-out 0s',
    },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.45)' },
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_ENABLED = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your_google_client_id_here';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(400);
  const googleContainerRef = useRef(null);
  const { loginAsUser, loginAsAdmin } = useAuth();
  const { loginAsJudge } = useJudgeAuth();
  const navigate = useNavigate();

  // Dynamically measure container so GoogleLogin iframe matches its width
  useEffect(() => {
    const el = googleContainerRef.current;
    if (!el) return;
    const measure = () => setGoogleBtnWidth(Math.max(200, Math.floor(el.offsetWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleRedirect = (role) => {
    if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'judge') navigate('/judge/dashboard', { replace: true });
    else navigate('/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const { data } = await unifiedLogin(email, password);
      if (data.success) {
        if (data.role === 'admin') {
          loginAsAdmin(data.token, data.user);
          toast.success('Welcome back, Admin!');
        } else if (data.role === 'judge') {
          loginAsJudge(data.token, data.user);
          toast.success(`Welcome, Judge ${data.user.name}!`);
        } else {
          loginAsUser(data.token, data.user);
          toast.success(`Welcome back, ${data.user.name}!`);
        }
        handleRedirect(data.role);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data } = await googleLogin(credentialResponse.credential);
      if (data.success) {
        loginAsUser(data.token, data.user);
        toast.success(`Welcome, ${data.user.name}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed');
    } finally { setLoading(false); }
  };


  return (
    <>
      <HeaderV1 headerStyle="header-style-two" />

      {/* ── Full-screen hero background ── */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #10001a 40%, #1a0010 70%, #0d0d1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 10, md: 8 },
          pb: 4,
        }}
      >
        {/* decorative glows */}
        <Box sx={{ position: 'absolute', top: '-15%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,69,96,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,57,255,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto', px: 2, position: 'relative', zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '24px',
              p: { xs: 3.5, md: 5 },
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header text */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: '18px',
                  background: 'linear-gradient(135deg, #e94560, #b0003a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2.5,
                  boxShadow: '0 8px 24px rgba(233,69,96,0.4)',
                }}
              >
                <LockOutlined sx={{ color: '#fff', fontSize: 30 }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, letterSpacing: '-0.5px', mb: 0.5 }}>
                Welcome back
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
                Sign in to your WICEBD account
              </Typography>
            </Box>

            {/* ── Social buttons ── */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              {/* Google */}
              {GOOGLE_ENABLED ? (
                <Box
                  ref={googleContainerRef}
                  sx={{
                    borderRadius: '10px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.12)',
                    width: '100%',
                  }}
                >
                  <GoogleLogin
                    key={googleBtnWidth}
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google sign-in failed')}
                    text="signin_with"
                    shape="rectangular"
                    theme="filled_black"
                    width={String(googleBtnWidth)}
                  />
                </Box>
              ) : (
                <Button
                  fullWidth
                  onClick={() => toast.info('Google sign-in is not configured yet. Please add VITE_GOOGLE_CLIENT_ID to your .env file.')}
                  startIcon={
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  }
                  sx={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.75)',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1.25,
                    border: '1px solid rgba(255,255,255,0.12)',
                    '&:hover': { background: 'rgba(255,255,255,0.10)' },
                  }}
                >
                  Continue with Google
                </Button>
              )}

              {/* Facebook login hidden */}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)', mb: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, px: 1 }}>
                or sign in with email
              </Typography>
            </Divider>

            {/* ── Form ── */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email or Username"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={inputSx}
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={inputSx}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.5,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #e94560 0%, #b0003a 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: 'none',
                  letterSpacing: '0.3px',
                  boxShadow: '0 8px 24px rgba(233,69,96,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5577 0%, #cc0044 100%)',
                    boxShadow: '0 8px 32px rgba(233,69,96,0.5)',
                  },
                  '&:disabled': { opacity: 0.7 },
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
              </Button>
            </Box>

            {/* Footer link */}
            <Typography sx={{ textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              Don&apos;t have an account?{' '}
              <Link to="/sign-up" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>
                Create one
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>

      <FooterV2 />
    </>
  );
};

export default SignIn;
