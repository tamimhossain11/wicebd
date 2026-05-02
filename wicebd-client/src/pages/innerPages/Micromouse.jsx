import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Typography, TextField, Button, Grid,
  InputAdornment, CircularProgress, Divider, MenuItem,
} from '@mui/material';
import {
  Groups, Person, Email, Phone, Apartment,
  SmartToy, ArrowBack, ArrowForward, CheckCircle, Cancel,
} from '@mui/icons-material';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import api from '../../api/index';
import { useAuth } from '../../context/AuthContext';

/* ─── Theme tokens (maroon palette, same as site) ─── */
const C = {
  primary: '#800020',
  accent:  '#c0002a',
  bg:      'linear-gradient(160deg, #0d0006 0%, #1a000a 60%, #200010 100%)',
  muted:   'rgba(255,255,255,0.4)',
};

const f = {
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '10px',
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(128,0,32,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#800020', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.42)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c0002a' },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.28)' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.35)' },
};

const MP = {
  PaperProps: {
    sx: {
      background: '#1a000a', border: '1px solid rgba(128,0,32,0.3)', borderRadius: '10px',
      '& .MuiMenuItem-root': {
        color: 'rgba(255,255,255,0.8)',
        '&:hover': { background: 'rgba(128,0,32,0.2)' },
        '&.Mui-selected': { background: 'rgba(128,0,32,0.4)', color: '#fff' },
      },
    },
  },
};

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const emptyMember = () => ({ name: '', phone: '', size: '' });
const STEPS = ['Team Info', 'Members', 'Robot & Details'];

const SLabel = ({ children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
    <Box sx={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg,#800020,#c0002a)' }} />
    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
      {children}
    </Typography>
  </Box>
);

const SubmitBtn = ({ loading, label }) => (
  <motion.button
    type="submit"
    disabled={loading}
    whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
    whileTap={{ scale: 0.97 }}
    style={{
      padding: '14px 48px', borderRadius: '50px', border: 'none',
      background: loading ? 'rgba(128,0,32,0.4)' : 'linear-gradient(135deg,#800020,#c0002a)',
      color: '#fff', fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em',
      boxShadow: loading ? 'none' : '0 8px 28px rgba(128,0,32,0.45)',
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8,
    }}
  >
    {loading ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Submitting…</> : label}
  </motion.button>
);

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function Micromouse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    team_name: '', institution: '',
    leader_name: user?.name || '', leader_phone: '', leader_email: user?.email || '', leader_size: '',
    bot_name: '', prior_experience: '',
  });

  const [members, setMembers] = useState([emptyMember(), emptyMember()]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setMember = (i, field) => (e) =>
    setMembers((prev) => { const n = [...prev]; n[i] = { ...n[i], [field]: e.target.value }; return n; });

  const nextStep = () => {
    if (step === 0) {
      if (!form.team_name || !form.institution) return toast.error('Team name and institution are required');
      if (!form.leader_name || !form.leader_phone || !form.leader_email) return toast.error('All team leader fields are required');
    }
    // members are optional — no validation required on step 1
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.prior_experience) return toast.error('Please indicate prior competition experience');

    setLoading(true);
    try {
      const payload = {
        ...form,
        member1_name: members[0].name || null, member1_phone: members[0].phone || null, member1_size: members[0].size || null,
        member2_name: members[1].name || null, member2_phone: members[1].phone || null, member2_size: members[1].size || null,
      };
      const { data: regData } = await api.post('/api/micromouse/register', payload);
      if (!regData.success) throw new Error(regData.message || 'Registration failed');

      toast.info('Registration saved! Redirecting to payment…');

      const { data: payData } = await api.post('/api/micromouse/initiate-payment', {
        registration_id: regData.registration_id,
      });
      if (!payData.success) throw new Error(payData.message || 'Payment initiation failed');

      sessionStorage.setItem('paystationInvoice', payData.invoice_number);
      window.location.href = payData.payment_url;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderV1 headerStyle="header-style-two" parentMenu="register" />
      <BreadCrumb title="Micromouse Maze-Solving Registration" breadCrumb="Micromouse" />

      <Box sx={{ background: C.bg, minHeight: '80vh', py: { xs: 5, md: 7 }, px: 2 }}>
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>

          {/* ── Stepper ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5 }}>
            {STEPS.map((label, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.7 }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: i <= step ? 'linear-gradient(135deg,#800020,#c0002a)' : 'rgba(255,255,255,0.06)',
                    border: i === step ? '2px solid rgba(192,0,42,0.5)' : '2px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: i <= step ? '0 4px 16px rgba(128,0,32,0.45)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {i < step
                      ? <CheckCircle sx={{ fontSize: 18, color: '#fff' }} />
                      : <Typography sx={{ color: i <= step ? '#fff' : 'rgba(255,255,255,0.25)', fontWeight: 700, fontSize: 14 }}>{i + 1}</Typography>
                    }
                  </Box>
                  <Typography sx={{ fontSize: 11, color: i <= step ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', fontWeight: i === step ? 700 : 400, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {label}
                  </Typography>
                </Box>
                {i < STEPS.length - 1 && (
                  <Box sx={{ width: { xs: 40, sm: 80 }, height: 2, mx: 1, mb: 2.5, borderRadius: 1, background: i < step ? 'linear-gradient(90deg,#800020,#c0002a)' : 'rgba(255,255,255,0.07)', transition: 'background 0.3s' }} />
                )}
              </Box>
            ))}
          </Box>

          {/* ── Card ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box sx={{
              background: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(128,0,32,0.22)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}>
              {/* Header band */}
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(128,0,32,0.25) 0%, rgba(128,0,32,0.08) 100%)',
                borderBottom: '1px solid rgba(128,0,32,0.2)',
                px: { xs: 3, md: 5 }, py: 3,
                display: 'flex', alignItems: 'center', gap: 2,
              }}>
                <Box sx={{
                  width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
                  background: 'linear-gradient(135deg,#800020,#c0002a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, boxShadow: '0 6px 20px rgba(128,0,32,0.5)',
                }}>
                  🐭
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.2 }}>
                    Micromouse Maze-Solving
                  </Typography>
                  <Typography sx={{ color: C.muted, fontSize: 13, mt: 0.3 }}>
                    Registration fee: <span style={{ color: '#c0002a', fontWeight: 700 }}>৳888</span>
                  </Typography>
                </Box>
              </Box>

              {/* Step content */}
              <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }} component="form" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step0" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>
                      <SLabel>Team Information</SLabel>
                      <Grid container spacing={2.5} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Team Name *" fullWidth value={form.team_name} onChange={set('team_name')} sx={f}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Groups /></InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Institution / Organization *" fullWidth value={form.institution} onChange={set('institution')} sx={f}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Apartment /></InputAdornment> }} />
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: 'rgba(128,0,32,0.15)', mb: 3 }} />
                      <SLabel>Team Leader</SLabel>
                      <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Full Name *" fullWidth value={form.leader_name} onChange={set('leader_name')} sx={f}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Contact Number *" fullWidth value={form.leader_phone} onChange={set('leader_phone')} sx={f}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Email Address *" type="email" fullWidth value={form.leader_email} onChange={set('leader_email')} sx={f}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField select label="T-Shirt Size *" fullWidth value={form.leader_size} onChange={set('leader_size')} sx={f}
                            SelectProps={{ MenuProps: MP }}>
                            {SIZES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                          </TextField>
                        </Grid>
                      </Grid>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>
                      <SLabel>Team Members</SLabel>
                      {members.map((m, i) => (
                        <Box key={i} sx={{ mb: 3.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>{i + 1}</Typography>
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5, fontWeight: 600 }}>
                              Member {i + 1} (Optional)
                            </Typography>
                          </Box>
                          <Grid container spacing={2.5}>
                            <Grid item xs={12} sm={5}>
                              <TextField label="Full Name" fullWidth value={m.name} onChange={setMember(i, 'name')} sx={f}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField label="Contact Number" fullWidth value={m.phone} onChange={setMember(i, 'phone')} sx={f}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <TextField select label="T-Shirt" fullWidth value={m.size} onChange={setMember(i, 'size')} sx={f}
                                SelectProps={{ MenuProps: MP }}>
                                <MenuItem value="">—</MenuItem>
                                {SIZES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                              </TextField>
                            </Grid>
                          </Grid>
                          {i < members.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mt: 3 }} />}
                        </Box>
                      ))}
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>
                      <SLabel>Robot Information</SLabel>
                      <Grid container spacing={2.5} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Bot Name (Optional)" fullWidth value={form.bot_name} onChange={set('bot_name')} sx={f}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SmartToy /></InputAdornment> }} />
                        </Grid>
                      </Grid>

                      <Divider sx={{ borderColor: 'rgba(128,0,32,0.15)', mb: 3 }} />
                      <SLabel>Competition Details</SLabel>
                      <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, mb: 2 }}>
                        Have you participated in Micromouse Maze-Solving competitions before? *
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
                        {[{ v: 'yes', label: 'Yes', icon: <CheckCircle sx={{ fontSize: 16 }} /> }, { v: 'no', label: 'No', icon: <Cancel sx={{ fontSize: 16 }} /> }].map(({ v, label, icon }) => (
                          <Box key={v} onClick={() => setForm((p) => ({ ...p, prior_experience: v }))}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1.3,
                              borderRadius: '50px', cursor: 'pointer',
                              border: form.prior_experience === v ? '2px solid #800020' : '2px solid rgba(255,255,255,0.1)',
                              background: form.prior_experience === v ? 'rgba(128,0,32,0.2)' : 'rgba(255,255,255,0.03)',
                              color: form.prior_experience === v ? '#c0002a' : 'rgba(255,255,255,0.5)',
                              fontWeight: form.prior_experience === v ? 700 : 400,
                              transition: 'all 0.2s',
                              userSelect: 'none',
                              fontSize: 14,
                            }}>
                            {icon}{label}
                          </Box>
                        ))}
                      </Box>

                      <Box sx={{ p: 2.5, borderRadius: '12px', border: '1px solid rgba(128,0,32,0.3)', background: 'rgba(128,0,32,0.08)', mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', mb: 0.3 }}>Registration Fee</Typography>
                            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>৳888</Typography>
                          </Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, maxWidth: 260, lineHeight: 1.6 }}>
                            Payment details will be shared with your team leader after submission.
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Button onClick={() => step === 0 ? navigate('/surprise-segment') : setStep((s) => s - 1)}
                    startIcon={<ArrowBack />}
                    sx={{ color: C.muted, textTransform: 'none', fontWeight: 600, '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.05)' } }}>
                    {step === 0 ? 'Back' : 'Previous'}
                  </Button>
                  {step < 2
                    ? (
                      <motion.button type="button" onClick={nextStep}
                        whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        style={{
                          padding: '12px 36px', borderRadius: '50px', border: 'none',
                          background: 'linear-gradient(135deg,#800020,#c0002a)',
                          color: '#fff', fontSize: 14, fontWeight: 700,
                          boxShadow: '0 6px 20px rgba(128,0,32,0.4)', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                        }}>
                        Next <ArrowForward sx={{ fontSize: 16 }} />
                      </motion.button>
                    )
                    : <SubmitBtn loading={loading} label="Submit Registration" />
                  }
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>

      <FooterV2 />
    </>
  );
}
