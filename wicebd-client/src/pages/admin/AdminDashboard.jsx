import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Paper, Button, IconButton,
  Chip, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, CircularProgress,
  Alert, Tooltip, Avatar, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  Logout, Refresh, FileDownload, Add, Delete, Send,
  People, Assignment, EmojiEvents, SportsEsports,
  Notifications, TrendingUp, AdminPanelSettings, Menu as MenuIcon,
  ChevronLeft,
} from '@mui/icons-material';
import api from '../../api/index';
import { useAuth } from '../../context/AuthContext';

const SIDEBAR_WIDTH = 240;
const COLORS = ['#e94560', '#0f3460', '#f59e0b', '#10b981', '#8b5cf6'];

const NAV_ITEMS = [
  { label: 'Analytics', icon: <TrendingUp /> },
  { label: 'Project', icon: <Assignment /> },
  { label: 'Olympiad', icon: <EmojiEvents /> },
  { label: 'Robo Soccer', icon: <SportsEsports /> },
  { label: 'Announcements', icon: <Notifications /> },
  { label: 'Users', icon: <People /> },
];

const StatCard = ({ icon, label, value, color, sub }) => (
  <Paper sx={{
    p: 3, borderRadius: 3,
    background: `linear-gradient(135deg, ${color}22 0%, ${color}08 100%)`,
    border: `1px solid ${color}33`,
    display: 'flex', alignItems: 'center', gap: 2,
    transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' },
  }}>
    <Box sx={{
      width: 56, height: 56, borderRadius: 2,
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 14px ${color}55`, flexShrink: 0,
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h4" fontWeight={800} color={color}>{value ?? '—'}</Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
      {sub && <Typography variant="caption" color="text.disabled">{sub}</Typography>}
    </Box>
  </Paper>
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeNav, setActiveNav] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [olympiad, setOlympiad] = useState([]);
  const [roboSoccer, setRoboSoccer] = useState([]);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [annDialog, setAnnDialog] = useState(false);
  const [annForm, setAnnForm] = useState({ title: '', body: '', target_audience: 'all', send_email: false });
  const [annLoading, setAnnLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ana, proj, oly, robo, ann] = await Promise.all([
        api.get('/api/analytics'),
        api.get('/api/admin/participants'),
        api.get('/api/olympiad/getolympiad'),
        api.get('/api/robo-soccer/all'),
        api.get('/api/announcements/admin'),
      ]);
      setAnalytics(ana.data);
      setParticipants(Array.isArray(proj.data) ? proj.data : []);
      setOlympiad(Array.isArray(oly.data) ? oly.data : []);
      setRoboSoccer(robo.data?.data || []);
      setAnnouncements(ann.data?.announcements || []);

      // Fetch users separately (non-critical)
      try {
        const usersRes = await api.get('/api/admin/users');
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch { /* users endpoint may not exist yet */ }

    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/sign-in'); return; }
      setError('Failed to load dashboard data');
    } finally { setLoading(false); }
  }, [logout, navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleExport = async (type) => {
    try {
      const urls = {
        project: '/api/admin/participants/export',
        olympiad: '/api/olympiad/export',
        robo_soccer: '/api/robo-soccer/export',
      };
      const res = await api.get(urls[type], { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.setAttribute('download', `${type}.csv`);
      document.body.appendChild(a); a.click(); a.remove();
    } catch { setError('Export failed'); }
  };

  const handleCreateAnnouncement = async () => {
    if (!annForm.title || !annForm.body) return;
    setAnnLoading(true);
    try {
      await api.post('/api/announcements', annForm);
      setAnnDialog(false);
      setAnnForm({ title: '', body: '', target_audience: 'all', send_email: false });
      fetchAll();
    } catch { setError('Failed to create announcement'); }
    finally { setAnnLoading(false); }
  };

  const handleDeleteAnn = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try { await api.delete(`/api/announcements/${id}`); fetchAll(); }
    catch { setError('Failed to delete announcement'); }
  };

  // ── DataGrid columns ──
  const projectCols = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'leader', headerName: 'Leader', width: 150 },
    { field: 'leaderEmail', headerName: 'Email', width: 190 },
    { field: 'leaderPhone', headerName: 'Phone', width: 120 },
    { field: 'institution', headerName: 'Institution', width: 170 },
    { field: 'competitionCategory', headerName: 'Category', width: 130 },
    { field: 'projectTitle', headerName: 'Project', width: 200 },
    { field: 'member2', headerName: 'Member 2', width: 130 },
    { field: 'member3', headerName: 'Member 3', width: 130 },
    { field: 'paymentID', headerName: 'Payment ID', width: 150 },
    { field: 'createdAt', headerName: 'Date', width: 110, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  ];

  const olympiadCols = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'registration_id', headerName: 'Reg ID', width: 120 },
    { field: 'full_name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 190 },
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'institution', headerName: 'Institution', width: 170 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'status', headerName: 'Status', width: 100, renderCell: (p) => (
      <Chip label={p.value} size="small" color={p.value === 'registered' ? 'success' : 'default'} />
    )},
    { field: 'created_at', headerName: 'Date', width: 110, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  ];

  const roboSoccerCols = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'registration_id', headerName: 'Reg ID', width: 130 },
    { field: 'team_name', headerName: 'Team', width: 150 },
    { field: 'institution', headerName: 'Institution', width: 170 },
    { field: 'leader_name', headerName: 'Leader', width: 140 },
    { field: 'leader_email', headerName: 'Email', width: 190 },
    { field: 'leader_phone', headerName: 'Phone', width: 120 },
    { field: 'category', headerName: 'Category', width: 110 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => (
      <Chip label={p.value} size="small" color={p.value === 'confirmed' ? 'success' : 'warning'} />
    )},
    { field: 'created_at', headerName: 'Date', width: 110, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  ];

  const userCols = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'provider', headerName: 'Provider', width: 100 },
    { field: 'is_verified', headerName: 'Verified', width: 90, renderCell: (p) => (
      <Chip label={p.value ? 'Yes' : 'No'} size="small" color={p.value ? 'success' : 'default'} />
    )},
    { field: 'created_at', headerName: 'Joined', width: 120, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  ];

  // Chart data
  const buildChartData = () => {
    if (!analytics) return [];
    const dateMap = {};
    analytics.charts.projectDaily.forEach(r => {
      const d = r.date?.substring(0, 10);
      if (!dateMap[d]) dateMap[d] = { date: d, Project: 0, Olympiad: 0, 'Robo Soccer': 0 };
      dateMap[d].Project = r.count;
    });
    analytics.charts.olympiadDaily.forEach(r => {
      const d = r.date?.substring(0, 10);
      if (!dateMap[d]) dateMap[d] = { date: d, Project: 0, Olympiad: 0, 'Robo Soccer': 0 };
      dateMap[d].Olympiad = r.count;
    });
    analytics.charts.roboDaily.forEach(r => {
      const d = r.date?.substring(0, 10);
      if (!dateMap[d]) dateMap[d] = { date: d, Project: 0, Olympiad: 0, 'Robo Soccer': 0 };
      dateMap[d]['Robo Soccer'] = r.count;
    });
    return Object.values(dateMap).sort((a, b) => a.date > b.date ? 1 : -1);
  };

  const chartData = buildChartData();
  const pieData = analytics ? [
    { name: 'Project', value: analytics.totals.project },
    { name: 'Olympiad', value: analytics.totals.olympiad },
    { name: 'Robo Soccer', value: analytics.totals.roboSoccer },
  ] : [];

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: '#e94560' },
      '&.Mui-focused fieldset': { borderColor: '#e94560' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' },
  };

  const dataGridSx = {
    border: 'none', color: 'rgba(255,255,255,0.8)',
    '& .MuiDataGrid-columnHeaders': { background: 'rgba(233,69,96,0.15)', color: '#fff', fontWeight: 700 },
    '& .MuiDataGrid-cell': { borderColor: 'rgba(255,255,255,0.06)' },
    '& .MuiDataGrid-row:hover': { background: 'rgba(255,255,255,0.04)' },
    '& .MuiDataGrid-footerContainer': { borderColor: 'rgba(255,255,255,0.08)', color: '#fff' },
    '& .MuiTablePagination-root': { color: 'rgba(255,255,255,0.6)' },
    '& .MuiInputBase-root': { color: '#fff' },
    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiDataGrid-toolbarContainer': { p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' },
    '& .MuiButton-root': { color: 'rgba(255,255,255,0.7)' },
  };

  if (loading && !analytics) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14' }}>
      <CircularProgress sx={{ color: '#e94560' }} size={56} />
    </Box>
  );

  // ── Sidebar content ──
  const SidebarContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <AdminPanelSettings sx={{ color: '#e94560', fontSize: 26 }} />
        <Box>
          <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 15, lineHeight: 1.2 }}>WICE Admin</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Control Panel</Typography>
        </Box>
      </Box>

      {/* Nav items */}
      <List sx={{ px: 1, py: 1.5, flex: 1 }}>
        {NAV_ITEMS.map((item, i) => (
          <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => { setActiveNav(i); if (isMobile) setMobileOpen(false); }}
              sx={{
                borderRadius: 2, py: 1.2,
                background: activeNav === i ? 'rgba(233,69,96,0.15)' : 'transparent',
                border: activeNav === i ? '1px solid rgba(233,69,96,0.3)' : '1px solid transparent',
                '&:hover': { background: 'rgba(255,255,255,0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: activeNav === i ? '#e94560' : 'rgba(255,255,255,0.45)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14, fontWeight: activeNav === i ? 700 : 500,
                  color: activeNav === i ? '#e94560' : 'rgba(255,255,255,0.7)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />

      {/* User info + logout */}
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, background: '#e94560', fontSize: 13, fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Administrator</Typography>
          </Box>
        </Box>
        <Button fullWidth startIcon={<Logout sx={{ fontSize: 15 }} />}
          onClick={() => { logout(); navigate('/sign-in'); }}
          sx={{ color: '#e94560', borderColor: 'rgba(233,69,96,0.3)', textTransform: 'none', fontSize: 13, borderRadius: 2 }}
          variant="outlined" size="small">
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', color: '#fff' }}>

      {/* ── Permanent sidebar (desktop) ── */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: '#0a0a14',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            overflowX: 'hidden',
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* ── Main content ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <Box sx={{
          background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          px: 3, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 99,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'rgba(255,255,255,0.7)', mr: 0.5 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', fontSize: 16 }}>
              {NAV_ITEMS[activeNav]?.label}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh data">
              <IconButton onClick={fetchAll} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            {analytics && (
              <Chip
                label={`${(analytics.totals.project || 0) + (analytics.totals.olympiad || 0) + (analytics.totals.roboSoccer || 0)} total registrations`}
                size="small"
                sx={{ background: 'rgba(233,69,96,0.12)', color: '#e94560', border: '1px solid rgba(233,69,96,0.25)', fontSize: 12 }}
              />
            )}
          </Box>
        </Box>

        {/* Content area */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: 'auto' }}>
          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

          {/* ══ ANALYTICS ══ */}
          {activeNav === 0 && analytics && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  { icon: <Assignment sx={{ color: '#fff' }} />, label: 'Total Project', value: analytics.totals.project, color: '#e94560' },
                  { icon: <EmojiEvents sx={{ color: '#fff' }} />, label: 'Total Olympiad', value: analytics.totals.olympiad, color: '#0f3460' },
                  { icon: <SportsEsports sx={{ color: '#fff' }} />, label: 'Robo Soccer', value: analytics.totals.roboSoccer, color: '#f59e0b' },
                  { icon: <People sx={{ color: '#fff' }} />, label: 'Platform Users', value: analytics.totals.users, color: '#10b981' },
                  { icon: <Notifications sx={{ color: '#fff' }} />, label: 'Announcements', value: analytics.totals.announcements, color: '#8b5cf6' },
                ].map((s, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}><StatCard {...s} /></Grid>
                ))}
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#fff' }}>Registration Flow (Last 14 Days)</Typography>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                        <RTooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }} />
                        <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
                        <Line type="monotone" dataKey="Project" stroke="#e94560" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Olympiad" stroke="#5b8ff9" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Robo Soccer" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#fff' }}>Category Distribution</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                          paddingAngle={4} dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}>
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <RTooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#fff' }}>Project Category Breakdown</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={analytics.charts.categoryBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                        <XAxis dataKey="category" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                        <RTooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }} />
                        <Bar dataKey="count" fill="#e94560" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ══ DATA TABLES (Project / Olympiad / Robo Soccer / Users) ══ */}
          {[1, 2, 3, 5].includes(activeNav) && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
                {activeNav !== 5 && (
                  <Button startIcon={<FileDownload />}
                    onClick={() => handleExport(['project', 'olympiad', 'robo_soccer'][activeNav - 1])}
                    variant="outlined" size="small"
                    sx={{ color: '#e94560', borderColor: '#e94560', textTransform: 'none' }}>
                    Export CSV
                  </Button>
                )}
              </Box>
              <Paper sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', height: '72vh' }}>
                <DataGrid
                  rows={activeNav === 1 ? participants : activeNav === 2 ? olympiad : activeNav === 3 ? roboSoccer : users}
                  columns={activeNav === 1 ? projectCols : activeNav === 2 ? olympiadCols : activeNav === 3 ? roboSoccerCols : userCols}
                  pageSizeOptions={[10, 25, 50]}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                  loading={loading}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 400 } } }}
                  sx={dataGridSx}
                />
              </Paper>
            </Box>
          )}

          {/* ══ ANNOUNCEMENTS ══ */}
          {activeNav === 4 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button startIcon={<Add />} onClick={() => setAnnDialog(true)} variant="contained"
                  sx={{ background: '#e94560', textTransform: 'none', borderRadius: 2, '&:hover': { background: '#cc3350' } }}>
                  New Announcement
                </Button>
              </Box>
              <Grid container spacing={2}>
                {announcements.length === 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 4, textAlign: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Notifications sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 1 }} />
                      <Typography color="rgba(255,255,255,0.4)">No announcements yet</Typography>
                    </Paper>
                  </Grid>
                )}
                {announcements.map((ann) => (
                  <Grid item xs={12} md={6} key={ann.id}>
                    <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', flex: 1, mr: 1 }}>{ann.title}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                          <Chip label={ann.target_audience} size="small" sx={{ background: '#e9456022', color: '#e94560', fontSize: 11 }} />
                          <IconButton size="small" onClick={() => handleDeleteAnn(ann.id)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#e94560' } }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6, mb: 1.5 }}>
                        {ann.body.length > 180 ? ann.body.substring(0, 180) + '…' : ann.body}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="rgba(255,255,255,0.3)">
                          {new Date(ann.created_at).toLocaleDateString()} · by {ann.admin_name}
                        </Typography>
                        {ann.email_sent_at && <Chip label="Email Sent" size="small" color="success" sx={{ height: 18, fontSize: 10 }} />}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Create Announcement Dialog ── */}
      <Dialog open={annDialog} onClose={() => setAnnDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Send sx={{ color: '#e94560' }} /> New Announcement
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField label="Title" fullWidth value={annForm.title}
            onChange={e => setAnnForm({ ...annForm, title: e.target.value })} sx={inputSx} />
          <TextField label="Message" fullWidth multiline rows={5} value={annForm.body}
            onChange={e => setAnnForm({ ...annForm, body: e.target.value })} sx={inputSx} />
          <FormControl fullWidth sx={{ ...inputSx, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
            <InputLabel>Target Audience</InputLabel>
            <Select value={annForm.target_audience} label="Target Audience"
              onChange={e => setAnnForm({ ...annForm, target_audience: e.target.value })}
              MenuProps={{ PaperProps: { sx: { background: '#1a1a2e', color: '#fff' } } }}>
              {['all', 'project', 'olympiad', 'robo_soccer', 'event_registered'].map(v => (
                <MenuItem key={v} value={v}>{v.replace('_', ' ').toUpperCase()}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch checked={annForm.send_email} onChange={e => setAnnForm({ ...annForm, send_email: e.target.checked })}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#e94560' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#e94560' } }} />}
            label={<Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Also send via email to registered users</Typography>}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setAnnDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleCreateAnnouncement} disabled={annLoading || !annForm.title || !annForm.body} variant="contained"
            sx={{ background: '#e94560', textTransform: 'none', borderRadius: 2, px: 3, '&:hover': { background: '#cc3350' } }}>
            {annLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Publish'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
