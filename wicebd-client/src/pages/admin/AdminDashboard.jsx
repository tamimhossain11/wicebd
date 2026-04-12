import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Paper, Button, IconButton,
  Chip, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, CircularProgress,
  Alert, Tooltip, Avatar, Drawer, ListItem, InputAdornment,
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
  QrCodeScanner, ManageAccounts, LockReset, Visibility, VisibilityOff,
} from '@mui/icons-material';
import OlympiadExamTab from '../../components/admin/OlympiadExamTab';
import QRScannerPanel from '../../components/admin/QRScannerPanel';
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



// indices: 0=Dashboard,1=ProjectRegs,2=OlympiadRegs,3=WallMagRegs,4=Users,
//          5=Announcements,6=Advisors,7=OlympiadExam,8=CampusAmbassadors,
//          9=ClubPartners,10=PromoCodes,11=QRScanner,12=AdminUsers
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
  { label: 'QR Scanner',         icon: <QrCodeScanner />,       section: 'event',  superOnly: false },
  { label: 'Admin Users',        icon: <ManageAccounts />,      section: 'event',  superOnly: true },
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
  const [annImgUploading, setAnnImgUploading] = useState(false);

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

  // Admin role from token
  const adminRole = (() => { try { const d = JSON.parse(atob(localStorage.getItem('adminToken')?.split('.')[1] || '')); return d?.adminRole || 'super_admin'; } catch { return 'super_admin'; } })();

  // (QR Scanner state lives inside QRScannerPanel component)

  // Admin Users
  const [adminUsers, setAdminUsers]     = useState([]);
  const [adminUserDialog, setAdminUserDialog] = useState(false);
  const [adminUserForm, setAdminUserForm] = useState({ username: '', email: '', password: '', role: 'data_extractor' });
  const [adminUserLoading, setAdminUserLoading] = useState(false);
  const [showAdminPwd, setShowAdminPwd]         = useState(false);

  // Reset password dialog
  const [resetPwdDialog, setResetPwdDialog] = useState({ open: false, type: '', id: null, name: '' });
  const [resetPwdValue, setResetPwdValue]   = useState('');
  const [resetPwdLoading, setResetPwdLoading] = useState(false);
  const [showResetPwd, setShowResetPwd]       = useState(false);

  // Advisor image uploading
  const [advisorImgUploading, setAdvisorImgUploading] = useState(false);

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

  const fetchAdminUsers = useCallback(async () => {
    try {
      const res = await api.get('/api/admin-manage/admins');
      setAdminUsers(res.data?.admins || []);
    } catch { /* non-critical — only super_admin can reach this */ }
  }, []);

  const fetchAdvisors = useCallback(async () => {
    try {
      const res = await api.get('/api/advisors/admin');
      setAdvisors(res.data?.advisors || []);
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
    fetchAdvisors();
    fetchAdminUsers();
    setLoading(false);
  }, [logout, navigate, fetchCA, fetchClub, fetchPromo, fetchAdvisors, fetchAdminUsers]);

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

  const handleAnnImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnnImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data?.url) setAnnForm(prev => ({ ...prev, image_url: res.data.url }));
    } catch { setError('Image upload failed'); }
    finally { setAnnImgUploading(false); }
  };

  const handleAnnImageRemove = async () => {
    if (annForm.image_url) {
      try { await api.delete('/api/upload/image', { data: { url: annForm.image_url } }); } catch { /* non-critical */ }
    }
    setAnnForm(prev => ({ ...prev, image_url: '' }));
  };

  const handleDeleteAnn = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try { await api.delete(`/api/announcements/${id}`); fetchAll(); }
    catch { setError('Failed to delete announcement'); }
  };

  const openResetPwd = (type, id, name) => {
    setResetPwdValue('');
    setResetPwdDialog({ open: true, type, id, name });
  };

  const handleResetPassword = async () => {
    if (resetPwdValue.length < 6) return;
    setResetPwdLoading(true);
    try {
      const endpoint = resetPwdDialog.type === 'admin'
        ? `/api/admin-manage/admins/${resetPwdDialog.id}/reset-password`
        : `/api/admin-manage/users/${resetPwdDialog.id}/reset-password`;
      await api.patch(endpoint, { password: resetPwdValue });
      setResetPwdDialog({ open: false, type: '', id: null, name: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setResetPwdLoading(false);
    }
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
    { field: 'is_verified', headerName: 'Verified', width: 90, renderCell: p => <Chip label={p.value ? 'Yes' : 'No'} size="small" color={p.value ? 'success' : 'default'} /> },
    {
      field: 'is_active', headerName: 'Access', width: 110,
      renderCell: p => (
        <Switch size="small" checked={p.value !== 0}
          onChange={async () => {
            await api.patch(`/api/admin-manage/users/${p.row.id}/toggle`);
            const usersRes = await api.get('/api/admin/users');
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
          }}
          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: GREEN }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: GREEN } }}
        />
      ),
    },
    { field: 'created_at', headerName: 'Joined', width: 130, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
    {
      field: 'actions', headerName: '', width: 60, sortable: false,
      renderCell: p => (
        <Tooltip title="Reset Password">
          <IconButton size="small" onClick={() => openResetPwd('user', p.row.id, p.row.name)}
            sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: CYAN } }}>
            <LockReset sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ),
    },
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
      { key: 'main',    label: 'Overview' },
      { key: 'data',    label: 'Registrations' },
      { key: 'manage',  label: 'Management' },
      { key: 'network', label: 'Network' },
      { key: 'event',   label: 'Event Day' },
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
            const items = NAV_ITEMS.map((item, i) => ({ ...item, index: i }))
              .filter(item => item.section === sec.key)
              .filter(item => !item.superOnly || adminRole === 'super_admin');
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
            {isMobile && (
              <Tooltip title="Sign Out">
                <IconButton onClick={() => { logout(); navigate('/sign-in'); }}
                  sx={{ color: RED, '&:hover': { background: `${RED}18` } }}>
                  <Logout sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            )}
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
                  <Button startIcon={<Add />} onClick={() => { setAdvisorForm({ name: '', title: '', institution: '', category: 'Academic', image_url: '' }); setEditingAdvisor(null); setAdvisorDialog(true); }}
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
                  {advisors.map((adv) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={adv.id}>
                      <Paper sx={{ p: 2.5, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 1.5, transition: 'border-color 0.2s', '&:hover': { borderColor: `${ACCENT}40` } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={adv.image_url || undefined} sx={{ width: 54, height: 54, background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, fontWeight: 800, fontSize: 20 }}>
                            {adv.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adv.name}</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{adv.title}</Typography>
                          </Box>
                        </Box>
                        {adv.institution && <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{adv.institution}</Typography>}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip label={adv.category} size="small" sx={{ background: `${ACCENT}18`, color: ACCENT, fontSize: 11 }} />
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => { setAdvisorForm({ name: adv.name, title: adv.title, institution: adv.institution || '', category: adv.category, image_url: adv.image_url || '' }); setEditingAdvisor(adv.id); setAdvisorDialog(true); }} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: ACCENT } }}>
                              <EditIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                            <IconButton size="small" onClick={async () => { if (!window.confirm(`Delete ${adv.name}?`)) return; try { await api.delete(`/api/advisors/${adv.id}`); fetchAdvisors(); } catch { setError('Delete failed'); } }} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: RED } }}>
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

          {/* ══════════════ QR SCANNER ══════════════ */}
          {activeNav === 11 && <QRScannerPanel />}

          {/* ══════════════ ADMIN USERS ══════════════ */}
          {activeNav === 12 && adminRole === 'super_admin' && (
            <Box>
              <SectionHeader
                icon={<ManageAccounts sx={{ fontSize: 18 }} />}
                title="Admin User Management"
                action={
                  <Button startIcon={<Add />} onClick={() => { setAdminUserForm({ username: '', email: '', password: '', role: 'data_extractor' }); setAdminUserDialog(true); }}
                    variant="contained" size="small"
                    sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, boxShadow: `0 4px 14px ${RED}40` }}>
                    Add Admin
                  </Button>
                }
              />
              <Grid container spacing={2}>
                {adminUsers.map(a => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={a.id}>
                    <Paper sx={{ p: 2.5, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 44, height: 44, background: a.role === 'super_admin' ? `linear-gradient(135deg,${RED},${ACCENT})` : a.role === 'data_extractor' ? `linear-gradient(135deg,${CYAN},${ACCENT})` : `linear-gradient(135deg,${GREEN},${ACCENT})`, fontWeight: 800, fontSize: 18 }}>
                          {a.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14 }}>{a.username}</Typography>
                          {a.email && <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{a.email}</Typography>}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={a.role.replace(/_/g, ' ')} size="small" sx={{
                          background: a.role === 'super_admin' ? `${RED}20` : a.role === 'data_extractor' ? `${CYAN}20` : `${GREEN}20`,
                          color: a.role === 'super_admin' ? RED : a.role === 'data_extractor' ? CYAN : GREEN,
                          fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
                        }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{a.is_active ? 'Active' : 'Disabled'}</Typography>
                          <Switch size="small" checked={!!a.is_active}
                            onChange={async () => { await api.patch(`/api/admin-manage/admins/${a.id}/toggle`); fetchAdminUsers(); }}
                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: GREEN }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: GREEN } }}
                          />
                          <Tooltip title="Reset Password">
                            <IconButton size="small" onClick={() => openResetPwd('admin', a.id, a.username)}
                              sx={{ color: 'rgba(255,255,255,0.25)', '&:hover': { color: CYAN } }}>
                              <LockReset sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                          {a.role !== 'super_admin' && (
                            <IconButton size="small" onClick={async () => { if (!window.confirm(`Delete admin "${a.username}"?`)) return; await api.delete(`/api/admin-manage/admins/${a.id}`); fetchAdminUsers(); }}
                              sx={{ color: 'rgba(255,255,255,0.25)', '&:hover': { color: RED } }}>
                              <Delete sx={{ fontSize: 15 }} />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Add Admin Dialog */}
              <Dialog open={adminUserDialog} onClose={() => { setAdminUserDialog(false); setShowAdminPwd(false); }} maxWidth="xs" fullWidth
                slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
                <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ManageAccounts sx={{ color: RED }} />New Admin Account</Box>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
                  <TextField label="Username *" fullWidth value={adminUserForm.username} onChange={e => setAdminUserForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g,'') }))} sx={inputSx} />
                  <TextField label="Email (optional)" fullWidth value={adminUserForm.email} onChange={e => setAdminUserForm(p => ({ ...p, email: e.target.value }))} sx={inputSx} />
                  <TextField label="Password *" type={showAdminPwd ? 'text' : 'password'} fullWidth value={adminUserForm.password}
                    onChange={e => setAdminUserForm(p => ({ ...p, password: e.target.value }))}
                    slotProps={{ input: { endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowAdminPwd(v => !v)} sx={{ color: 'rgba(255,255,255,0.45)' }}>
                          {showAdminPwd ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ) } }}
                    sx={inputSx} />
                  <FormControl fullWidth sx={{ ...inputSx, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
                    <InputLabel>Role</InputLabel>
                    <Select value={adminUserForm.role} label="Role" onChange={e => setAdminUserForm(p => ({ ...p, role: e.target.value }))}
                      slotProps={{ paper: { sx: { background: SURFACE, color: '#fff' } } }}>
                      <MenuItem value="data_extractor">
                        <Box><Typography sx={{ fontSize: 13, fontWeight: 600 }}>Data Extractor</Typography><Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Registrations section only</Typography></Box>
                      </MenuItem>
                      <MenuItem value="ca_cl_manager">
                        <Box><Typography sx={{ fontSize: 13, fontWeight: 600 }}>CA / CL Manager</Typography><Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Network section only</Typography></Box>
                      </MenuItem>
                      <MenuItem value="super_admin">
                        <Box><Typography sx={{ fontSize: 13, fontWeight: 600, color: RED }}>Super Admin</Typography><Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Full access</Typography></Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                  <Button onClick={() => setAdminUserDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
                  <Button disabled={adminUserLoading || !adminUserForm.username || !adminUserForm.password}
                    onClick={async () => {
                      setAdminUserLoading(true);
                      try {
                        await api.post('/api/admin-manage/admins', adminUserForm);
                        setAdminUserDialog(false);
                        fetchAdminUsers();
                      } catch (err) { setError(err.response?.data?.message || 'Failed to create admin'); }
                      finally { setAdminUserLoading(false); }
                    }}
                    variant="contained" sx={{ background: `linear-gradient(135deg,${RED},${ACCENT})`, textTransform: 'none', borderRadius: 2, px: 3 }}>
                    {adminUserLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Create Admin'}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}

      {/* ══ Reset Password Dialog (shared for admin + portal users) ══ */}
      <Dialog open={resetPwdDialog.open} onClose={() => { setResetPwdDialog({ open: false, type: '', id: null, name: '' }); setShowResetPwd(false); }} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockReset sx={{ color: CYAN }} />
            Reset Password — {resetPwdDialog.name}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, mb: 2 }}>
            Enter a new password for this {resetPwdDialog.type === 'admin' ? 'admin account' : 'user account'}. Minimum 6 characters.
          </Typography>
          <TextField
            label="New Password" type={showResetPwd ? 'text' : 'password'} fullWidth
            value={resetPwdValue} onChange={e => setResetPwdValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleResetPassword(); }}
            slotProps={{ input: { endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowResetPwd(v => !v)} sx={{ color: 'rgba(255,255,255,0.45)' }}>
                  {showResetPwd ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </IconButton>
              </InputAdornment>
            ) } }}
            sx={inputSx}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setResetPwdDialog({ open: false, type: '', id: null, name: '' })} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleResetPassword} disabled={resetPwdLoading || resetPwdValue.length < 6} variant="contained"
            sx={{ background: `linear-gradient(135deg,${CYAN},#0284c7)`, textTransform: 'none', borderRadius: 2, px: 3 }}>
            {resetPwdLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

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
      <Dialog open={advisorDialog} onClose={() => { setAdvisorDialog(false); setEditingAdvisor(null); }} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><RecordVoiceOver sx={{ color: RED }} />{editingAdvisor !== null ? 'Edit Advisor / Speaker' : 'Add Advisor / Speaker'}</Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField label="Full Name *" fullWidth value={advisorForm.name} onChange={e => setAdvisorForm({ ...advisorForm, name: e.target.value })} sx={inputSx} />
          <TextField label="Title / Designation *" fullWidth value={advisorForm.title} onChange={e => setAdvisorForm({ ...advisorForm, title: e.target.value })} sx={inputSx} />
          <TextField label="Institution / Organisation" fullWidth value={advisorForm.institution} onChange={e => setAdvisorForm({ ...advisorForm, institution: e.target.value })} sx={inputSx} />
          <FormControl fullWidth sx={{ ...inputSx, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
            <InputLabel>Category</InputLabel>
            <Select value={advisorForm.category} label="Category" onChange={e => setAdvisorForm({ ...advisorForm, category: e.target.value })}
              slotProps={{ paper: { sx: { background: SURFACE, color: '#fff' } } }}>
              {['Academic', 'Industry', 'Government', 'International', 'Technical'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>
          {/* Photo upload */}
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, mb: 1 }}>Photo (uploaded to GCS)</Typography>
            {!advisorForm.image_url ? (
              <Box component="label" htmlFor="adv-img-input" sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 1, p: 3, borderRadius: 2, border: `2px dashed ${BORDER}`,
                cursor: advisorImgUploading ? 'wait' : 'pointer', background: 'rgba(255,255,255,0.02)',
                '&:hover': { borderColor: ACCENT, background: `${ACCENT}08` }, transition: 'all 0.2s',
              }}>
                {advisorImgUploading ? <CircularProgress size={26} sx={{ color: ACCENT }} /> : <UploadFile sx={{ fontSize: 32, color: 'rgba(255,255,255,0.25)' }} />}
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{advisorImgUploading ? 'Uploading…' : 'Click to upload photo'}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>JPG, PNG, WebP — max 8 MB</Typography>
                <input id="adv-img-input" type="file" accept="image/*" hidden disabled={advisorImgUploading} onChange={async e => {
                  const file = e.target.files?.[0]; if (!file) return;
                  setAdvisorImgUploading(true);
                  try {
                    const fd = new FormData(); fd.append('image', file);
                    const res = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                    if (res.data?.url) setAdvisorForm(prev => ({ ...prev, image_url: res.data.url }));
                  } catch { setError('Photo upload failed'); }
                  finally { setAdvisorImgUploading(false); }
                }} />
              </Box>
            ) : (
              <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: `1px solid ${BORDER}`, maxHeight: 180 }}>
                <img src={advisorForm.image_url} alt="preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }} />
                <Box onClick={() => setAdvisorForm(prev => ({ ...prev, image_url: '' }))}
                  sx={{ position: 'absolute', top: 8, right: 8, px: 1.5, py: 0.5, borderRadius: 1, background: `${RED}cc`, color: '#fff', fontSize: 12, cursor: 'pointer', '&:hover': { background: RED } }}>
                  Remove
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => { setAdvisorDialog(false); setEditingAdvisor(null); }} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button disabled={!advisorForm.name || !advisorForm.title || advisorImgUploading}
            onClick={async () => {
              try {
                if (editingAdvisor !== null) {
                  await api.put(`/api/advisors/${editingAdvisor}`, advisorForm);
                } else {
                  await api.post('/api/advisors', advisorForm);
                }
                setAdvisorDialog(false); setEditingAdvisor(null);
                fetchAdvisors();
              } catch { setError('Failed to save advisor'); }
            }}
            variant="contained" sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, px: 3 }}>
            {editingAdvisor !== null ? 'Save Changes' : 'Add Advisor'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Announcement */}
      <Dialog open={annDialog} onClose={() => { setAnnDialog(false); setAnnForm({ title: '', body: '', image_url: '', target_audience: 'all', send_email: false }); setAnnImgUploading(false); }} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Send sx={{ color: RED }} />New Announcement</Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField label="Title *" fullWidth value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} sx={inputSx} />
          <TextField label="Message *" fullWidth multiline rows={5} value={annForm.body} onChange={e => setAnnForm({ ...annForm, body: e.target.value })} sx={inputSx} />
          {/* Image upload */}
          <Box>
            {!annForm.image_url ? (
              <Box
                component="label"
                htmlFor="ann-img-input"
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 1, p: 3, borderRadius: 2, border: `2px dashed ${BORDER}`,
                  cursor: annImgUploading ? 'wait' : 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                  '&:hover': { borderColor: RED, background: 'rgba(233,69,96,0.06)' },
                  transition: 'all 0.2s',
                }}
              >
                {annImgUploading
                  ? <CircularProgress size={28} sx={{ color: RED }} />
                  : <UploadFile sx={{ fontSize: 36, color: 'rgba(255,255,255,0.25)' }} />}
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  {annImgUploading ? 'Uploading to GCS…' : 'Click to upload poster / image'}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>JPG, PNG, GIF, WebP — max 8 MB</Typography>
                <input id="ann-img-input" type="file" accept="image/*" hidden onChange={handleAnnImageUpload} disabled={annImgUploading} />
              </Box>
            ) : (
              <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                <img src={annForm.image_url} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                  <Box
                    component="label" htmlFor="ann-img-replace"
                    sx={{ px: 1.5, py: 0.5, borderRadius: 1, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 12, cursor: 'pointer', border: `1px solid ${BORDER}`, '&:hover': { background: 'rgba(0,0,0,0.9)' } }}
                  >
                    {annImgUploading ? '…' : 'Replace'}
                    <input id="ann-img-replace" type="file" accept="image/*" hidden onChange={handleAnnImageUpload} disabled={annImgUploading} />
                  </Box>
                  <Box
                    onClick={handleAnnImageRemove}
                    sx={{ px: 1.5, py: 0.5, borderRadius: 1, background: 'rgba(233,69,96,0.8)', color: '#fff', fontSize: 12, cursor: 'pointer', '&:hover': { background: RED } }}
                  >
                    Remove
                  </Box>
                </Box>
                <Typography sx={{ position: 'absolute', bottom: 6, left: 8, fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.5)', px: 1, borderRadius: 1 }}>
                  Stored on GCS ✓
                </Typography>
              </Box>
            )}
          </Box>
          <FormControl fullWidth sx={{ ...inputSx, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
            <InputLabel>Target Audience</InputLabel>
            <Select value={annForm.target_audience} label="Target Audience" onChange={e => setAnnForm({ ...annForm, target_audience: e.target.value })}
              slotProps={{ paper: { sx: { background: SURFACE, color: '#fff' } } }}>
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="project">Project Participants</MenuItem>
              <MenuItem value="olympiad">Olympiad Participants</MenuItem>
              <MenuItem value="wall_magazine">Wall Magazine Participants</MenuItem>
              <MenuItem value="event_registered">All Event Registered</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch checked={annForm.send_email} onChange={e => setAnnForm({ ...annForm, send_email: e.target.checked })} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: RED }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: RED } }} />}
            label={<Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Send via email to registered users</Typography>}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => { setAnnDialog(false); setAnnForm({ title: '', body: '', image_url: '', target_audience: 'all', send_email: false }); }} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleCreateAnnouncement} disabled={annLoading || annImgUploading || !annForm.title || !annForm.body} variant="contained"
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
            <Typography sx={{ color: CYAN, fontSize: 12, fontFamily: 'monospace' }}>name,institution_name,institution_address</Typography>
            <Button size="small" onClick={() => {
              const sample = 'name,institution_name,institution_address\nJohn Doe,BUET,"Dhaka, Bangladesh"\nJane Smith,DU,"Rajshahi, Bangladesh"';
              const a = document.createElement('a');
              a.href = URL.createObjectURL(new Blob([sample], { type: 'text/csv' }));
              a.download = 'ca_sample.csv'; a.click();
            }} sx={{ mt: 1, color: CYAN, textTransform: 'none', fontSize: 12, p: 0 }}>
              Download sample CSV
            </Button>
          </Box>
          <input type="file" accept=".csv" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}
            onChange={async e => {
              const file = e.target.files[0]; if (!file) return;
              // Strip UTF-8 BOM that Excel adds, then normalise line endings
              const raw = (await file.text()).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
              const lines = raw.trim().split('\n');
              // Parse a CSV line respecting quoted fields (handles commas inside quotes)
              const parseLine = line => {
                const result = []; let cur = ''; let inQuote = false;
                for (let i = 0; i < line.length; i++) {
                  const ch = line[i];
                  if (ch === '"') { inQuote = !inQuote; }
                  else if (ch === ',' && !inQuote) { result.push(cur.trim()); cur = ''; }
                  else { cur += ch; }
                }
                result.push(cur.trim());
                return result;
              };
              const headers = parseLine(lines[0]);
              const entries = lines.slice(1).map(line => {
                const vals = parseLine(line);
                return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
              }).filter(e => e.name);
              if (entries.length === 0) { setCaBulkResult({ error: 'No valid rows found. Check that your CSV has the correct headers: name, institution_name, institution_address' }); return; }
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
