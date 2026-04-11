import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Paper, Button, IconButton,
  Chip, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, CircularProgress,
  Alert, Tooltip, Avatar, Drawer, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider,
  useMediaQuery, useTheme, LinearProgress,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import {
  Logout, Refresh, FileDownload, Add, Delete, Send,
  People, Assignment, EmojiEvents,
  TrendingUp, AdminPanelSettings, Menu as MenuIcon,
  RecordVoiceOver, Edit as EditIcon, Quiz,
  EmojiPeople, Group, UploadFile, Dashboard,
  ArrowUpward, ArrowDownward,
  Inbox, Campaign, Notifications,
} from '@mui/icons-material';
import OlympiadExamTab from '../../components/admin/OlympiadExamTab';
import api from '../../api/index';
import { useAuth } from '../../context/AuthContext';

/* ─── Design tokens ─── */
const BG      = '#07070f';
const SURFACE = '#0e0e1c';
const CARD    = '#12122a';
const BORDER  = 'rgba(255,255,255,0.07)';
const ACCENT  = '#6c63ff';
const RED     = '#e94560';
const GREEN   = '#10b981';
const AMBER   = '#f59e0b';
const CYAN    = '#06b6d4';
const SIDEBAR_W = 256;



const NAV_ITEMS = [
  { label: 'Dashboard',          icon: <Dashboard />,          section: 'main' },
  { label: 'Project Regs',       icon: <Assignment />,          section: 'data' },
  { label: 'Olympiad Regs',      icon: <EmojiEvents />,         section: 'data' },
  { label: 'Wall Magazine Regs', icon: <Campaign />,            section: 'data' },
  { label: 'Users',              icon: <People />,              section: 'data' },
  { label: 'Announcements',      icon: <Notifications />,       section: 'manage' },
  { label: 'Advisors',           icon: <RecordVoiceOver />,     section: 'manage' },
  { label: 'Olympiad Exam',      icon: <Quiz />,                section: 'manage' },
  { label: 'Campus Ambassadors', icon: <EmojiPeople />,         section: 'network' },
  { label: 'Club Partners',      icon: <Group />,               section: 'network' },
  { label: 'Promo Codes',        icon: <Inbox />,               section: 'manage' },
];

/* ─── Custom tooltip for charts ─── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: '#1a1a35', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, px: 2, py: 1.5, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, mb: 0.5 }}>{label}</Typography>
      {payload.map(p => (
        <Typography key={p.name} sx={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}: {p.value}</Typography>
      ))}
    </Box>
  );
};

/* ─── Stat card ─── */
const StatCard = ({ icon, label, value, color, trend, trendLabel, sub }) => (
  <Paper sx={{
    p: 2.5, borderRadius: 3, position: 'relative', overflow: 'hidden',
    background: CARD, border: `1px solid ${BORDER}`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 20px 40px ${color}25` },
  }}>
    {/* Glow blob */}
    <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${color}30, transparent 70%)`, pointerEvents: 'none' }} />
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box sx={{ width: 46, height: 46, borderRadius: 2, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </Box>
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, px: 1, py: 0.3, borderRadius: 1, background: trend >= 0 ? `${GREEN}15` : `${RED}15` }}>
          {trend >= 0 ? <ArrowUpward sx={{ fontSize: 13, color: GREEN }} /> : <ArrowDownward sx={{ fontSize: 13, color: RED }} />}
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: trend >= 0 ? GREEN : RED }}>{Math.abs(trend)}%</Typography>
        </Box>
      )}
    </Box>
    <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', mt: 2, mb: 0.3, fontSize: '2rem', lineHeight: 1 }}>{value ?? '—'}</Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>{label}</Typography>
    {trendLabel && <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, mt: 0.5 }}>{trendLabel}</Typography>}
    {sub && <Typography sx={{ color: color, fontSize: 11, fontWeight: 600, mt: 0.5 }}>{sub}</Typography>}
  </Paper>
);

/* ─── Section header ─── */
const SectionHeader = ({ icon, title, action }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ width: 4, height: 22, borderRadius: 2, background: `linear-gradient(${RED}, ${ACCENT})` }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.5)' }}>{icon}</Box>
      <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 17 }}>{title}</Typography>
    </Box>
    {action}
  </Box>
);

/* ─── inputSx shared ─── */
const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: BORDER },
    '&:hover fieldset': { borderColor: RED },
    '&.Mui-focused fieldset': { borderColor: RED },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: RED },
};

const dataGridSx = {
  border: 'none',
  background: CARD,
  color: 'rgba(255,255,255,0.8)',

  /* entire grid bg */
  '& .MuiDataGrid-main':            { background: CARD },
  '& .MuiDataGrid-virtualScroller': { background: CARD },

  /* column header row — v8 splits into several sub-elements, override all */
  '& .MuiDataGrid-columnHeaders':                  { background: '#1a0a12 !important', borderBottom: '1px solid rgba(128,0,32,0.5) !important' },
  '& .MuiDataGrid-columnHeadersInner':             { background: '#1a0a12 !important' },
  '& .MuiDataGrid-filler':                         { background: '#1a0a12 !important' },
  '& .MuiDataGrid-scrollbarFiller':                { background: '#1a0a12 !important' },
  '& .MuiDataGrid-columnHeader':                   { background: '#1a0a12 !important', color: '#fff !important' },
  '& .MuiDataGrid-columnHeaderTitle':              { color: '#fff !important', fontWeight: 700, fontSize: 13 },
  '& .MuiDataGrid-sortIcon':                       { color: 'rgba(255,255,255,0.6) !important' },
  '& .MuiDataGrid-menuIconButton':                 { color: 'rgba(255,255,255,0.5) !important' },
  '& .MuiDataGrid-iconButtonContainer .MuiIconButton-root': { color: 'rgba(255,255,255,0.5) !important' },
  '& .MuiDataGrid-columnSeparator':                { color: 'rgba(255,255,255,0.08) !important' },

  /* rows & cells */
  '& .MuiDataGrid-row':               { background: CARD },
  '& .MuiDataGrid-row:hover':         { background: 'rgba(255,255,255,0.04)' },
  '& .MuiDataGrid-cell':              { borderColor: BORDER, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  '& .MuiDataGrid-cell:focus':        { outline: 'none' },
  '& .MuiDataGrid-cell:focus-within': { outline: 'none' },

  /* footer / pagination */
  '& .MuiDataGrid-footerContainer':      { borderColor: BORDER, background: CARD },
  '& .MuiTablePagination-root':          { color: 'rgba(255,255,255,0.6)' },
  '& .MuiTablePagination-selectLabel':   { color: 'rgba(255,255,255,0.5)' },
  '& .MuiTablePagination-displayedRows': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiTablePagination-actions .MuiIconButton-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiDataGrid-selectedRowCount':     { color: 'rgba(255,255,255,0.4)' },

  /* toolbar */
  '& .MuiDataGrid-toolbarContainer': { padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, background: CARD, gap: 1 },
  '& .MuiDataGrid-toolbarContainer .MuiButton-root': { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  '& .MuiDataGrid-toolbarContainer .MuiInputBase-root': { color: '#fff' },

  /* misc */
  '& .MuiDataGrid-overlay': { background: CARD, color: 'rgba(255,255,255,0.3)' },
  '& .MuiSvgIcon-root':     { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputBase-root':   { color: '#fff' },
  '& .MuiCheckbox-root':    { color: 'rgba(255,255,255,0.3)' },
  '& .MuiCheckbox-root.Mui-checked': { color: RED },
};

/* ═══════════════════════════════════════════ MAIN COMPONENT ═══════════════════════════════════════════ */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeNav, setActiveNav]     = useState(0);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [analytics, setAnalytics]     = useState(null);
  const [participants, setParticipants] = useState([]);
  const [olympiad, setOlympiad]       = useState([]);
  const [users, setUsers]             = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const [annDialog, setAnnDialog]     = useState(false);
  const [annForm, setAnnForm]         = useState({ title: '', body: '', image_url: '', target_audience: 'all', send_email: false });
  const [annLoading, setAnnLoading]   = useState(false);

  const [advisors, setAdvisors]             = useState([]);
  const [advisorDialog, setAdvisorDialog]   = useState(false);
  const [advisorForm, setAdvisorForm]       = useState({ name: '', title: '', institution: '', category: 'Academic', image: '' });
  const [editingAdvisor, setEditingAdvisor] = useState(null);

  // Campus Ambassadors
  const [caList, setCaList]           = useState([]);
  const [caStats, setCaStats]         = useState([]);
  const [caDialog, setCaDialog]       = useState(false);
  const [caForm, setCaForm]           = useState({ name: '', institution_name: '', institution_address: '' });
  const [caBulkDialog, setCaBulkDialog] = useState(false);
  const [caBulkResult, setCaBulkResult] = useState(null);
  const [caLoading, setCaLoading]     = useState(false);
  const [caView, setCaView]           = useState('list');

  // Promo Codes
  const [promoList, setPromoList]       = useState([]);
  const [promoDialog, setPromoDialog]   = useState(false);
  const [promoForm, setPromoForm]       = useState({ code: '', discount_percentage: '', competition_type: 'all' });
  const [promoLoading, setPromoLoading] = useState(false);

  // Club Partners
  const [clubList, setClubList]         = useState([]);
  const [clubStats, setClubStats]       = useState([]);
  const [clubDialog, setClubDialog]     = useState(false);
  const [clubForm, setClubForm]         = useState({ club_name: '', institution_name: '', institution_address: '' });
  const [clubBulkDialog, setClubBulkDialog] = useState(false);
  const [clubBulkResult, setClubBulkResult] = useState(null);
  const [clubLoading, setClubLoading]   = useState(false);
  const [clubView, setClubView]         = useState('list');

  /* ── Fetch helpers ── */
  const fetchCA = useCallback(async () => {
    try {
      const [list, stats] = await Promise.all([
        api.get('/api/campus-ambassador'),
        api.get('/api/campus-ambassador/stats'),
      ]);
      setCaList(Array.isArray(list.data) ? list.data : []);
      setCaStats(Array.isArray(stats.data) ? stats.data : []);
    } catch { /* non-critical */ }
  }, []);

  const fetchClub = useCallback(async () => {
    try {
      const [list, stats] = await Promise.all([
        api.get('/api/club-partner'),
        api.get('/api/club-partner/stats'),
      ]);
      setClubList(Array.isArray(list.data) ? list.data : []);
      setClubStats(Array.isArray(stats.data) ? stats.data : []);
    } catch { /* non-critical */ }
  }, []);

  const fetchPromo = useCallback(async () => {
    try {
      const res = await api.get('/api/promo');
      setPromoList(Array.isArray(res.data) ? res.data : []);
    } catch { /* non-critical */ }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ana, proj, oly, ann] = await Promise.all([
        api.get('/api/analytics'),
        api.get('/api/admin/participants'),
        api.get('/api/olympiad/getolympiad'),
        api.get('/api/announcements/admin'),
      ]);
      setAnalytics(ana.data);
      setParticipants(Array.isArray(proj.data) ? proj.data : []);
      setOlympiad(Array.isArray(oly.data) ? oly.data : []);
      setAnnouncements(ann.data?.announcements || []);
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/sign-in'); return; }
      setError('Failed to load dashboard data');
    }
    // Users fetched separately — non-critical
    try {
      const usersRes = await api.get('/api/admin/users');
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch { /* ok */ }
    fetchCA();
    fetchClub();
    fetchPromo();
    setLoading(false);
  }, [logout, navigate, fetchCA, fetchClub, fetchPromo]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Export ── */
  const handleExport = async (type) => {
    try {
      const urls = { project: '/api/admin/participants/export', olympiad: '/api/olympiad/export' };
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
      setAnnForm({ title: '', body: '', image_url: '', target_audience: 'all', send_email: false });
      fetchAll();
    } catch { setError('Failed to create announcement'); }
    finally { setAnnLoading(false); }
  };

  const handleDeleteAnn = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try { await api.delete(`/api/announcements/${id}`); fetchAll(); }
    catch { setError('Failed to delete announcement'); }
  };

  /* ── DataGrid columns ── */
  const statusChip = (v) => {
    const color = v === 'registered' || v === 'confirmed' ? GREEN : v === 'pending' ? AMBER : RED;
    return <Chip label={v || 'registered'} size="small" sx={{ background: `${color}20`, color, fontSize: 11, fontWeight: 700 }} />;
  };
  const gatewayChip = () => <Chip label="PayStation" size="small" sx={{ background: `${CYAN}15`, color: CYAN, fontSize: 11, fontWeight: 700 }} />;

  const projectCols = [
    { field: 'id', headerName: 'ID', width: 55 },
    { field: 'leader', headerName: 'Leader', width: 150 },
    { field: 'leaderEmail', headerName: 'Email', width: 200 },
    { field: 'leaderPhone', headerName: 'Phone', width: 130 },
    { field: 'institution', headerName: 'Institution', width: 180 },
    { field: 'competitionCategory', headerName: 'Category', width: 110, renderCell: p => <Chip label={p.value} size="small" sx={{ background: `${RED}20`, color: RED, fontSize: 11, fontWeight: 700 }} /> },
    { field: 'projectSubcategory', headerName: 'Subcategory', width: 180, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${ACCENT}15`, color: ACCENT, fontSize: 11, fontWeight: 700 }} /> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'categories', headerName: 'Edu Level', width: 130, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${AMBER}15`, color: AMBER, fontSize: 11 }} /> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'projectTitle', headerName: 'Project Title', width: 220 },
    { field: 'member2', headerName: 'Member 2', width: 140, renderCell: p => p.value || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'member3', headerName: 'Member 3', width: 140, renderCell: p => p.value || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'member4', headerName: 'Member 4 (+)', width: 140, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${GREEN}15`, color: GREEN, fontSize: 11 }} /> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'member5', headerName: 'Member 5 (+)', width: 140, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${GREEN}15`, color: GREEN, fontSize: 11 }} /> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'ca_code', headerName: 'CA Code', width: 110, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${ACCENT}20`, color: ACCENT, fontSize: 11 }} /> : '—' },
    { field: 'club_code', headerName: 'Club Code', width: 120, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${CYAN}20`, color: CYAN, fontSize: 11 }} /> : '—' },
    { field: 'paymentID', headerName: 'Invoice No.', width: 170 },
    { field: 'bkashTrxId', headerName: 'Trx ID', width: 140, renderCell: p => p.value || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: '_gateway', headerName: 'Gateway', width: 120, renderCell: () => gatewayChip(), sortable: false },
    { field: '_status', headerName: 'Payment', width: 120, renderCell: () => statusChip('registered'), sortable: false },
    { field: 'created_at', headerName: 'Date', width: 120, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  ];

  const olympiadCols = [
    { field: 'id', headerName: 'ID', width: 55 },
    { field: 'registration_id', headerName: 'Reg ID', width: 140, renderCell: p => <span style={{ color: CYAN, fontWeight: 700, fontSize: 12 }}>{p.value || '—'}</span> },
    { field: 'full_name', headerName: 'Name', width: 160 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'institution', headerName: 'Institution', width: 180 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'ca_code', headerName: 'CA Code', width: 110, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${ACCENT}20`, color: ACCENT, fontSize: 11 }} /> : '—' },
    { field: 'club_code', headerName: 'Club Code', width: 120, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${CYAN}20`, color: CYAN, fontSize: 11 }} /> : '—' },
    { field: '_gateway', headerName: 'Gateway', width: 120, renderCell: () => gatewayChip(), sortable: false },
    { field: 'status', headerName: 'Payment', width: 120, renderCell: p => statusChip(p.value) },
    { field: 'created_at', headerName: 'Date', width: 120, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  ];

  const wallMagazineCols = [
    { field: 'id', headerName: 'ID', width: 55 },
    { field: 'leader', headerName: 'Leader', width: 150 },
    { field: 'leaderEmail', headerName: 'Email', width: 200 },
    { field: 'leaderPhone', headerName: 'Phone', width: 130 },
    { field: 'institution', headerName: 'Institution', width: 180 },
    { field: 'categories', headerName: 'Edu Level', width: 140, renderCell: p => <Chip label={p.value || '—'} size="small" sx={{ background: `${AMBER}20`, color: AMBER, fontSize: 11 }} /> },
    { field: 'projectTitle', headerName: 'Magazine Title', width: 240 },
    { field: 'member2', headerName: 'Member 2', width: 140, renderCell: p => p.value || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'member3', headerName: 'Member 3', width: 140, renderCell: p => p.value || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'member4', headerName: 'Member 4 (+)', width: 140, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${GREEN}15`, color: GREEN, fontSize: 11 }} /> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'member5', headerName: 'Member 5 (+)', width: 140, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${GREEN}15`, color: GREEN, fontSize: 11 }} /> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: 'ca_code', headerName: 'CA Code', width: 110, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${ACCENT}20`, color: ACCENT, fontSize: 11 }} /> : '—' },
    { field: 'club_code', headerName: 'Club Code', width: 120, renderCell: p => p.value ? <Chip label={p.value} size="small" sx={{ background: `${CYAN}20`, color: CYAN, fontSize: 11 }} /> : '—' },
    { field: 'paymentID', headerName: 'Invoice No.', width: 170 },
    { field: 'bkashTrxId', headerName: 'Trx ID', width: 140, renderCell: p => p.value || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> },
    { field: '_gateway', headerName: 'Gateway', width: 120, renderCell: () => gatewayChip(), sortable: false },
    { field: '_status', headerName: 'Payment', width: 120, renderCell: () => statusChip('registered'), sortable: false },
    { field: 'created_at', headerName: 'Date', width: 120, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  ];

  const userCols = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'name', headerName: 'Name', width: 170 },
    { field: 'email', headerName: 'Email', width: 230 },
    { field: 'provider', headerName: 'Provider', width: 110, renderCell: p => <Chip label={p.value} size="small" sx={{ background: `${ACCENT}20`, color: ACCENT, fontSize: 11 }} /> },
    { field: 'is_verified', headerName: 'Verified', width: 100, renderCell: p => <Chip label={p.value ? 'Yes' : 'No'} size="small" color={p.value ? 'success' : 'default'} /> },
    { field: 'created_at', headerName: 'Joined', width: 130, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  ];

  /* ── Derived data ── */
  const projects     = participants.filter(p => p.competitionCategory !== 'Megazine');
  const wallMagazine = participants.filter(p => p.competitionCategory === 'Megazine');

  /* ── Chart data ── */
  const buildChartData = () => {
    if (!analytics?.charts) return [];
    const dateMap = {};
    const ensure = (d) => { if (!dateMap[d]) dateMap[d] = { date: d, Project: 0, Olympiad: 0, Magazine: 0 }; };
    analytics.charts.projectDaily?.forEach(r => { const d = r.date?.substring(0, 10); ensure(d); dateMap[d].Project = r.count; });
    analytics.charts.olympiadDaily?.forEach(r => { const d = r.date?.substring(0, 10); ensure(d); dateMap[d].Olympiad = r.count; });
    analytics.charts.magazineDaily?.forEach(r => { const d = r.date?.substring(0, 10); ensure(d); dateMap[d].Magazine = r.count; });
    return Object.values(dateMap).sort((a, b) => a.date > b.date ? 1 : -1);
  };

  const chartData = buildChartData();
  const total = analytics ? (analytics.totals.project || 0) + (analytics.totals.olympiad || 0) + (analytics.totals.magazine || 0) : 0;
  const pieData = analytics ? [
    { name: 'Project', value: analytics.totals.project || 0, color: RED },
    { name: 'Olympiad', value: analytics.totals.olympiad || 0, color: CYAN },
    { name: 'Magazine', value: analytics.totals.magazine || 0, color: AMBER },
  ] : [];

  /* ── Loading screen ── */
  if (loading && !analytics) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: BG, gap: 3 }}>
      <Box sx={{ position: 'relative', width: 80, height: 80 }}>
        <CircularProgress size={80} thickness={2} sx={{ color: RED, position: 'absolute' }} />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AdminPanelSettings sx={{ color: RED, fontSize: 32 }} />
        </Box>
      </Box>
      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading Admin Panel</Typography>
      <LinearProgress sx={{ width: 200, borderRadius: 2, background: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${RED}, ${ACCENT})` } }} />
    </Box>
  );

  /* ── Sidebar ── */
  const SidebarContent = () => {
    const sections = [
      { key: 'main', label: 'Overview' },
      { key: 'data', label: 'Registrations' },
      { key: 'manage', label: 'Management' },
      { key: 'network', label: 'Network' },
    ];
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Logo */}
        <Box sx={{ px: 3, py: 3, borderBottom: `1px solid ${BORDER}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2, background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${RED}50` }}>
              <AdminPanelSettings sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 14, lineHeight: 1.2 }}>WICE Admin</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Control Panel</Typography>
            </Box>
          </Box>
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 2, px: 1.5, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.08)', borderRadius: 2 } }}>
          {sections.map(sec => {
            const items = NAV_ITEMS.map((item, i) => ({ ...item, index: i })).filter(item => item.section === sec.key);
            if (!items.length) return null;
            return (
              <Box key={sec.key} sx={{ mb: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', px: 1.5, mb: 0.5 }}>{sec.label}</Typography>
                {items.map(item => {
                  const active = activeNav === item.index;
                  return (
                    <ListItem key={item.index} disablePadding sx={{ mb: 0.3 }}>
                      <ListItemButton
                        onClick={() => { setActiveNav(item.index); if (isMobile) setMobileOpen(false); }}
                        sx={{
                          borderRadius: 2, py: 1, px: 1.5, minHeight: 40,
                          background: active ? `linear-gradient(135deg, ${RED}22, ${ACCENT}11)` : 'transparent',
                          border: active ? `1px solid ${RED}30` : '1px solid transparent',
                          '&:hover': { background: active ? `linear-gradient(135deg, ${RED}25, ${ACCENT}15)` : 'rgba(255,255,255,0.04)' },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32, color: active ? RED : 'rgba(255,255,255,0.35)', '& svg': { fontSize: 18 } }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          slotProps={{ primary: { style: { fontSize: 13, fontWeight: active ? 700 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.6)' } } }}
                        />
                        {active && <Box sx={{ width: 3, height: 20, borderRadius: 1.5, background: `linear-gradient(${RED}, ${ACCENT})` }} />}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ borderColor: BORDER }} />
        {/* User */}
        <Box sx={{ px: 2, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.04)' }}>
            <Avatar sx={{ width: 34, height: 34, background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, fontSize: 13, fontWeight: 800 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden', flex: 1 }}>
              <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>Administrator</Typography>
            </Box>
          </Box>
          <Button fullWidth startIcon={<Logout sx={{ fontSize: 15 }} />}
            onClick={() => { logout(); navigate('/sign-in'); }}
            sx={{ color: RED, borderColor: `${RED}40`, textTransform: 'none', fontSize: 12, borderRadius: 2, '&:hover': { borderColor: RED, background: `${RED}10` } }}
            variant="outlined" size="small">Sign Out</Button>
        </Box>
      </Box>
    );
  };

  /* ════════════════════════════ RENDER ════════════════════════════ */
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: BG, color: '#fff' }}>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: SIDEBAR_W, flexShrink: 0,
          '& .MuiDrawer-paper': { width: SIDEBAR_W, boxSizing: 'border-box', background: SURFACE, borderRight: `1px solid ${BORDER}`, overflowX: 'hidden' },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <Box sx={{
          background: `${SURFACE}ee`, backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${BORDER}`,
          px: 3, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 99,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                <MenuIcon />
              </IconButton>
            )}
            <Box>
              <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 16 }}>{NAV_ITEMS[activeNav]?.label}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>WICEBD Admin Panel</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {analytics && (
              <Chip
                icon={<People sx={{ fontSize: 14, color: `${GREEN} !important` }} />}
                label={`${total} registrations`}
                size="small"
                sx={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30`, fontSize: 12, fontWeight: 700 }}
              />
            )}
            <Tooltip title="Refresh">
              <IconButton onClick={fetchAll} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: RED } }}>
                <Refresh sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: 'auto' }}>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

          {/* ══════════════ DASHBOARD ══════════════ */}
          {activeNav === 0 && analytics && (
            <Box>
              {/* Stat cards */}
              <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                {[
                  { icon: <Assignment sx={{ color: RED, fontSize: 22 }} />, label: 'Project Registrations', value: analytics.totals.project, color: RED, trend: 12, trendLabel: 'vs last week' },
                  { icon: <EmojiEvents sx={{ color: CYAN, fontSize: 22 }} />, label: 'Olympiad Registrations', value: analytics.totals.olympiad, color: CYAN, trend: 8, trendLabel: 'vs last week' },
                  { icon: <Campaign sx={{ color: AMBER, fontSize: 22 }} />, label: 'Wall Magazine Regs', value: analytics.totals.magazine, color: AMBER, trendLabel: 'registrations' },
                  { icon: <People sx={{ color: GREEN, fontSize: 22 }} />, label: 'Platform Users', value: analytics.totals.users, color: GREEN, trend: 5, trendLabel: 'vs last week' },
                  { icon: <Notifications sx={{ color: ACCENT, fontSize: 22 }} />, label: 'Announcements', value: analytics.totals.announcements, color: ACCENT, sub: 'Published' },
                ].map((s, i) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 2.4 }} key={i}><StatCard {...s} /></Grid>
                ))}
              </Grid>

              {/* Total progress bar */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 15 }}>Registration Distribution</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Total: {total}</Typography>
                </Box>
                <Grid container spacing={2}>
                  {pieData.map(p => (
                    <Grid size={{ xs: 12, sm: 4 }} key={p.name}>
                      <Box sx={{ mb: 0.8, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{p.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: p.color, fontWeight: 700 }}>{p.value} ({total > 0 ? Math.round(p.value / total * 100) : 0}%)</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={total > 0 ? (p.value / total) * 100 : 0}
                        sx={{ height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { background: p.color, borderRadius: 4 } }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Area chart */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, height: '100%' }}>
                    <SectionHeader icon={<TrendingUp sx={{ fontSize: 18 }} />} title="Registration Trend (Last 14 Days)" />
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={chartData}>
                        <defs>
                          {[{ id: 'proj', color: RED }, { id: 'oly', color: CYAN }, { id: 'mag', color: AMBER }].map(g => (
                            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={g.color} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <RTooltip content={<ChartTip />} />
                        <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                        <Area type="monotone" dataKey="Project" stroke={RED} fill="url(#proj)" strokeWidth={2.5} dot={false} />
                        <Area type="monotone" dataKey="Olympiad" stroke={CYAN} fill="url(#oly)" strokeWidth={2.5} dot={false} />
                        <Area type="monotone" dataKey="Magazine" stroke={AMBER} fill="url(#mag)" strokeWidth={2.5} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Donut pie */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <SectionHeader icon={<Dashboard sx={{ fontSize: 18 }} />} title="Category Split" />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                            {pieData.map((p, i) => <Cell key={i} fill={p.color} opacity={0.9} />)}
                          </Pie>
                          <RTooltip content={<ChartTip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ display: 'flex', gap: 2.5, mt: 1 }}>
                        {pieData.map(p => (
                          <Box key={p.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{p.name}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Category breakdown bar */}
              {analytics.charts?.categoryBreakdown?.length > 0 && (
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}` }}>
                  <SectionHeader icon={<Assignment sx={{ fontSize: 18 }} />} title="Project Category Breakdown" />
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.charts.categoryBreakdown} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="category" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <RTooltip content={<ChartTip />} />
                      <Bar dataKey="count" fill={RED} radius={[6, 6, 0, 0]}>
                        {analytics.charts.categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={[RED, ACCENT, CYAN, AMBER, GREEN][i % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              )}

              {/* Recent activity */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}` }}>
                    <SectionHeader icon={<Assignment sx={{ fontSize: 18 }} />} title="Recent Project Registrations" />
                    {projects.slice(0, 5).map((p, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2, borderBottom: i < 4 ? `1px solid ${BORDER}` : 'none' }}>
                        <Avatar sx={{ width: 34, height: 34, background: `${RED}25`, color: RED, fontSize: 13, fontWeight: 700 }}>{p.leader?.charAt(0)}</Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.leader}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{p.institution}</Typography>
                        </Box>
                        <Chip label={p.competitionCategory} size="small" sx={{ background: `${RED}18`, color: RED, fontSize: 10, height: 20 }} />
                      </Box>
                    ))}
                    {!projects.length && <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', py: 2 }}>No registrations yet</Typography>}
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}` }}>
                    <SectionHeader icon={<EmojiEvents sx={{ fontSize: 18 }} />} title="Recent Olympiad Registrations" />
                    {olympiad.slice(0, 5).map((o, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2, borderBottom: i < 4 ? `1px solid ${BORDER}` : 'none' }}>
                        <Avatar sx={{ width: 34, height: 34, background: `${CYAN}25`, color: CYAN, fontSize: 13, fontWeight: 700 }}>{o.full_name?.charAt(0)}</Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.full_name}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{o.institution}</Typography>
                        </Box>
                        <Chip label={o.status} size="small" color="success" sx={{ fontSize: 10, height: 20 }} />
                      </Box>
                    ))}
                    {!olympiad.length && <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', py: 2 }}>No registrations yet</Typography>}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ══════════════ DATA TABLES ══════════════ */}
          {[1, 2, 3, 4].includes(activeNav) && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5, gap: 1 }}>
                {(activeNav === 1 || activeNav === 2) && (
                  <Button startIcon={<FileDownload />}
                    onClick={() => handleExport(activeNav === 1 ? 'project' : 'olympiad')}
                    variant="outlined" size="small"
                    sx={{ color: RED, borderColor: `${RED}50`, textTransform: 'none', borderRadius: 2, '&:hover': { borderColor: RED, background: `${RED}10` } }}>
                    Export CSV
                  </Button>
                )}
              </Box>
              <Paper sx={{ borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, height: '74vh', overflow: 'hidden' }}>
                <DataGrid
                  rows={activeNav === 1 ? projects : activeNav === 2 ? olympiad : activeNav === 3 ? wallMagazine : users}
                  columns={activeNav === 1 ? projectCols : activeNav === 2 ? olympiadCols : activeNav === 3 ? wallMagazineCols : userCols}
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

          {/* ══════════════ ANNOUNCEMENTS ══════════════ */}
          {activeNav === 5 && (
            <Box>
              <SectionHeader
                icon={<Campaign sx={{ fontSize: 18 }} />}
                title="Announcements"
                action={
                  <Button startIcon={<Add />} onClick={() => setAnnDialog(true)} variant="contained" size="small"
                    sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, boxShadow: `0 4px 14px ${RED}40` }}>
                    New Announcement
                  </Button>
                }
              />
              {announcements.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', background: CARD, borderRadius: 3, border: `1px solid ${BORDER}` }}>
                  <Inbox sx={{ fontSize: 56, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                  <Typography color="rgba(255,255,255,0.35)">No announcements yet</Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {announcements.map(ann => (
                    <Grid size={{ xs: 12, md: 6 }} key={ann.id}>
                      <Paper sx={{ borderRadius: 3, overflow: 'hidden', background: CARD, border: `1px solid ${BORDER}`, transition: 'border-color 0.2s', '&:hover': { borderColor: 'rgba(255,255,255,0.14)' } }}>
                        {ann.image_url && (
                          <Box sx={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                            <img src={ann.image_url} alt={ann.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
                            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                          </Box>
                        )}
                        <Box sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography fontWeight={700} sx={{ color: '#fff', flex: 1, mr: 1, fontSize: 15 }}>{ann.title}</Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Chip label={ann.target_audience} size="small" sx={{ background: `${RED}18`, color: RED, fontSize: 10, height: 20 }} />
                              <IconButton size="small" onClick={() => handleDeleteAnn(ann.id)} sx={{ color: 'rgba(255,255,255,0.25)', '&:hover': { color: RED } }}>
                                <Delete sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6, mb: 1.5 }}>
                            {ann.body?.length > 140 ? ann.body.substring(0, 140) + '…' : ann.body}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="rgba(255,255,255,0.3)">{new Date(ann.created_at).toLocaleDateString()}</Typography>
                            {ann.email_sent_at && <Chip label="Email Sent" size="small" color="success" sx={{ height: 18, fontSize: 10 }} />}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* ══════════════ ADVISORS ══════════════ */}
          {activeNav === 6 && (
            <Box>
              <SectionHeader
                icon={<RecordVoiceOver sx={{ fontSize: 18 }} />}
                title="Advisors & Speakers"
                action={
                  <Button startIcon={<Add />} onClick={() => { setAdvisorForm({ name: '', title: '', institution: '', category: 'Academic', image: '' }); setEditingAdvisor(null); setAdvisorDialog(true); }}
                    variant="contained" size="small"
                    sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, boxShadow: `0 4px 14px ${RED}40` }}>
                    Add Advisor
                  </Button>
                }
              />
              {advisors.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', background: CARD, borderRadius: 3, border: `1px solid ${BORDER}` }}>
                  <RecordVoiceOver sx={{ fontSize: 56, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                  <Typography color="rgba(255,255,255,0.35)">No advisors added yet</Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {advisors.map((adv, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                      <Paper sx={{ p: 2.5, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={adv.image || undefined} sx={{ width: 50, height: 50, background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, fontWeight: 800, fontSize: 20 }}>
                            {adv.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adv.name}</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{adv.title}</Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{adv.institution}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip label={adv.category} size="small" sx={{ background: `${ACCENT}18`, color: ACCENT, fontSize: 11 }} />
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => { setAdvisorForm({ ...adv }); setEditingAdvisor(i); setAdvisorDialog(true); }} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: ACCENT } }}>
                              <EditIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => setAdvisors(prev => prev.filter((_, idx) => idx !== i))} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: RED } }}>
                              <Delete sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* ══════════════ OLYMPIAD EXAM ══════════════ */}
          {activeNav === 7 && <OlympiadExamTab />}

          {/* ══════════════ CAMPUS AMBASSADORS ══════════════ */}
          {activeNav === 8 && (
            <Box>
              <SectionHeader
                icon={<EmojiPeople sx={{ fontSize: 18 }} />}
                title="Campus Ambassadors"
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<UploadFile />} variant="outlined" size="small"
                      onClick={() => { setCaBulkResult(null); setCaBulkDialog(true); }}
                      sx={{ color: RED, borderColor: `${RED}50`, textTransform: 'none', borderRadius: 2 }}>Bulk Upload</Button>
                    <Button startIcon={<Add />} variant="contained" size="small"
                      onClick={() => { setCaForm({ name: '', institution_name: '', institution_address: '' }); setCaDialog(true); }}
                      sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, boxShadow: `0 4px 14px ${RED}40` }}>
                      Add Ambassador
                    </Button>
                  </Box>
                }
              />

              {/* View toggle */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {['list', 'stats'].map(v => (
                  <Button key={v} size="small" variant={caView === v ? 'contained' : 'outlined'}
                    onClick={() => { setCaView(v); if (v === 'stats') fetchCA(); }}
                    sx={{ textTransform: 'none', borderRadius: 2, ...(caView === v ? { background: `linear-gradient(135deg, ${RED}, ${ACCENT})` } : { color: RED, borderColor: `${RED}40` }) }}>
                    {v === 'list' ? 'All Ambassadors' : 'Registration Stats'}
                  </Button>
                ))}
              </Box>

              {caView === 'list' && (caList.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', background: CARD, borderRadius: 3, border: `1px solid ${BORDER}` }}>
                  <EmojiPeople sx={{ fontSize: 56, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                  <Typography color="rgba(255,255,255,0.35)">No campus ambassadors yet</Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {caList.map(ca => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ca.id}>
                      <Paper sx={{ p: 2.5, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, '&:hover': { borderColor: `${RED}40` }, transition: 'border-color 0.2s' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Chip label={ca.code} size="small" sx={{ background: `${RED}18`, color: RED, border: `1px solid ${RED}30`, fontSize: 11, fontWeight: 700, mb: 1 }} />
                            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14 }}>{ca.name}</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, mt: 0.5 }}>{ca.institution_name}</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, mt: 0.3 }}>{ca.institution_address}</Typography>
                          </Box>
                          <IconButton size="small" onClick={async () => { if (!window.confirm(`Delete ${ca.name}?`)) return; await api.delete(`/api/campus-ambassador/${ca.id}`); fetchCA(); }}
                            sx={{ color: 'rgba(255,255,255,0.2)', '&:hover': { color: RED } }}>
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ))}

              {caView === 'stats' && (
                <Paper sx={{ borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: `${RED}12` }}>
                          {['Code', 'Name', 'Institution', 'Project', 'Magazine', 'Olympiad', 'Total'].map(h => (
                            <th key={h} style={{ padding: '13px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {caStats.length === 0 && (
                          <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No data yet</td></tr>
                        )}
                        {caStats.map((row, i) => (
                          <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                            <td style={{ padding: '11px 16px' }}><Chip label={row.code} size="small" sx={{ background: `${RED}18`, color: RED, fontSize: 11, fontWeight: 700 }} /></td>
                            <td style={{ padding: '11px 16px', color: '#fff', fontSize: 13, fontWeight: 600 }}>{row.name}</td>
                            <td style={{ padding: '11px 16px', color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{row.institution_name}</td>
                            <td style={{ padding: '11px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>{row.project_count}</td>
                            <td style={{ padding: '11px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>{row.magazine_count}</td>
                            <td style={{ padding: '11px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>{row.olympiad_count}</td>
                            <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                              <Chip label={row.total} size="small" sx={{ background: row.total > 0 ? `${GREEN}18` : 'rgba(255,255,255,0.05)', color: row.total > 0 ? GREEN : 'rgba(255,255,255,0.3)', fontWeight: 700 }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Paper>
              )}
            </Box>
          )}

          {/* ══════════════ CLUB PARTNERS ══════════════ */}
          {activeNav === 9 && (
            <Box>
              <SectionHeader
                icon={<Group sx={{ fontSize: 18 }} />}
                title="Club Partners"
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<UploadFile />} variant="outlined" size="small"
                      onClick={() => { setClubBulkResult(null); setClubBulkDialog(true); }}
                      sx={{ color: CYAN, borderColor: `${CYAN}50`, textTransform: 'none', borderRadius: 2 }}>Bulk Upload</Button>
                    <Button startIcon={<Add />} variant="contained" size="small"
                      onClick={() => { setClubForm({ club_name: '', institution_name: '', institution_address: '' }); setClubDialog(true); }}
                      sx={{ background: `linear-gradient(135deg, ${CYAN}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, boxShadow: `0 4px 14px ${CYAN}40` }}>
                      Add Club Partner
                    </Button>
                  </Box>
                }
              />

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {['list', 'stats'].map(v => (
                  <Button key={v} size="small" variant={clubView === v ? 'contained' : 'outlined'}
                    onClick={() => { setClubView(v); if (v === 'stats') fetchClub(); }}
                    sx={{ textTransform: 'none', borderRadius: 2, ...(clubView === v ? { background: `linear-gradient(135deg, ${CYAN}, ${ACCENT})` } : { color: CYAN, borderColor: `${CYAN}40` }) }}>
                    {v === 'list' ? 'All Clubs' : 'Registration Stats'}
                  </Button>
                ))}
              </Box>

              {clubView === 'list' && (clubList.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', background: CARD, borderRadius: 3, border: `1px solid ${BORDER}` }}>
                  <Group sx={{ fontSize: 56, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                  <Typography color="rgba(255,255,255,0.35)">No club partners yet</Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {clubList.map(club => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={club.id}>
                      <Paper sx={{ p: 2.5, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, '&:hover': { borderColor: `${CYAN}40` }, transition: 'border-color 0.2s' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Chip label={club.code} size="small" sx={{ background: `${CYAN}18`, color: CYAN, border: `1px solid ${CYAN}30`, fontSize: 11, fontWeight: 700, mb: 1 }} />
                            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14 }}>{club.club_name}</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, mt: 0.5 }}>{club.institution_name}</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, mt: 0.3 }}>{club.institution_address}</Typography>
                          </Box>
                          <IconButton size="small" onClick={async () => { if (!window.confirm(`Delete ${club.club_name}?`)) return; await api.delete(`/api/club-partner/${club.id}`); fetchClub(); }}
                            sx={{ color: 'rgba(255,255,255,0.2)', '&:hover': { color: RED } }}>
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ))}

              {clubView === 'stats' && (
                <Paper sx={{ borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: `${CYAN}10` }}>
                          {['Code', 'Club Name', 'Institution', 'Project', 'Magazine', 'Olympiad', 'Total'].map(h => (
                            <th key={h} style={{ padding: '13px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {clubStats.length === 0 && (
                          <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No data yet</td></tr>
                        )}
                        {clubStats.map((row, i) => (
                          <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                            <td style={{ padding: '11px 16px' }}><Chip label={row.code} size="small" sx={{ background: `${CYAN}18`, color: CYAN, fontSize: 11, fontWeight: 700 }} /></td>
                            <td style={{ padding: '11px 16px', color: '#fff', fontSize: 13, fontWeight: 600 }}>{row.club_name}</td>
                            <td style={{ padding: '11px 16px', color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{row.institution_name}</td>
                            <td style={{ padding: '11px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>{row.project_count}</td>
                            <td style={{ padding: '11px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>{row.magazine_count}</td>
                            <td style={{ padding: '11px 16px', color: '#fff', fontSize: 13, textAlign: 'center' }}>{row.olympiad_count}</td>
                            <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                              <Chip label={row.total} size="small" sx={{ background: row.total > 0 ? `${GREEN}18` : 'rgba(255,255,255,0.05)', color: row.total > 0 ? GREEN : 'rgba(255,255,255,0.3)', fontWeight: 700 }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Paper>
              )}
            </Box>
          )}
          {/* ══════════════ PROMO CODES ══════════════ */}
          {activeNav === 10 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>Promo Codes</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, mt: 0.5 }}>
                    Create discount codes per competition type. Codes auto-apply on user entry.
                  </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => { setPromoForm({ code: '', discount_percentage: '', competition_type: 'all' }); setPromoDialog(true); }}
                  sx={{ background: `linear-gradient(135deg,${RED},${ACCENT})`, textTransform: 'none', borderRadius: 2, fontWeight: 700 }}>
                  New Promo Code
                </Button>
              </Box>

              <Paper sx={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)' }}>
                        {['Code', 'Discount', 'Competition', 'Status', 'Created', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '13px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {promoList.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No promo codes yet. Create one above.</td></tr>
                      )}
                      {promoList.map((row, i) => (
                        <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                          <td style={{ padding: '11px 16px' }}>
                            <Chip label={row.code} size="small" sx={{ background: `${ACCENT}18`, color: ACCENT, fontWeight: 800, fontSize: 12, letterSpacing: '0.06em' }} />
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <Typography sx={{ color: GREEN, fontWeight: 800, fontSize: 16 }}>{row.discount_percentage}%</Typography>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <Chip label={row.competition_type} size="small" sx={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <Switch checked={!!row.is_active} size="small"
                              onChange={async () => { await api.patch(`/api/promo/${row.id}/toggle`); fetchPromo(); }}
                              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: GREEN }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: GREEN } }}
                            />
                          </td>
                          <td style={{ padding: '11px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                            {new Date(row.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <IconButton size="small" onClick={async () => { if (window.confirm(`Delete code ${row.code}?`)) { await api.delete(`/api/promo/${row.id}`); fetchPromo(); } }}
                              sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: RED } }}>
                              <Delete sx={{ fontSize: 16 }} />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

      {/* ══════════════ DIALOGS ══════════════ */}

      {/* Promo Code */}
      <Dialog open={promoDialog} onClose={() => setPromoDialog(false)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>New Promo Code</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField label="Code *" placeholder="e.g. WICE25" fullWidth value={promoForm.code}
            onChange={e => setPromoForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} sx={inputSx}
            helperText="Uppercase letters and numbers only" />
          <TextField label="Discount %" type="number" fullWidth value={promoForm.discount_percentage}
            onChange={e => setPromoForm(p => ({ ...p, discount_percentage: e.target.value }))} sx={inputSx}
            slotProps={{ htmlInput: { min: 1, max: 100 } }} helperText="Enter a value from 1 to 100" />
          <FormControl fullWidth sx={{ ...inputSx, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
            <InputLabel>Competition Type</InputLabel>
            <Select value={promoForm.competition_type} label="Competition Type"
              onChange={e => setPromoForm(p => ({ ...p, competition_type: e.target.value }))}
              slotProps={{ paper: { sx: { background: SURFACE, color: '#fff' } } }}>
              <MenuItem value="all">All Competitions</MenuItem>
              <MenuItem value="project">Project Only</MenuItem>
              <MenuItem value="wall-magazine">Wall Magazine Only</MenuItem>
              <MenuItem value="olympiad">Olympiad Only</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setPromoDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button
            disabled={promoLoading || !promoForm.code.trim() || !promoForm.discount_percentage}
            onClick={async () => {
              setPromoLoading(true);
              try {
                await api.post('/api/promo', {
                  code: promoForm.code.trim(),
                  discount_percentage: parseInt(promoForm.discount_percentage, 10),
                  competition_type: promoForm.competition_type,
                });
                setPromoDialog(false);
                fetchPromo();
              } catch (err) {
                alert(err.response?.data?.error || 'Failed to create promo code');
              } finally {
                setPromoLoading(false);
              }
            }}
            variant="contained"
            sx={{ background: `linear-gradient(135deg,${RED},${ACCENT})`, textTransform: 'none', borderRadius: 2, px: 3 }}>
            {promoLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Create Code'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Advisor */}
      <Dialog open={advisorDialog} onClose={() => setAdvisorDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><RecordVoiceOver sx={{ color: RED }} />{editingAdvisor !== null ? 'Edit Advisor' : 'Add Advisor'}</Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {[['Full Name', 'name'], ['Title / Designation', 'title'], ['Institution', 'institution'], ['Photo URL (optional)', 'image']].map(([label, key]) => (
            <TextField key={key} label={label} fullWidth value={advisorForm[key]} onChange={e => setAdvisorForm({ ...advisorForm, [key]: e.target.value })} sx={inputSx} />
          ))}
          <FormControl fullWidth sx={{ ...inputSx, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
            <InputLabel>Category</InputLabel>
            <Select value={advisorForm.category} label="Category" onChange={e => setAdvisorForm({ ...advisorForm, category: e.target.value })}
              slotProps={{ paper: { sx: { background: SURFACE, color: '#fff' } } }}>
              {['Academic', 'Industry', 'Government', 'International', 'Technical'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setAdvisorDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button disabled={!advisorForm.name || !advisorForm.title}
            onClick={() => {
              if (editingAdvisor !== null) setAdvisors(prev => prev.map((a, i) => i === editingAdvisor ? { ...advisorForm } : a));
              else setAdvisors(prev => [...prev, { ...advisorForm }]);
              setAdvisorDialog(false);
            }}
            variant="contained" sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, px: 3 }}>
            {editingAdvisor !== null ? 'Save Changes' : 'Add Advisor'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Announcement */}
      <Dialog open={annDialog} onClose={() => setAnnDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Send sx={{ color: RED }} />New Announcement</Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField label="Title *" fullWidth value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} sx={inputSx} />
          <TextField label="Message *" fullWidth multiline rows={5} value={annForm.body} onChange={e => setAnnForm({ ...annForm, body: e.target.value })} sx={inputSx} />
          <TextField label="Poster / Image URL (optional)" fullWidth value={annForm.image_url} onChange={e => setAnnForm({ ...annForm, image_url: e.target.value })} placeholder="https://…" sx={inputSx} />
          {annForm.image_url && (
            <Box sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${BORDER}`, maxHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
              <img src={annForm.image_url} alt="preview" style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
            </Box>
          )}
          <FormControl fullWidth sx={{ ...inputSx, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
            <InputLabel>Target Audience</InputLabel>
            <Select value={annForm.target_audience} label="Target Audience" onChange={e => setAnnForm({ ...annForm, target_audience: e.target.value })}
              slotProps={{ paper: { sx: { background: SURFACE, color: '#fff' } } }}>
              {['all', 'project', 'olympiad', 'robo_soccer', 'event_registered'].map(v => <MenuItem key={v} value={v}>{v.replace('_', ' ').toUpperCase()}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch checked={annForm.send_email} onChange={e => setAnnForm({ ...annForm, send_email: e.target.checked })} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: RED }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: RED } }} />}
            label={<Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Send via email to registered users</Typography>}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setAnnDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleCreateAnnouncement} disabled={annLoading || !annForm.title || !annForm.body} variant="contained"
            sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, px: 3 }}>
            {annLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Publish'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Campus Ambassador */}
      <Dialog open={caDialog} onClose={() => setCaDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EmojiPeople sx={{ color: RED }} />Add Campus Ambassador</Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField label="Full Name *" fullWidth value={caForm.name} onChange={e => setCaForm({ ...caForm, name: e.target.value })} sx={inputSx}
            helperText="Code generated as CA-FirstName-001" slotProps={{ formHelperText: { sx: { color: 'rgba(255,255,255,0.25)' } } }} />
          <TextField label="Institution Name *" fullWidth value={caForm.institution_name} onChange={e => setCaForm({ ...caForm, institution_name: e.target.value })} sx={inputSx} />
          <TextField label="Institution Address *" fullWidth value={caForm.institution_address} onChange={e => setCaForm({ ...caForm, institution_address: e.target.value })} sx={inputSx} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setCaDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button disabled={caLoading || !caForm.name || !caForm.institution_name || !caForm.institution_address}
            onClick={async () => {
              setCaLoading(true);
              try { const r = await api.post('/api/campus-ambassador', caForm); setCaDialog(false); alert(`Added! Code: ${r.data.code}`); fetchCA(); }
              catch (e) { alert('Failed: ' + (e.response?.data?.error || e.message)); }
              finally { setCaLoading(false); }
            }}
            variant="contained" sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, px: 3 }}>
            {caLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Add Ambassador'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Campus Ambassador */}
      <Dialog open={caBulkDialog} onClose={() => setCaBulkDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><UploadFile sx={{ color: RED }} />Bulk Upload — Campus Ambassadors</Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mb: 0.5 }}>CSV format (header required):</Typography>
            <Typography sx={{ color: CYAN, fontSize: 12, fontFamily: 'monospace' }}>name, institution_name, institution_address</Typography>
          </Box>
          <input type="file" accept=".csv" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}
            onChange={async e => {
              const file = e.target.files[0]; if (!file) return;
              const text = await file.text();
              const lines = text.trim().split('\n');
              const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
              const entries = lines.slice(1).map(line => {
                const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
              }).filter(e => e.name);
              setCaLoading(true);
              try { const r = await api.post('/api/campus-ambassador/bulk', { entries }); setCaBulkResult(r.data); fetchCA(); }
              catch (err) { setCaBulkResult({ error: err.response?.data?.error || 'Upload failed' }); }
              finally { setCaLoading(false); }
            }}
          />
          {caLoading && <CircularProgress size={24} sx={{ color: RED, alignSelf: 'center' }} />}
          {caBulkResult && (
            <Box sx={{ p: 2, borderRadius: 2, background: caBulkResult.error ? `${RED}10` : `${GREEN}10`, border: `1px solid ${caBulkResult.error ? RED : GREEN}30` }}>
              {caBulkResult.error
                ? <Typography sx={{ color: RED, fontSize: 13 }}>{caBulkResult.error}</Typography>
                : <>
                    <Typography sx={{ color: GREEN, fontWeight: 700, fontSize: 14 }}>✓ Inserted {caBulkResult.inserted} ambassadors</Typography>
                    {caBulkResult.codes?.map(c => <Typography key={c.code} sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{c.name} → {c.code}</Typography>)}
                    {caBulkResult.errors?.length > 0 && <Typography sx={{ color: AMBER, fontSize: 12, mt: 1 }}>{caBulkResult.errors.length} row(s) skipped</Typography>}
                  </>
              }
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCaBulkDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Club Partner */}
      <Dialog open={clubDialog} onClose={() => setClubDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Group sx={{ color: CYAN }} />Add Club Partner</Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField label="Club Name *" fullWidth value={clubForm.club_name} onChange={e => setClubForm({ ...clubForm, club_name: e.target.value })} sx={inputSx}
            helperText="Code generated as CL-ClubName-001" slotProps={{ formHelperText: { sx: { color: 'rgba(255,255,255,0.25)' } } }} />
          <TextField label="Institution Name *" fullWidth value={clubForm.institution_name} onChange={e => setClubForm({ ...clubForm, institution_name: e.target.value })} sx={inputSx} />
          <TextField label="Institution Address *" fullWidth value={clubForm.institution_address} onChange={e => setClubForm({ ...clubForm, institution_address: e.target.value })} sx={inputSx} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setClubDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button disabled={clubLoading || !clubForm.club_name || !clubForm.institution_name || !clubForm.institution_address}
            onClick={async () => {
              setClubLoading(true);
              try { const r = await api.post('/api/club-partner', clubForm); setClubDialog(false); alert(`Added! Code: ${r.data.code}`); fetchClub(); }
              catch (e) { alert('Failed: ' + (e.response?.data?.error || e.message)); }
              finally { setClubLoading(false); }
            }}
            variant="contained" sx={{ background: `linear-gradient(135deg, ${CYAN}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, px: 3 }}>
            {clubLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Add Club Partner'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Club Partners */}
      <Dialog open={clubBulkDialog} onClose={() => setClubBulkDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><UploadFile sx={{ color: CYAN }} />Bulk Upload — Club Partners</Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mb: 0.5 }}>CSV format (header required):</Typography>
            <Typography sx={{ color: CYAN, fontSize: 12, fontFamily: 'monospace' }}>club_name, institution_name, institution_address</Typography>
          </Box>
          <input type="file" accept=".csv" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}
            onChange={async e => {
              const file = e.target.files[0]; if (!file) return;
              const text = await file.text();
              const lines = text.trim().split('\n');
              const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
              const entries = lines.slice(1).map(line => {
                const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
              }).filter(e => e.club_name);
              setClubLoading(true);
              try { const r = await api.post('/api/club-partner/bulk', { entries }); setClubBulkResult(r.data); fetchClub(); }
              catch (err) { setClubBulkResult({ error: err.response?.data?.error || 'Upload failed' }); }
              finally { setClubLoading(false); }
            }}
          />
          {clubLoading && <CircularProgress size={24} sx={{ color: CYAN, alignSelf: 'center' }} />}
          {clubBulkResult && (
            <Box sx={{ p: 2, borderRadius: 2, background: clubBulkResult.error ? `${RED}10` : `${GREEN}10`, border: `1px solid ${clubBulkResult.error ? RED : GREEN}30` }}>
              {clubBulkResult.error
                ? <Typography sx={{ color: RED, fontSize: 13 }}>{clubBulkResult.error}</Typography>
                : <>
                    <Typography sx={{ color: GREEN, fontWeight: 700, fontSize: 14 }}>✓ Inserted {clubBulkResult.inserted} club partners</Typography>
                    {clubBulkResult.codes?.map(c => <Typography key={c.code} sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{c.club_name} → {c.code}</Typography>)}
                    {clubBulkResult.errors?.length > 0 && <Typography sx={{ color: AMBER, fontSize: 12, mt: 1 }}>{clubBulkResult.errors.length} row(s) skipped</Typography>}
                  </>
              }
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setClubBulkDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
