import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box, Typography, Paper, TextField, Button, Grid,
  InputAdornment, CircularProgress, Divider, MenuItem,
} from '@mui/material';
import {
  SportsEsports, Groups, Person, Email, Phone,
  Apartment, SmartToy, ArrowBack,
} from '@mui/icons-material';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import api from '../../api/index';
import { useAuth } from '../../context/AuthContext';

const sx = {
  field: {
    '& .MuiOutlinedInput-root': {
      color: '#fff', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.35)' },
      '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#f59e0b' },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.35)' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' },
  },
};

const CATEGORIES = ['Standard', 'Advanced', 'Junior'];

export default function RoboSoccer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    team_name: '', institution: '', leader_name: user?.name || '',
    leader_email: user?.email || '', leader_phone: '',
    member2: '', member3: '', member4: '',
    robot_description: '', category: 'Standard',
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.team_name || !form.institution || !form.leader_name || !form.leader_email || !form.leader_phone) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/robo-soccer/register', form);
      if (data.success) {
        toast.success(`Robo Soccer registration successful! ID: ${data.registration_id}`);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <HeaderV1 headerStyle="header-style-two" />
      <BreadCrumb title="Robo Soccer Registration" breadCrumb="Robo Soccer" />
      <Box sx={{ background: 'linear-gradient(160deg, #0a0a14 0%, #10001a 60%, #0d0d1a 100%)', py: 6, px: 2, minHeight: '70vh' }}>
        <Box sx={{ maxWidth: 780, mx: 'auto' }}>
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: 2, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' }}>
                <SportsEsports sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>Robo Soccer Registration</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Fill in your team information below</Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Team info */}
              <Typography sx={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, letterSpacing: 1, mb: 2 }}>TEAM INFORMATION</Typography>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Team Name *" fullWidth value={form.team_name} onChange={set('team_name')} required sx={sx.field}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Groups /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Institution *" fullWidth value={form.institution} onChange={set('institution')} required sx={sx.field}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Apartment /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select label="Category *" fullWidth value={form.category} onChange={set('category')} required sx={sx.field}
                    SelectProps={{ MenuProps: { PaperProps: { sx: { background: '#1a1a2e', color: '#fff' } } } }}>
                    {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 3 }} />

              {/* Leader */}
              <Typography sx={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, letterSpacing: 1, mb: 2 }}>TEAM LEADER</Typography>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Leader Name *" fullWidth value={form.leader_name} onChange={set('leader_name')} required sx={sx.field}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Leader Email *" type="email" fullWidth value={form.leader_email} onChange={set('leader_email')} required sx={sx.field}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Leader Phone *" fullWidth value={form.leader_phone} onChange={set('leader_phone')} required sx={sx.field}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }} />
                </Grid>
              </Grid>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 3 }} />

              {/* Members */}
              <Typography sx={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, letterSpacing: 1, mb: 2 }}>TEAM MEMBERS (Optional)</Typography>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {['member2', 'member3', 'member4'].map((m, i) => (
                  <Grid item xs={12} sm={4} key={m}>
                    <TextField label={`Member ${i + 2}`} fullWidth value={form[m]} onChange={set(m)} sx={sx.field}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} />
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 3 }} />

              {/* Robot */}
              <Typography sx={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, letterSpacing: 1, mb: 2 }}>ROBOT DESCRIPTION</Typography>
              <TextField label="Describe your robot (optional)" fullWidth multiline rows={4} value={form.robot_description}
                onChange={set('robot_description')} sx={{ ...sx.field, mb: 4 }}
                InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><SmartToy /></InputAdornment> }} />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} variant="outlined"
                  sx={{ textTransform: 'none', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: 2, flex: 1, minWidth: 140 }}>
                  Back to Dashboard
                </Button>
                <Button type="submit" disabled={loading} variant="contained"
                  sx={{ textTransform: 'none', fontWeight: 700, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', borderRadius: 2, flex: 2, py: 1.5, boxShadow: '0 6px 20px rgba(245,158,11,0.35)', '&:hover': { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' } }}>
                  {loading ? <CircularProgress size={20} sx={{ color: '#000' }} /> : 'Submit Registration'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
      <FooterV2 />
    </>
  );
}
