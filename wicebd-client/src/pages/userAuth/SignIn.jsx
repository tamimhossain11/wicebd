import { useState } from 'react';
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
import { unifiedLogin, googleLogin, facebookLogin } from '../../api/userAuth';
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
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.45)' },
};

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAsUser, loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleRedirect = (role) =>
    navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const { data } = await unifiedLogin(email, password);
      if (data.success) {
        data.role === 'admin'
          ? loginAsAdmin(data.token, data.user)
          : loginAsUser(data.token, data.user);
        toast.success(data.role === 'admin' ? 'Welcome back, Admin!' : `Welcome back, ${data.user.name}!`);
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

  const handleFacebookLogin = () => {
    if (typeof window.FB === 'undefined') { toast.error('Facebook SDK not loaded.'); return; }
    window.FB.login(async (response) => {
      if (response.authResponse) {
        setLoading(true);
        try {
          const { accessToken, userID } = response.authResponse;
          const { data } = await facebookLogin(accessToken, userID);
          if (data.success) {
            loginAsUser(data.token, data.user);
            toast.success(`Welcome, ${data.user.name}!`);
            navigate('/dashboard', { replace: true });
          }
        } catch (err) {
          toast.error(err.response?.data?.message || 'Facebook sign-in failed');
        } finally { setLoading(false); }
      }
    }, { scope: 'public_profile,email' });
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
              <Box
                sx={{
                  borderRadius: '10px', overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                  '& > div': { width: '100% !important' },
                  '& iframe': { width: '100% !important' },
                }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google sign-in failed')}
                  text="signin_with"
                  shape="rectangular"
                  theme="filled_black"
                  width="440"
                />
              </Box>

              {/* Facebook */}
              <Button
                fullWidth
                onClick={handleFacebookLogin}
                disabled={loading}
                startIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                }
                sx={{
                  background: '#1877F2',
                  color: '#fff',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  py: 1.25,
                  '&:hover': { background: '#1465d8' },
                  '&:disabled': { opacity: 0.6 },
                }}
              >
                Continue with Facebook
              </Button>
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  ),
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
                InputProps={{
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
