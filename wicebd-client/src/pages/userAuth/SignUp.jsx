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
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  HowToRegOutlined,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { signUp, googleLogin } from '../../api/userAuth';
import FooterV2 from '../../components/footer/FooterV2';
import HeaderV1 from '../../components/header/HeaderV1';

/* ── MUI dark glass input style ─────────────────────────────────────── */
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

/* ── Password strength helper ────────────────────────────────────────── */
const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const strengthColor = ['', '#f44336', '#ff9800', '#ffeb3b', '#66bb6a', '#00e676'];

const GOOGLE_ENABLED = import.meta.env.VITE_GOOGLE_CLIENT_ID &&
  import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'your_google_client_id_here';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAsUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;
    if (!name || !email || !password || !confirmPassword) { toast.error('All fields are required'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const { data } = await signUp(name, email, password);
      if (data.success) {
        loginAsUser(data.token, data.user);
        toast.success(`Welcome to WICEBD, ${data.user.name}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data } = await googleLogin(credentialResponse.credential);
      if (data.success) {
        loginAsUser(data.token, data.user);
        toast.success(`Welcome to WICEBD, ${data.user.name}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-up failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <HeaderV1 headerStyle="header-style-two" />

      {/* ── Full-screen background ── */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #10001a 40%, #1a0010 70%, #0d0d1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 18, md: 14 },
          pb: 4,
        }}
      >
        {/* decorative glows */}
        <Box sx={{ position: 'absolute', top: '-10%', right: '-8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,69,96,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,57,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', px: 2, position: 'relative', zIndex: 1 }}>
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
            {/* Header */}
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
                <HowToRegOutlined sx={{ color: '#fff', fontSize: 30 }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, letterSpacing: '-0.5px', mb: 0.5 }}>
                Create Account
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
                Join WICEBD and register for events
              </Typography>
            </Box>

            {/* ── Social buttons ── */}
            {GOOGLE_ENABLED && (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google sign-up failed')}
                  text="signup_with"
                  shape="rectangular"
                  theme="filled_black"
                  width="400"
                />
              </Box>
            )}

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)', mb: 3, mt: GOOGLE_ENABLED ? 0 : 0 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, px: 1 }}>
                or sign up with email
              </Typography>
            </Divider>

            {/* ── Form ── */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                name="name"
                variant="outlined"
                fullWidth
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><PersonOutlined /></InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                value={form.email}
                onChange={handleChange}
                autoComplete="off"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><EmailOutlined /></InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <Box>
                <TextField
                  label="Password"
                  name="password"
                  variant="outlined"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"><LockOutlined /></InputAdornment>
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
                {/* Password strength bar */}
                {form.password.length > 0 && (
                  <Box sx={{ mt: 1, px: 0.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(strength / 5) * 100}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: strengthColor[strength],
                          borderRadius: 2,
                          transition: 'width 0.4s ease',
                        },
                      }}
                    />
                    <Typography sx={{ fontSize: 11, color: strengthColor[strength], mt: 0.5, textAlign: 'right' }}>
                      {strengthLabel[strength]}
                    </Typography>
                  </Box>
                )}
              </Box>

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                variant="outlined"
                fullWidth
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
                required
                error={form.confirmPassword.length > 0 && form.password !== form.confirmPassword}
                helperText={
                  form.confirmPassword.length > 0 && form.password !== form.confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
                FormHelperTextProps={{ sx: { color: '#f44336' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><LockOutlined /></InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...inputSx,
                  '& .MuiOutlinedInput-root': {
                    ...inputSx['& .MuiOutlinedInput-root'],
                    ...(form.confirmPassword.length > 0 && form.password !== form.confirmPassword
                      ? { '& fieldset': { borderColor: '#f44336 !important' } }
                      : {}),
                  },
                }}
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
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create Account'}
              </Button>
            </Box>

            <Typography sx={{ textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              Already have an account?{' '}
              <Link to="/sign-in" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>

      <FooterV2 />
    </>
  );
};

export default SignUp;
