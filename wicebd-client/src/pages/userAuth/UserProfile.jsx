import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box, Typography, Paper, TextField, Button, Grid,
  InputAdornment, CircularProgress, MenuItem, Divider, LinearProgress, Chip,
} from '@mui/material';
import {
  Person, Work, Phone, Home, Cake, School,
  CheckCircle, Save, ArrowBack,
} from '@mui/icons-material';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import api from '../../api/index';
import { useAuth } from '../../context/AuthContext';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.35)' },
    '&.Mui-focused fieldset': { borderColor: '#e94560' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.35)' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' },
};

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
    guardian_phone: '', address: '', date_of_birth: '', gender: '', institution: '', class_grade: '',
  });
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    api.get('/api/user-profile')
      .then(({ data }) => {
        if (data.user) {
          const u = data.user;
          setForm({
            father_name: u.father_name || '', father_occupation: u.father_occupation || '',
            mother_name: u.mother_name || '', mother_occupation: u.mother_occupation || '',
            guardian_phone: u.guardian_phone || '', address: u.address || '',
            date_of_birth: u.date_of_birth?.substring(0, 10) || '',
            gender: u.gender || '', institution: u.institution || '', class_grade: u.class_grade || '',
          });
          setProfileComplete(!!u.profile_completed);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const filledFields = Object.values(form).filter(Boolean).length;
  const completionPct = Math.round((filledFields / Object.keys(form).length) * 100);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/user-profile', form);
      setProfileComplete(true);
      toast.success('Profile saved successfully!');
      setTimeout(() => navigate('/dashboard'), 999);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#e94560' }} />
    </Box>
  );

  return (
    <>
      <HeaderV1 headerStyle="header-style-two" />
      <BreadCrumb title="My Profile" breadCrumb="Profile" />
      <Box sx={{ background: 'linear-gradient(160deg, #0a0a14 0%, #10001a 60%, #0d0d1a 100%)', py: 6, px: 2, minHeight: '70vh' }}>
        <Box sx={{ maxWidth: 780, mx: 'auto' }}>
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(233,69,96,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 56, height: 56, borderRadius: 2, background: 'linear-gradient(135deg, #e94560, #b0003a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(233,69,96,0.4)' }}>
                  <Person sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>My Profile</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{user?.email}</Typography>
                </Box>
              </Box>
              {profileComplete && <Chip icon={<CheckCircle sx={{ fontSize: 14, color: '#10b981 !important' }} />} label="Complete" sx={{ background: '#10b98120', color: '#10b981', border: '1px solid #10b98140' }} />}
            </Box>

            {/* Progress */}
            <Box sx={{ mb: 4, mt: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Profile completion</Typography>
                <Typography sx={{ color: '#e94560', fontSize: 12, fontWeight: 700 }}>{completionPct}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={completionPct}
                sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { bgcolor: '#e94560', borderRadius: 3 } }} />
            </Box>

            <Box component="form" onSubmit={handleSave}>
              {/* Personal info */}
              <Typography sx={{ color: '#e94560', fontWeight: 700, fontSize: 12, letterSpacing: 1, mb: 2 }}>PERSONAL INFORMATION</Typography>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Institution / School / University" fullWidth value={form.institution} onChange={set('institution')} sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><School /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Class / Grade" fullWidth value={form.class_grade} onChange={set('class_grade')} sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><School /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Date of Birth" type="date" fullWidth value={form.date_of_birth} onChange={set('date_of_birth')} sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Cake /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select label="Gender" fullWidth value={form.gender} onChange={set('gender')} sx={fieldSx}
                    SelectProps={{ MenuProps: { PaperProps: { sx: { background: '#1a1a2e', color: '#fff' } } } }}>
                    {['male', 'female', 'other'].map(g => <MenuItem key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Address" fullWidth value={form.address} onChange={set('address')} sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Home /></InputAdornment> }} />
                </Grid>
              </Grid>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 3 }} />

              {/* Family info */}
              <Typography sx={{ color: '#e94560', fontWeight: 700, fontSize: 12, letterSpacing: 1, mb: 2 }}>FAMILY INFORMATION</Typography>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Father's Name" fullWidth value={form.father_name} onChange={set('father_name')} sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Father's Occupation" fullWidth value={form.father_occupation} onChange={set('father_occupation')} sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Work /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Mother's Name" fullWidth value={form.mother_name} onChange={set('mother_name')} sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Mother's Occupation" fullWidth value={form.mother_occupation} onChange={set('mother_occupation')} sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Work /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Guardian Phone" fullWidth value={form.guardian_phone} onChange={set('guardian_phone')} sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }} />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} variant="outlined"
                  sx={{ textTransform: 'none', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: 2, flex: 1, minWidth: 140 }}>
                  Back
                </Button>
                <Button type="submit" disabled={saving} startIcon={saving ? null : <Save />}
                  sx={{ textTransform: 'none', fontWeight: 700, background: 'linear-gradient(135deg, #e94560, #b0003a)', color: '#fff', borderRadius: 2, flex: 2, py: 1.5, boxShadow: '0 6px 20px rgba(233,69,96,0.35)', '&:hover': { background: 'linear-gradient(135deg, #ff5577, #cc0044)' } }}>
                  {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Save Profile'}
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
