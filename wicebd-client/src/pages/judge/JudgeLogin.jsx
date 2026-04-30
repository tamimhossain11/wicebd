import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, CircularProgress, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Gavel } from '@mui/icons-material';
import { useJudgeAuth } from '../../context/JudgeAuthContext';
import api from '../../api/index';

const BG = '#07070f';
const CARD = '#12122a';
const ACCENT = '#800020';
const BORDER = 'rgba(255,255,255,0.08)';

const fSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff', borderRadius: '10px', background: 'rgba(255,255,255,0.04)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(128,0,32,0.5)' },
    '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c0002a' },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.28)' },
};

const JudgeLogin = () => {
  const navigate = useNavigate();
  const { loginAsJudge } = useJudgeAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/judge/login', form);
      if (data.success) {
        loginAsJudge(data.token, data.judge);
        navigate('/judge/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(160deg, ${BG} 0%, #120018 60%, #1a0028 100%)`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow orbs */}
      <Box sx={{ position: 'absolute', width: 480, height: 480, top: -150, left: -150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(128,0,32,0.18) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 340, height: 340, bottom: -100, right: -80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <Paper component="form" onSubmit={handleSubmit} sx={{
        p: { xs: 3, sm: 5 }, borderRadius: 4, width: '100%', maxWidth: 420, mx: 2,
        background: CARD, border: `1px solid ${BORDER}`,
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{
            width: 72, height: 72, borderRadius: '20px', mb: 2,
            background: `linear-gradient(135deg, ${ACCENT}, #4f0014)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 12px 32px rgba(128,0,32,0.5)`,
          }}>
            <Gavel sx={{ color: '#fff', fontSize: 36 }} />
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            Judge Portal
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, mt: 0.5 }}>
            8th WICEBD — Judging Panel
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, background: 'rgba(220,38,38,0.12)', color: '#fca5a5', '& .MuiAlert-icon': { color: '#f87171' }, border: '1px solid rgba(220,38,38,0.25)' }}>{error}</Alert>}

        <TextField
          fullWidth label="Username" sx={{ ...fSx, mb: 2.5 }}
          value={form.username}
          onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
          autoComplete="username"
        />
        <TextField
          fullWidth label="Password" sx={{ ...fSx, mb: 3.5 }}
          type={showPw ? 'text' : 'password'}
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPw(p => !p)} edge="end" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth type="submit" variant="contained" disabled={loading}
          sx={{
            py: 1.6, borderRadius: '12px', fontWeight: 700, fontSize: 15,
            background: `linear-gradient(135deg, ${ACCENT}, #4f0014)`,
            boxShadow: `0 8px 24px rgba(128,0,32,0.4)`,
            '&:hover': { background: `linear-gradient(135deg, #a00028, #600018)` },
          }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
        </Button>
      </Paper>
    </Box>
  );
};

export default JudgeLogin;
