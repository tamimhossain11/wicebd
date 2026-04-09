import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box, Typography, Grid, Paper, Button, Chip,
  Avatar, CircularProgress, LinearProgress,
} from '@mui/material';
import {
  Assignment, EmojiEvents, Notifications,
  CalendarMonth, CheckCircle, RadioButtonUnchecked,
  ArrowForward, Logout, Dashboard, Person, Menu, Close,
  Save, Work, Phone, Home, Cake, School,
} from '@mui/icons-material';
import {
  TextField, MenuItem as MuiMenuItem, InputAdornment,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/index';

/* ── Brand colours ── */
const C = {
  bg:       '#0d0006',
  bgMid:    '#120009',
  sidebar:  '#0a0004',
  border:   'rgba(255,255,255,0.07)',
  primary:  '#800020',
  accent:   '#c0002a',
  muted:    'rgba(255,255,255,0.38)',
  card:     'rgba(255,255,255,0.04)',
};

/* ── Field style (matches dashboard dark theme) ── */
const fSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff', borderRadius: '10px', background: 'rgba(255,255,255,0.04)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(128,0,32,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#800020', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c0002a' },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.28)' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.35)' },
  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.3)' },
};

const MP2 = { PaperProps: { sx: { background: '#1a000a', border: '1px solid rgba(128,0,32,0.3)', '& .MuiMenuItem-root': { color: 'rgba(255,255,255,0.8)', '&:hover': { background: 'rgba(128,0,32,0.2)' } } } } };

/* ── Sidebar nav items ── */
const NAV = [
  { id: 'overview',       label: 'Dashboard',        icon: <Dashboard      sx={{ fontSize: 19 }} /> },
  { id: 'competitions',   label: 'Competitions',      icon: <Assignment     sx={{ fontSize: 19 }} /> },
  { id: 'registrations',  label: 'My Registrations',  icon: <CheckCircle    sx={{ fontSize: 19 }} /> },
  { id: 'announcements',  label: 'Announcements',     icon: <Notifications  sx={{ fontSize: 19 }} /> },
  { id: 'schedule',       label: 'Schedule',          icon: <CalendarMonth  sx={{ fontSize: 19 }} /> },
  { id: 'profile',        label: 'Profile',           icon: <Person         sx={{ fontSize: 19 }} /> },
];

/* ── Sidebar ── */
const Sidebar = ({ active, setActive, user, onLogout, open, setOpen }) => (
  <>
    {/* Overlay for mobile */}
    {open && (
      <Box onClick={() => setOpen(false)} sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed', inset: 0, zIndex: 199,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
      }} />
    )}

    <Box sx={{
      width: 240, flexShrink: 0,
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      position: { xs: 'fixed', md: 'sticky' },
      top: 0, left: { xs: open ? 0 : -260, md: 0 },
      height: '100vh',
      zIndex: 200,
      transition: 'left 0.28s ease',
    }}>
      {/* Logo */}
      <Box sx={{
        px: 3, py: 2.5,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/images/logo-normal.PNG" alt="WICE" style={{ height: 38, objectFit: 'contain' }} />
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>WICE BD</Typography>
            <Typography sx={{ color: C.muted, fontSize: 10, letterSpacing: '0.12em' }}>DASHBOARD</Typography>
          </Box>
        </Link>
        <Box onClick={() => setOpen(false)} sx={{ display: { xs: 'flex', md: 'none' }, cursor: 'pointer', color: C.muted }}>
          <Close sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      {/* User pill */}
      <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${C.border}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{
            width: 36, height: 36, fontSize: 14, fontWeight: 700,
            background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
            boxShadow: `0 4px 14px rgba(128,0,32,0.4)`,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav links */}
      <Box sx={{ flex: 1, px: 1.5, py: 2, overflowY: 'auto' }}>
        <Typography sx={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', px: 1.5, mb: 1 }}>
          Navigation
        </Typography>
        {NAV.map(item => {
          const isActive = active === item.id;
          if (item.href) {
            return (
              <Box key={item.id} component={Link} to={item.href} onClick={() => setActive(item.id)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  px: 1.5, py: 1.2, borderRadius: 2, mb: 0.5,
                  textDecoration: 'none', cursor: 'pointer',
                  color: isActive ? '#fff' : C.muted,
                  background: isActive ? `${C.primary}28` : 'transparent',
                  borderLeft: isActive ? `3px solid ${C.primary}` : '3px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': { background: `${C.primary}18`, color: '#fff' },
                }}>
                {item.icon}
                <Typography sx={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{item.label}</Typography>
              </Box>
            );
          }
          return (
            <Box key={item.id} onClick={() => { setActive(item.id); setOpen(false); }}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                px: 1.5, py: 1.2, borderRadius: 2, mb: 0.5,
                cursor: 'pointer',
                color: isActive ? '#fff' : C.muted,
                background: isActive ? `${C.primary}28` : 'transparent',
                borderLeft: isActive ? `3px solid ${C.primary}` : '3px solid transparent',
                transition: 'all 0.2s',
                '&:hover': { background: `${C.primary}18`, color: '#fff' },
              }}>
              {item.icon}
              <Typography sx={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{item.label}</Typography>
            </Box>
          );
        })}
      </Box>

      {/* Bottom links + sign out */}
      <Box sx={{ px: 1.5, py: 2, borderTop: `1px solid ${C.border}` }}>
        <Box component={Link} to="/" sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.1, borderRadius: 2, mb: 0.5,
          textDecoration: 'none', color: C.muted, transition: 'all 0.2s',
          '&:hover': { background: `${C.primary}18`, color: '#fff' },
        }}>
          <Typography sx={{ fontSize: 13 }}>← Back to Site</Typography>
        </Box>
        <Box onClick={onLogout} sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.1, borderRadius: 2,
          cursor: 'pointer', color: '#e94560',
          transition: 'all 0.2s',
          '&:hover': { background: 'rgba(233,69,96,0.1)' },
        }}>
          <Logout sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Sign Out</Typography>
        </Box>
      </Box>
    </Box>
  </>
);

/* ── Early bird deadline ── */
const EARLY_BIRD_DEADLINE = new Date('2026-04-14T23:59:59');
const isEarlyBird = new Date() <= EARLY_BIRD_DEADLINE;

/* ── Competition card ── */
const CompCard = ({ icon, title, color, description, registered, regId, to, toLabel, fee, earlyBirdFee, prizePool, comingSoon }) => (
  <Paper sx={{
    p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column',
    background: `linear-gradient(135deg, ${color}18 0%, ${color}06 100%)`,
    border: `1px solid ${color}33`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 40px ${color}22` },
  }}>
    {/* Header row */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ width: 48, height: 48, borderRadius: 2, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${color}55` }}>
        {icon}
      </Box>
      {registered
        ? <Chip label="Registered" size="small" icon={<CheckCircle sx={{ fontSize: 13 }} />} sx={{ background: '#10b98120', color: '#10b981', border: '1px solid #10b98144', fontSize: 11 }} />
        : comingSoon
          ? <Chip label="Coming Soon" size="small" sx={{ background: 'rgba(255,255,255,0.06)', color: C.muted, fontSize: 11 }} />
          : <Chip label="Open" size="small" sx={{ background: `${color}15`, color, border: `1px solid ${color}33`, fontSize: 11 }} />
      }
    </Box>

    <Typography fontWeight={700} sx={{ color: '#fff', mb: 0.8, fontSize: 15 }}>{title}</Typography>
    <Typography sx={{ color: C.muted, fontSize: 12.5, lineHeight: 1.65, flex: 1 }}>{description}</Typography>

    {/* Fee + prize pool */}
    {(fee || prizePool) && (
      <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {fee && (
          <Box sx={{ flex: 1, minWidth: 90, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22` }}>
            <Typography sx={{ color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.4 }}>
              {earlyBirdFee && isEarlyBird ? 'Early Bird Fee' : 'Registration Fee'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>
                ৳{earlyBirdFee && isEarlyBird ? earlyBirdFee.toLocaleString() : fee.toLocaleString()}
              </Typography>
              {earlyBirdFee && isEarlyBird && (
                <Typography sx={{ color: C.muted, fontSize: 11, textDecoration: 'line-through' }}>
                  ৳{fee.toLocaleString()}
                </Typography>
              )}
            </Box>
            {earlyBirdFee && isEarlyBird && (
              <Typography sx={{ color: '#10b981', fontSize: 10, fontWeight: 700, mt: 0.3 }}>
                Early Bird — ends Apr 14
              </Typography>
            )}
          </Box>
        )}
        {prizePool && (
          <Box sx={{ flex: 1, minWidth: 90, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22` }}>
            <Typography sx={{ color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.4 }}>Prize Pool</Typography>
            <Typography sx={{ color, fontWeight: 800, fontSize: 17 }}>৳{prizePool}</Typography>
          </Box>
        )}
      </Box>
    )}

    {registered && regId && (
      <Typography sx={{ color, fontSize: 11.5, mt: 1.5, fontFamily: 'monospace', background: `${color}12`, px: 1.2, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
        ID: {regId}
      </Typography>
    )}
    <Button component={Link} to={to} endIcon={<ArrowForward sx={{ fontSize: 15 }} />} sx={{
      mt: 2, textTransform: 'none', fontWeight: 600, fontSize: 12.5,
      background: registered ? `${color}18` : color,
      color: registered ? color : '#fff',
      border: `1px solid ${color}44`,
      borderRadius: 2, py: 0.9,
      '&:hover': { background: color, color: '#fff' },
    }}>
      {toLabel}
    </Button>
  </Paper>
);

/* ── Step item ── */
const StepItem = ({ done, label, desc }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 1.8 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.3 }}>
      {done ? <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} /> : <RadioButtonUnchecked sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 20 }} />}
      <Box sx={{ width: 1.5, flex: 1, minHeight: 16, background: done ? '#10b98140' : 'rgba(255,255,255,0.07)', mt: 0.5 }} />
    </Box>
    <Box sx={{ pb: 1.5 }}>
      <Typography sx={{ color: done ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: 13.5 }}>{label}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{desc}</Typography>
    </Box>
  </Box>
);

/* ── Stat card ── */
const StatCard = ({ label, value, color, icon }) => (
  <Paper sx={{
    p: 2.5, borderRadius: 3,
    background: `linear-gradient(135deg, ${color}15, ${color}06)`,
    border: `1px solid ${color}28`,
    display: 'flex', alignItems: 'center', gap: 2,
  }}>
    <Box sx={{ width: 44, height: 44, borderRadius: 2, background: `${color}22`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</Typography>
      <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>{value}</Typography>
    </Box>
  </Paper>
);

/* ═══════════════════════════════════════════════ */
export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registrations, setRegistrations] = useState({ project: [], olympiad: [], roboSoccer: [] });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
    guardian_phone: '', address: '', date_of_birth: '', gender: '', institution: '', class_grade: '',
  });
  const [saving, setSaving] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/api/user-profile'),
      api.get('/api/user-profile/my-registrations'),
      api.get('/api/announcements'),
    ])
      .then(([p, r, a]) => {
        const u = p.data.user;
        setProfileComplete(!!u?.profile_completed);
        if (u) {
          setProfileForm({
            father_name: u.father_name || '', father_occupation: u.father_occupation || '',
            mother_name: u.mother_name || '', mother_occupation: u.mother_occupation || '',
            guardian_phone: u.guardian_phone || '', address: u.address || '',
            date_of_birth: u.date_of_birth?.substring(0, 10) || '',
            gender: u.gender || '', institution: u.institution || '', class_grade: u.class_grade || '',
          });
        }
        setRegistrations(r.data);
        setAnnouncements(a.data.announcements || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); toast.info('Signed out.'); navigate('/sign-in'); };

  const setField = (k) => (e) => setProfileForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/user-profile', profileForm);
      setProfileComplete(true);
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally { setSaving(false); }
  };

  const filledFields = Object.values(profileForm).filter(Boolean).length;
  const profilePct = Math.round((filledFields / Object.keys(profileForm).length) * 100);

  const hasProject  = registrations.project?.length > 0;
  const hasOlympiad = registrations.olympiad?.length > 0;
  const totalRegs   = (registrations.project?.length || 0) + (registrations.olympiad?.length || 0);
  const completedSteps = [true, profileComplete, hasProject || hasOlympiad].filter(Boolean).length;
  const progressPct = Math.round((completedSteps / 3) * 100);

  if (loading) return (
    <Box sx={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: C.primary }} size={48} thickness={3} />
        <Typography sx={{ color: C.muted, mt: 2, fontSize: 13 }}>Loading your dashboard…</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: C.bg }}>

      {/* ── Left Sidebar ── */}
      <Sidebar
        active={active} setActive={setActive}
        user={user} onLogout={handleLogout}
        open={sidebarOpen} setOpen={setSidebarOpen}
      />

      {/* ── Main ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>

        {/* ── Top header ── */}
        <Box sx={{
          background: 'rgba(10,0,4,0.9)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${C.border}`,
          px: { xs: 2, md: 3.5 }, py: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Mobile hamburger */}
            <Box onClick={() => setSidebarOpen(true)} sx={{ display: { xs: 'flex', md: 'none' }, cursor: 'pointer', color: C.muted }}>
              <Menu />
            </Box>
            {/* Breadcrumb */}
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                {NAV.find(n => n.id === active)?.label || 'Dashboard'}
              </Typography>
              <Typography sx={{ color: C.muted, fontSize: 11 }}>
                WICE Bangladesh 2025 — 8th Edition
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Nav links (desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Partners', to: '/partners' },
                { label: 'Contact', to: '/contact' },
              ].map(({ label, to }) => (
                <Button key={to} component={Link} to={to} size="small" sx={{
                  color: C.muted, textTransform: 'none', fontSize: 12.5, fontWeight: 500,
                  '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.05)' },
                }}>
                  {label}
                </Button>
              ))}
            </Box>

            {/* Register CTA */}
            <Button component={Link} to="/registration" size="small" sx={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
              color: '#fff', textTransform: 'none', fontSize: 12.5, fontWeight: 700,
              borderRadius: 2, px: 2, py: 0.8,
              boxShadow: `0 4px 16px rgba(128,0,32,0.4)`,
              '&:hover': { opacity: 0.9 },
            }}>
              Register Now
            </Button>

            {/* Avatar */}
            <Avatar sx={{
              width: 32, height: 32, fontSize: 13, fontWeight: 700,
              background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
              cursor: 'pointer',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Box>

        {/* ── Page content ── */}
        <Box sx={{ flex: 1, px: { xs: 2, md: 3.5 }, py: 3 }}>

          {/* Profile incomplete banner */}
          {!profileComplete && active === 'overview' && (
            <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, background: 'rgba(128,0,32,0.1)', border: `1px solid rgba(128,0,32,0.3)`, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14 }}>
                  Complete your profile to unlock all features
                </Typography>
                <LinearProgress variant="determinate" value={progressPct}
                  sx={{ mt: 1.5, height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: C.primary, borderRadius: 3 } }} />
              </Box>
              <Button onClick={() => setActive('profile')} size="small" sx={{
                textTransform: 'none', color: '#fff', fontWeight: 700, fontSize: 12.5,
                background: C.primary, borderRadius: 2, px: 2, '&:hover': { background: C.accent },
              }}>
                Complete Profile →
              </Button>
            </Paper>
          )}

          {/* ══ OVERVIEW ══ */}
          {active === 'overview' && (
            <Box>
              {/* Welcome */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>
                  Welcome back, {user?.name?.split(' ')[0]} 👋
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 13.5, mt: 0.5 }}>
                  Here's an overview of your WICE journey.
                </Typography>
              </Box>

              {/* Stat cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard label="Registrations" value={totalRegs} color={C.primary} icon={<Assignment sx={{ fontSize: 20 }} />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard label="Announcements" value={announcements.length} color="#0f3460" icon={<Notifications sx={{ fontSize: 20 }} />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard label="Profile" value={profileComplete ? '100%' : `${progressPct}%`} color="#10b981" icon={<Person sx={{ fontSize: 20 }} />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard label="Edition" value="8th" color="#f59e0b" icon={<EmojiEvents sx={{ fontSize: 20 }} />} />
                </Grid>
              </Grid>

              {/* Journey + Quick Links */}
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={5}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: C.card, border: `1px solid ${C.border}`, height: '100%' }}>
                    <Typography fontWeight={700} sx={{ color: '#fff', mb: 2.5, fontSize: 15 }}>Your Journey</Typography>
                    <StepItem done label="Create Account" desc="Account successfully created" />
                    <StepItem done={!!profileComplete} label="Complete Profile" desc="Add personal & family information" />
                    <StepItem done={hasProject || hasOlympiad} label="Register for Event" desc="Choose and register for a competition" />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: C.card, border: `1px solid ${C.border}`, height: '100%' }}>
                    <Typography fontWeight={700} sx={{ color: '#fff', mb: 2, fontSize: 15 }}>Quick Links</Typography>
                    <Grid container spacing={1.2}>
                      {[
                        { label: 'About WICE', to: '/about-us' },
                        { label: 'Partners', to: '/partners' },
                        { label: 'Schedule', to: '/schedule' },
                        { label: 'FAQs', to: '/faqs' },
                        { label: 'Contact Us', to: '/contact' },
                        { label: 'Complete Profile', to: null },
                        { label: 'Register Now', to: '/registration' },
                      ].map(({ label, to }) => (
                        <Grid item key={label}>
                          <Button
                            {...(to ? { component: Link, to } : { onClick: () => setActive('profile') })}
                            size="small" sx={{
                              textTransform: 'none', color: C.muted, fontSize: 12,
                              border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 5,
                              '&:hover': { borderColor: C.primary, color: '#fff', background: `${C.primary}15` },
                            }}>
                            {label}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Recent announcement */}
                    {announcements[0] && (
                      <Box sx={{ mt: 2.5, p: 2, borderRadius: 2, background: `${C.primary}10`, border: `1px solid ${C.primary}28` }}>
                        <Typography sx={{ color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', mb: 0.5 }}>Latest Announcement</Typography>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{announcements[0].title}</Typography>
                        <Typography sx={{ color: C.muted, fontSize: 12, mt: 0.4, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {announcements[0].body}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ══ COMPETITIONS ══ */}
          {active === 'competitions' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>Competitions</Typography>
                <Typography sx={{ color: C.muted, fontSize: 13.5, mt: 0.5 }}>Register for WICE Bangladesh 2025 events.</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CompCard
                    icon={<Assignment sx={{ color: '#fff', fontSize: 22 }} />} color="#800020"
                    title="Project Competition"
                    description="Register your innovation project for WICE. Teams of up to 3 members compete in categories like Technology, Science, and Social Innovation."
                    registered={hasProject}
                    regId={registrations.project[0]?.paymentID}
                    to="/registration" toLabel={hasProject ? 'View Registration' : 'Register Project'}
                    fee={1200} earlyBirdFee={999}
                    prizePool="2,00,000"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CompCard
                    icon={<Assignment sx={{ color: '#fff', fontSize: 22 }} />} color="#10b981"
                    title="Wall Magazine"
                    description="Showcase creativity through wall magazine entries. Team-based competition judged on design, content, and originality."
                    registered={false}
                    to="/registration?tab=wall-magazine" toLabel="Register for Wall Magazine"
                    fee={399}
                    prizePool="30,000"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CompCard
                    icon={<EmojiEvents sx={{ color: '#fff', fontSize: 22 }} />} color="#0f3460"
                    title="Science Olympiad"
                    description="Individual participation in science, mathematics, and logic-based olympiad competitions for school and college students."
                    registered={hasOlympiad}
                    regId={registrations.olympiad[0]?.registration_id}
                    to="/registration?tab=olympiad" toLabel={hasOlympiad ? 'View Registration' : 'Register for Olympiad'}
                    fee={50}
                    prizePool="10,000"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CompCard
                    icon={<span style={{ fontSize: 22, color: '#fff' }}>🎯</span>} color="#800020"
                    title="Surprise Segment"
                    description="Something extraordinary is coming. A brand-new competition segment will be revealed at the event. Stay tuned!"
                    registered={false} comingSoon
                    to="/surprise-segment" toLabel="Learn More"
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ══ MY REGISTRATIONS ══ */}
          {active === 'registrations' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>My Registrations</Typography>
                <Typography sx={{ color: C.muted, fontSize: 13.5, mt: 0.5 }}>All your competition registrations.</Typography>
              </Box>
              {[
                { label: 'Project Registrations',  data: registrations.project,  color: C.primary, fields: ['competitionCategory', 'projectTitle', 'leader', 'amount'], icon: <Assignment /> },
                { label: 'Olympiad Registrations', data: registrations.olympiad, color: '#0f3460', fields: ['registration_id', 'full_name', 'institution', 'status'], icon: <EmojiEvents /> },
              ].map(({ label, data, color, fields, icon }) => (
                <Box key={label} sx={{ mb: 3.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ color, display: 'flex' }}>{icon}</Box>
                    <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 15 }}>{label}</Typography>
                    <Chip label={data?.length || 0} size="small" sx={{ background: `${color}20`, color, fontSize: 11, height: 20 }} />
                  </Box>
                  {!data?.length
                    ? <Paper sx={{ p: 3, borderRadius: 2, background: C.card, border: `1px solid ${C.border}`, textAlign: 'center' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No registrations yet</Typography>
                      </Paper>
                    : data.map(row => (
                        <Paper key={row.id} sx={{ p: 2.5, mb: 1.5, borderRadius: 2, background: C.card, border: `1px solid ${color}22`, display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                          {fields.map(f => row[f] && (
                            <Box key={f}>
                              <Typography sx={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', textTransform: 'capitalize', mb: 0.3 }}>{f.replace(/_/g, ' ')}</Typography>
                              <Typography sx={{ fontSize: 13.5, color: '#fff', fontWeight: 500 }}>{f === 'amount' ? `৳ ${row[f]}` : row[f]}</Typography>
                            </Box>
                          ))}
                          <Box>
                            <Typography sx={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', mb: 0.3 }}>Date</Typography>
                            <Typography sx={{ fontSize: 13.5, color: '#fff' }}>{new Date(row.created_at || row.createdAt).toLocaleDateString()}</Typography>
                          </Box>
                        </Paper>
                      ))
                  }
                </Box>
              ))}
            </Box>
          )}

          {/* ══ ANNOUNCEMENTS ══ */}
          {active === 'announcements' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>Announcements</Typography>
                <Typography sx={{ color: C.muted, fontSize: 13.5, mt: 0.5 }}>{announcements.length} announcement{announcements.length !== 1 ? 's' : ''} available.</Typography>
              </Box>
              {announcements.length === 0
                ? <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
                    <Notifications sx={{ fontSize: 52, color: 'rgba(255,255,255,0.1)', mb: 1 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>No announcements yet</Typography>
                  </Paper>
                : <Grid container spacing={2}>
                    {announcements.map(ann => (
                      <Grid item xs={12} md={6} key={ann.id}>
                        <Paper sx={{ p: 3, borderRadius: 3, background: C.card, border: `1px solid ${C.border}`, height: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, lineHeight: 1.4, flex: 1, mr: 1 }}>{ann.title}</Typography>
                            <Chip label={ann.target_audience} size="small" sx={{ background: `${C.primary}18`, color: C.accent, fontSize: 10, height: 20, flexShrink: 0 }} />
                          </Box>
                          <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{ann.body}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, mt: 2 }}>
                            {new Date(ann.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
              }
            </Box>
          )}

          {/* ══ SCHEDULE ══ */}
          {active === 'schedule' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>Event Schedule</Typography>
                <Typography sx={{ color: C.muted, fontSize: 13.5, mt: 0.5 }}>WICE Bangladesh 2025 — 8th Edition</Typography>
              </Box>
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
                <CalendarMonth sx={{ fontSize: 64, color: `${C.primary}55`, mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.8 }}>Full schedule coming soon</Typography>
                <Typography sx={{ color: C.muted, fontSize: 13, mb: 3 }}>Event date: May 9, 2026</Typography>
                <Button component={Link} to="/schedule" sx={{
                  textTransform: 'none', color: '#fff', fontWeight: 700,
                  background: C.primary, borderRadius: 2, px: 3,
                  '&:hover': { background: C.accent },
                }}>
                  View Full Schedule →
                </Button>
              </Paper>
            </Box>
          )}

          {/* ══ PROFILE ══ */}
          {active === 'profile' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>My Profile</Typography>
                <Typography sx={{ color: C.muted, fontSize: 13.5, mt: 0.5 }}>Manage your personal and family information.</Typography>
              </Box>

              {/* Account info card */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: `linear-gradient(135deg, ${C.primary}18, ${C.primary}06)`, border: `1px solid ${C.primary}30`, display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                <Box sx={{
                  width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800, color: '#fff',
                  boxShadow: `0 6px 20px rgba(128,0,32,0.45)`,
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Box>
                <Box sx={{ flex: 1, minWidth: 180 }}>
                  <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 17 }}>{user?.name}</Typography>
                  <Typography sx={{ color: C.muted, fontSize: 13 }}>{user?.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {profileComplete
                    ? <Chip icon={<CheckCircle sx={{ fontSize: 14, color: '#10b981 !important' }} />} label="Profile Complete" sx={{ background: '#10b98118', color: '#10b981', border: '1px solid #10b98130', fontWeight: 600 }} />
                    : <Chip label={`${profilePct}% Complete`} sx={{ background: `${C.primary}18`, color: C.accent, border: `1px solid ${C.primary}30`, fontWeight: 600 }} />
                  }
                </Box>
              </Paper>

              {/* Progress bar */}
              <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: C.muted, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Profile Completion</Typography>
                  <Typography sx={{ color: C.primary, fontSize: 12, fontWeight: 700 }}>{profilePct}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={profilePct}
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { bgcolor: C.primary, borderRadius: 3 } }} />
              </Paper>

              {/* Form */}
              <Box component="form" onSubmit={handleSaveProfile}>
                {/* Personal info */}
                <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
                    <Box sx={{ width: 6, height: 22, borderRadius: 3, background: `linear-gradient(180deg, ${C.primary}, ${C.accent})` }} />
                    <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personal Information</Typography>
                  </Box>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Institution / School / University" fullWidth value={profileForm.institution} onChange={setField('institution')} sx={fSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><School /></InputAdornment> } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Class / Grade" fullWidth value={profileForm.class_grade} onChange={setField('class_grade')} sx={fSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><School /></InputAdornment> } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Date of Birth" type="date" fullWidth value={profileForm.date_of_birth} onChange={setField('date_of_birth')} sx={fSx}
                        slotProps={{ inputLabel: { shrink: true }, input: { startAdornment: <InputAdornment position="start"><Cake /></InputAdornment> } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select label="Gender" fullWidth value={profileForm.gender} onChange={setField('gender')} sx={fSx}
                        slotProps={{ select: { MenuProps: MP2 } }}>
                        {['male', 'female', 'other'].map(g => (
                          <MuiMenuItem key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</MuiMenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Address" fullWidth value={profileForm.address} onChange={setField('address')} sx={fSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Home /></InputAdornment> } }} />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Family info */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
                    <Box sx={{ width: 6, height: 22, borderRadius: 3, background: `linear-gradient(180deg, ${C.primary}, ${C.accent})` }} />
                    <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Family Information</Typography>
                  </Box>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Father's Name" fullWidth value={profileForm.father_name} onChange={setField('father_name')} sx={fSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person /></InputAdornment> } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Father's Occupation" fullWidth value={profileForm.father_occupation} onChange={setField('father_occupation')} sx={fSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Work /></InputAdornment> } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Mother's Name" fullWidth value={profileForm.mother_name} onChange={setField('mother_name')} sx={fSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person /></InputAdornment> } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Mother's Occupation" fullWidth value={profileForm.mother_occupation} onChange={setField('mother_occupation')} sx={fSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Work /></InputAdornment> } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Guardian Phone" fullWidth value={profileForm.guardian_phone} onChange={setField('guardian_phone')} sx={fSx}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> } }} />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Save button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" disabled={saving} startIcon={saving ? null : <Save />} sx={{
                    textTransform: 'none', fontWeight: 700, fontSize: 14,
                    background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
                    color: '#fff', borderRadius: 2, px: 4, py: 1.3,
                    boxShadow: `0 6px 20px rgba(128,0,32,0.4)`,
                    '&:hover': { opacity: 0.9, boxShadow: `0 8px 28px rgba(128,0,32,0.55)` },
                    '&:disabled': { background: 'rgba(128,0,32,0.3)', color: 'rgba(255,255,255,0.4)' },
                  }}>
                    {saving ? <><CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} />Saving…</> : 'Save Profile'}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  );
}
