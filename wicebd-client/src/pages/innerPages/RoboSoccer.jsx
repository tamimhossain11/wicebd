import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Typography, TextField, Grid,
  InputAdornment, CircularProgress, Divider, MenuItem, Button,
} from '@mui/material';
import {
  Groups, Person, Email, Phone, Apartment,
  SmartToy, ArrowBack, ArrowForward, CheckCircle, Cancel,
} from '@mui/icons-material';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import api from '../../api/index';
import { useAuth } from '../../context/AuthContext';

const BASE_FEE = 777;

const f = {
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255,255,255,0.04)', borderRadius: '10px', color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(128,0,32,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#800020', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.42)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c0002a' },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.28)' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.35)' },
  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.3)', ml: 0, mt: '4px' },
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

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function RoboSoccer() {
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

  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setMember = (i, field) => (e) =>
    setMembers((prev) => { const n = [...prev]; n[i] = { ...n[i], [field]: e.target.value }; return n; });

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const res = await api.post('/api/promo/validate', {
        code: promoInput.trim().toUpperCase(),
        competition_type: 'robo_soccer',
      });
      if (res.data.valid) {
        setPromoStatus({ valid: true, discountPercentage: res.data.discountPercentage });
      } else {
        setPromoStatus({ valid: false, message: res.data.message || 'Invalid promo code' });
      }
    } catch {
      setPromoStatus({ valid: false, message: 'Could not validate code' });
    } finally {
      setPromoLoading(false);
    }
  };

  const clearPromo = () => { setPromoInput(''); setPromoStatus(null); };

  const discountedFee = promoStatus?.valid
    ? Math.round(BASE_FEE * (1 - promoStatus.discountPercentage / 100))
    : null;

  const nextStep = () => {
    if (step === 0) {
      if (!form.team_name || !form.institution) return toast.error('Team name and institution are required');
      if (!form.leader_name || !form.leader_phone || !form.leader_email) return toast.error('All team leader fields are required');
    }
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
        promo_code: promoStatus?.valid ? promoInput.trim().toUpperCase() : null,
      };
      const { data: regData } = await api.post('/api/robo-soccer/register', payload);
      if (!regData.success) throw new Error(regData.message || 'Registration failed');

      toast.info('Registration saved! Redirecting to payment…');

      const { data: payData } = await api.post('/api/robo-soccer/initiate-payment', {
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
    <div className="page-wrapper">
      <span className="header-span" />
      <HeaderV1 headerStyle="header-style-two" parentMenu="register" />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', padding: '140px 0 72px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.22),transparent 70%)', top: -120, left: -100, filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,0,42,0.12),transparent 70%)', bottom: -60, right: -40, filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>WICEBD 2025 · Robotics</span>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(30px,5vw,48px)', margin: '10px 0 14px', lineHeight: 1.15 }}>Robo Soccer</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 460, margin: '0 auto', lineHeight: 1.8 }}>
              Build your bot, form your team, and compete in the ultimate robotics football challenge.
              Registration fee: <strong style={{ color: '#c0002a' }}>৳{BASE_FEE}</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Form section ── */}
      <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)', padding: '60px 0 100px' }}>
        <div className="auto-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ maxWidth: 800, margin: '0 auto' }}>
            <Box sx={{
              background: 'rgba(255,255,255,0.042)',
              backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderTop: '3px solid #800020',
              borderRadius: '20px',
              px: { xs: 3, md: 6 }, py: { xs: 4, md: 5.5 },
              boxShadow: '0 20px 56px rgba(0,0,0,0.45)',
            }}>

              {/* Card header */}
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '20px', mb: 0.5 }}>
                Robo Soccer Registration
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px', mb: 3 }}>
                8th WICEBD — Robotics Competition
              </Typography>

              {/* Fee + event info bar */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
                <Box sx={{ flex: 1, minWidth: 140, background: 'rgba(128,0,32,0.12)', border: '1px solid rgba(128,0,32,0.28)', borderRadius: '12px', p: '14px 18px' }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', mb: 0.5 }}>
                    Registration Fee
                  </Typography>
                  {discountedFee !== null ? (
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>৳{discountedFee}</Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>৳{BASE_FEE}</Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>৳{BASE_FEE}</Typography>
                  )}
                  {discountedFee !== null && (
                    <Typography sx={{ fontSize: 11, color: '#10b981', fontWeight: 600, mt: 0.4 }}>
                      {promoStatus.discountPercentage}% discount · {promoInput.toUpperCase()}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 140, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '12px', p: '14px 18px' }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', mb: 0.5 }}>
                    Competition
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#800020' }}>⚽ Robo Soccer</Typography>
                  <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', mt: 0.4 }}>Max 3 members per team</Typography>
                </Box>
              </Box>

              {/* Stepper */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                {STEPS.map((label, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.7 }}>
                      <Box sx={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: i <= step ? 'linear-gradient(135deg,#800020,#c0002a)' : 'rgba(255,255,255,0.06)',
                        border: i === step ? '2px solid rgba(192,0,42,0.45)' : '2px solid transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: i <= step ? '0 4px 14px rgba(128,0,32,0.4)' : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {i < step
                          ? <CheckCircle sx={{ fontSize: 16, color: '#fff' }} />
                          : <Typography sx={{ color: i <= step ? '#fff' : 'rgba(255,255,255,0.25)', fontWeight: 700, fontSize: 13 }}>{i + 1}</Typography>
                        }
                      </Box>
                      <Typography sx={{ fontSize: 10, color: i <= step ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.22)', fontWeight: i === step ? 700 : 400, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                        {label}
                      </Typography>
                    </Box>
                    {i < STEPS.length - 1 && (
                      <Box sx={{ width: { xs: 36, sm: 72 }, height: 2, mx: 1, mb: 2.5, borderRadius: 1, background: i < step ? 'linear-gradient(90deg,#800020,#c0002a)' : 'rgba(255,255,255,0.07)', transition: 'background 0.3s' }} />
                    )}
                  </Box>
                ))}
              </Box>

              {/* Step content */}
              <Box component="form" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">

                  {/* Step 0: Team Info */}
                  {step === 0 && (
                    <motion.div key="s0" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                      <SLabel>Team Information</SLabel>
                      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
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

                  {/* Step 1: Members */}
                  {step === 1 && (
                    <motion.div key="s1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                      <SLabel>Team Members (Optional)</SLabel>
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

                  {/* Step 2: Robot & Details */}
                  {step === 2 && (
                    <motion.div key="s2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                      <SLabel>Robot Information</SLabel>
                      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Bot Name (Optional)" fullWidth value={form.bot_name} onChange={set('bot_name')} sx={f}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SmartToy /></InputAdornment> }} />
                        </Grid>
                      </Grid>

                      <Divider sx={{ borderColor: 'rgba(128,0,32,0.15)', mb: 3 }} />
                      <SLabel>Competition Details</SLabel>
                      <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, mb: 2 }}>
                        Have you participated in Robo Soccer competitions before? *
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
                        {[{ v: 'yes', label: 'Yes', icon: <CheckCircle sx={{ fontSize: 16 }} /> }, { v: 'no', label: 'No', icon: <Cancel sx={{ fontSize: 16 }} /> }].map(({ v, label, icon }) => (
                          <Box key={v} onClick={() => setForm((p) => ({ ...p, prior_experience: v }))}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1.3,
                              borderRadius: '50px', cursor: 'pointer', userSelect: 'none', fontSize: 14,
                              border: form.prior_experience === v ? '2px solid #800020' : '2px solid rgba(255,255,255,0.1)',
                              background: form.prior_experience === v ? 'rgba(128,0,32,0.2)' : 'rgba(255,255,255,0.03)',
                              color: form.prior_experience === v ? '#c0002a' : 'rgba(255,255,255,0.5)',
                              fontWeight: form.prior_experience === v ? 700 : 400,
                              transition: 'all 0.2s',
                            }}>
                            {icon}{label}
                          </Box>
                        ))}
                      </Box>

                      <Divider sx={{ borderColor: 'rgba(128,0,32,0.15)', mb: 3 }} />

                      {/* Promo code */}
                      <SLabel>Promo Code (Optional)</SLabel>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 3.5 }}>
                        <TextField
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus(null); }}
                          placeholder="e.g. WICE2025"
                          disabled={promoStatus?.valid}
                          size="small"
                          sx={{ ...f, flex: 1 }}
                          helperText={
                            promoStatus
                              ? promoStatus.valid
                                ? `✓ ${promoStatus.discountPercentage}% discount applied!`
                                : promoStatus.message
                              : 'Enter a promo code if you have one'
                          }
                          FormHelperTextProps={{
                            sx: {
                              color: promoStatus?.valid ? '#10b981' : promoStatus ? '#ff7070' : 'rgba(255,255,255,0.3)',
                              ml: 0, mt: '4px',
                            },
                          }}
                        />
                        {promoStatus?.valid ? (
                          <button type="button" onClick={clearPromo} style={{
                            padding: '9px 18px', borderRadius: '10px', border: '1px solid rgba(255,100,100,0.4)',
                            background: 'rgba(255,80,80,0.1)', color: '#ff7070', fontSize: 13,
                            fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                          }}>Remove</button>
                        ) : (
                          <button type="button" onClick={applyPromo} disabled={promoLoading || !promoInput.trim()} style={{
                            padding: '9px 18px', borderRadius: '10px', border: '1px solid rgba(128,0,32,0.4)',
                            background: 'rgba(128,0,32,0.15)', color: '#c0002a', fontSize: 13,
                            fontWeight: 600, cursor: promoLoading || !promoInput.trim() ? 'not-allowed' : 'pointer',
                            opacity: promoLoading || !promoInput.trim() ? 0.5 : 1,
                            whiteSpace: 'nowrap', flexShrink: 0,
                          }}>{promoLoading ? '…' : 'Apply'}</button>
                        )}
                      </Box>

                      {/* Final fee summary */}
                      <Box sx={{ p: 2.5, borderRadius: '12px', border: '1px solid rgba(128,0,32,0.3)', background: 'rgba(128,0,32,0.08)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', mb: 0.3 }}>
                              Amount Due
                            </Typography>
                            {discountedFee !== null ? (
                              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography sx={{ color: '#10b981', fontWeight: 800, fontSize: 26 }}>৳{discountedFee}</Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: 15, textDecoration: 'line-through' }}>৳{BASE_FEE}</Typography>
                              </Box>
                            ) : (
                              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>৳{BASE_FEE}</Typography>
                            )}
                          </Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, maxWidth: 240, lineHeight: 1.6 }}>
                            You will be redirected to PayStation (bKash) to complete your payment.
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Button
                    onClick={() => step === 0 ? navigate('/surprise-segment') : setStep((s) => s - 1)}
                    startIcon={<ArrowBack />}
                    sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontWeight: 600, '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.05)' } }}>
                    {step === 0 ? 'Back' : 'Previous'}
                  </Button>
                  {step < 2 ? (
                    <motion.button type="button" onClick={nextStep}
                      whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '12px 36px', borderRadius: '50px', border: 'none',
                        background: 'linear-gradient(135deg,#800020,#c0002a)',
                        color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em',
                        boxShadow: '0 6px 20px rgba(128,0,32,0.4)', cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                      }}>
                      Next <ArrowForward sx={{ fontSize: 16 }} />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '13px 44px', borderRadius: '50px', border: 'none',
                        background: loading ? 'rgba(128,0,32,0.4)' : 'linear-gradient(135deg,#800020,#c0002a)',
                        color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '0.05em',
                        boxShadow: loading ? 'none' : '0 8px 28px rgba(128,0,32,0.45)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                      }}>
                      {loading ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Processing…</> : 'Pay & Register →'}
                    </motion.button>
                  )}
                </Box>
              </Box>
            </Box>
          </motion.div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
