import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box, Typography, Grid, Paper, Tabs, Tab, Button, Chip,
  Avatar, CircularProgress, Divider, LinearProgress,
} from '@mui/material';
import {
  Assignment, EmojiEvents, SportsEsports, Notifications,
  CalendarMonth, Person, CheckCircle, RadioButtonUnchecked,
  ArrowForward, Logout,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/index';
import FooterV2 from '../../components/footer/FooterV2';

const CompCard = ({ icon, title, color, description, registered, regId, to, toLabel }) => (
  <Paper sx={{
    p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column',
    background: `linear-gradient(135deg, ${color}18 0%, ${color}06 100%)`,
    border: `1px solid ${color}33`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 40px ${color}22` },
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ width: 52, height: 52, borderRadius: 2, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${color}55` }}>
        {icon}
      </Box>
      {registered
        ? <Chip label="Registered" size="small" icon={<CheckCircle sx={{ fontSize: 14 }} />} sx={{ background: '#10b98122', color: '#10b981', borderColor: '#10b981', border: '1px solid' }} />
        : <Chip label="Not Registered" size="small" icon={<RadioButtonUnchecked sx={{ fontSize: 14 }} />} sx={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }} />
      }
    </Box>
    <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 1 }}>{title}</Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6, flex: 1 }}>{description}</Typography>
    {registered && regId && (
      <Typography sx={{ color: color, fontSize: 12, mt: 1.5, fontFamily: 'monospace' }}>
        ID: {regId}
      </Typography>
    )}
    <Button
      component={Link} to={to} endIcon={<ArrowForward />}
      sx={{
        mt: 2.5, textTransform: 'none', fontWeight: 600, fontSize: 13,
        background: registered ? `${color}22` : color,
        color: registered ? color : '#fff',
        border: `1px solid ${color}44`,
        borderRadius: 2, py: 1,
        '&:hover': { background: color, color: '#fff' },
      }}>
      {toLabel}
    </Button>
  </Paper>
);

const StepItem = ({ done, label, desc }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.3 }}>
      {done
        ? <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
        : <RadioButtonUnchecked sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 22 }} />
      }
      <Box sx={{ width: 2, flex: 1, minHeight: 20, background: done ? '#10b98150' : 'rgba(255,255,255,0.08)', mt: 0.5 }} />
    </Box>
    <Box sx={{ pb: 2 }}>
      <Typography sx={{ color: done ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 14 }}>{label}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{desc}</Typography>
    </Box>
  </Box>
);

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState({ project: [], olympiad: [], roboSoccer: [] });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/user-profile'),
      api.get('/api/user-profile/my-registrations'),
      api.get('/api/announcements'),
    ])
      .then(([p, r, a]) => {
        setProfile(p.data.user);
        setRegistrations(r.data);
        setAnnouncements(a.data.announcements || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); toast.info('Signed out.'); navigate('/sign-in'); };

  const profileComplete = profile?.profile_completed;
  const hasProject = registrations.project?.length > 0;
  const hasOlympiad = registrations.olympiad?.length > 0;
  const hasRobo = registrations.roboSoccer?.length > 0;
  const completedSteps = [true, profileComplete, hasProject || hasOlympiad || hasRobo].filter(Boolean).length;
  const progressPct = Math.round((completedSteps / 3) * 100);

  if (loading) return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#e94560' }} size={52} />
    </Box>
  );

  return (
    <>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a0a14 0%, #10001a 50%, #0d0d1a 100%)', pt: 0 }}>

        {/* ── Top nav bar ── */}
        <Box sx={{
          background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          px: { xs: 2, md: 5 }, py: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Link to="/">
              <img src="/images/logo-2.png" alt="WICE" style={{ height: 36, objectFit: 'contain' }} />
            </Link>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, display: { xs: 'none', sm: 'block' } }}>
              My Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button component={Link} to="/" size="small"
              sx={{ color: 'rgba(255,255,255,0.55)', textTransform: 'none', fontSize: 13, '&:hover': { color: '#fff' } }}>
              Home
            </Button>
            <Button component={Link} to="/profile" size="small"
              sx={{ color: 'rgba(255,255,255,0.55)', textTransform: 'none', fontSize: 13, '&:hover': { color: '#fff' } }}>
              Profile
            </Button>
            <Button startIcon={<Logout sx={{ fontSize: 16 }} />} onClick={handleLogout} size="small"
              sx={{ color: '#e94560', textTransform: 'none', fontSize: 13, border: '1px solid rgba(233,69,96,0.3)', borderRadius: 2, px: 1.5 }}>
              Sign Out
            </Button>
          </Box>
        </Box>

        {/* ── User hero banner ── */}
        <Box sx={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', px: { xs: 2, md: 5 }, py: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 56, height: 56, background: 'linear-gradient(135deg, #e94560, #b0003a)', fontSize: 22, fontWeight: 700, boxShadow: '0 6px 20px rgba(233,69,96,0.4)' }}>
            {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>Welcome back, {user?.name?.split(' ')[0]}!</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{user?.email}</Typography>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2, md: 5 }, py: 3 }}>
          {/* ── Onboarding progress ── */}
          {!profileComplete && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: 'rgba(233,69,96,0.08)', border: '1px solid rgba(233,69,96,0.25)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography fontWeight={700} sx={{ color: '#fff' }}>Complete your profile to register for events</Typography>
                <Chip label={`${progressPct}%`} size="small" sx={{ background: '#e94560', color: '#fff', fontWeight: 700 }} />
              </Box>
              <LinearProgress variant="determinate" value={progressPct}
                sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#e94560', borderRadius: 3 } }} />
              <Button component={Link} to="/profile" sx={{ mt: 2, textTransform: 'none', color: '#e94560', fontWeight: 600, fontSize: 13, p: 0 }}>
                Complete profile now →
              </Button>
            </Paper>
          )}

          {/* ── Tabs ── */}
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable"
            sx={{ mb: 3, '& .MuiTab-root': { color: 'rgba(255,255,255,0.45)', textTransform: 'none', fontWeight: 600 }, '& .Mui-selected': { color: '#e94560' }, '& .MuiTabs-indicator': { background: '#e94560' } }}>
            <Tab label="Competitions" icon={<Assignment sx={{ fontSize: 17 }} />} iconPosition="start" />
            <Tab label="My Registrations" icon={<CheckCircle sx={{ fontSize: 17 }} />} iconPosition="start" />
            <Tab label="Announcements" icon={<Notifications sx={{ fontSize: 17 }} />} iconPosition="start" />
            <Tab label="Schedule" icon={<CalendarMonth sx={{ fontSize: 17 }} />} iconPosition="start" />
          </Tabs>

          {/* ══ TAB 0: COMPETITIONS ══ */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <CompCard
                  icon={<Assignment sx={{ color: '#fff' }} />} color="#e94560"
                  title="Project Competition"
                  description="Register your innovation project for WICE. Teams of up to 3 members compete in categories like Technology, Science, and Social Innovation."
                  registered={hasProject}
                  regId={registrations.project[0]?.paymentID}
                  to="/registration" toLabel={hasProject ? 'View Registration' : 'Register Project'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CompCard
                  icon={<EmojiEvents sx={{ color: '#fff' }} />} color="#0f3460"
                  title="Science Olympiad"
                  description="Individual participation in science, mathematics, and logic-based olympiad competitions for school and college students."
                  registered={hasOlympiad}
                  regId={registrations.olympiad[0]?.registration_id}
                  to="/registration?tab=olympiad" toLabel={hasOlympiad ? 'View Registration' : 'Register for Olympiad'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CompCard
                  icon={<SportsEsports sx={{ color: '#fff' }} />} color="#f59e0b"
                  title="Robo Soccer"
                  description="Build and program a robot to compete in a soccer tournament. Teams of up to 4 members compete in a round-robin format."
                  registered={hasRobo}
                  regId={registrations.roboSoccer[0]?.registration_id}
                  to="/robo-soccer" toLabel={hasRobo ? 'View Registration' : 'Register for Robo Soccer'}
                />
              </Grid>

              {/* Registration journey */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 2.5 }}>Your Journey</Typography>
                  <StepItem done={true} label="Create Account" desc="Account successfully created" />
                  <StepItem done={!!profileComplete} label="Complete Profile" desc="Add family & personal information" />
                  <StepItem done={hasProject || hasOlympiad || hasRobo} label="Register for Event" desc="Choose and register for a competition" />
                </Paper>
              </Grid>

              {/* Quick links */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 2 }}>Quick Links</Typography>
                  <Grid container spacing={1.5}>
                    {[
                      { label: 'About WICE', to: '/about-us' }, { label: 'Schedule', to: '/schedule' },
                      { label: 'Speakers', to: '/speakers' }, { label: 'Pricing', to: '/pricing' },
                      { label: 'FAQs', to: '/faqs' }, { label: 'Contact Us', to: '/contact' },
                      { label: 'Complete Profile', to: '/profile' },
                    ].map(({ label, to }) => (
                      <Grid item key={to}>
                        <Button component={Link} to={to} size="small" variant="outlined"
                          sx={{ textTransform: 'none', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.12)', borderRadius: 5, '&:hover': { borderColor: '#e94560', color: '#e94560' } }}>
                          {label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* ══ TAB 1: MY REGISTRATIONS ══ */}
          {tab === 1 && (
            <Box>
              {[
                { label: 'Project Registrations', data: registrations.project, color: '#e94560', fields: ['competitionCategory', 'projectTitle', 'leader', 'amount'], icon: <Assignment /> },
                { label: 'Olympiad Registrations', data: registrations.olympiad, color: '#0f3460', fields: ['registration_id', 'full_name', 'institution', 'status'], icon: <EmojiEvents /> },
                { label: 'Robo Soccer Registrations', data: registrations.roboSoccer, color: '#f59e0b', fields: ['registration_id', 'team_name', 'institution', 'status'], icon: <SportsEsports /> },
              ].map(({ label, data, color, fields, icon }) => (
                <Box key={label} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{ color }}>{icon}</Box>
                    <Typography fontWeight={700} sx={{ color: '#fff' }}>{label}</Typography>
                    <Chip label={data?.length || 0} size="small" sx={{ background: `${color}22`, color, fontSize: 11 }} />
                  </Box>
                  {!data?.length
                    ? <Paper sx={{ p: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No registrations yet</Typography>
                      </Paper>
                    : data.map((row) => (
                        <Paper key={row.id} sx={{ p: 2.5, mb: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22`, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          {fields.map(f => row[f] && (
                            <Box key={f}>
                              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{f.replace(/_/g, ' ')}</Typography>
                              <Typography sx={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{f === 'amount' ? `৳ ${row[f]}` : row[f]}</Typography>
                            </Box>
                          ))}
                          <Box>
                            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Date</Typography>
                            <Typography sx={{ fontSize: 13, color: '#fff' }}>{new Date(row.created_at || row.createdAt).toLocaleDateString()}</Typography>
                          </Box>
                        </Paper>
                      ))
                  }
                </Box>
              ))}
            </Box>
          )}

          {/* ══ TAB 2: ANNOUNCEMENTS ══ */}
          {tab === 2 && (
            <Box>
              {announcements.length === 0
                ? <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Notifications sx={{ fontSize: 52, color: 'rgba(255,255,255,0.15)', mb: 1 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.35)' }}>No announcements yet</Typography>
                  </Paper>
                : <Grid container spacing={2}>
                    {announcements.map(ann => (
                      <Grid item xs={12} md={6} key={ann.id}>
                        <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography fontWeight={700} sx={{ color: '#fff' }}>{ann.title}</Typography>
                            <Chip label={ann.target_audience} size="small" sx={{ background: '#e9456015', color: '#e94560', fontSize: 11 }} />
                          </Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7 }}>{ann.body}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, mt: 1.5 }}>
                            {new Date(ann.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
              }
            </Box>
          )}

          {/* ══ TAB 3: SCHEDULE ══ */}
          {tab === 3 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CalendarMonth sx={{ fontSize: 64, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2 }}>Full schedule coming soon</Typography>
              <Button component={Link} to="/schedule" variant="outlined"
                sx={{ textTransform: 'none', color: '#e94560', borderColor: '#e9456044' }}>
                View Event Schedule
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <FooterV2 />
    </>
  );
}
