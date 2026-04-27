import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, Button, Chip, CircularProgress,
  Divider, Avatar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  IconButton, Tooltip,
} from '@mui/material';
import { QrCodeScanner, CheckCircle, LunchDining, PersonOff, Refresh, LocalCafe, CardMembership, FileDownload, DeleteOutline, VisibilityOutlined, WarningAmberRounded } from '@mui/icons-material';
import QrScanner from 'react-qr-scanner';
import html2canvas from 'html2canvas';
import api from '../../api/index';
import GuestIDCard from './GuestIDCard';

const C = {
  bg: '#07070f', surface: '#0e0e1c', card: '#12122a',
  border: 'rgba(255,255,255,0.07)', red: '#e94560',
  green: '#10b981', amber: '#f59e0b', cyan: '#06b6d4',
  coffee: '#a16207',
};

const ROLE_COLORS = {
  project:        C.red,
  'wall-magazine': C.green,
  olympiad:       C.cyan,
  guest:          '#a855f7',
};

const ROLE_LABELS = {
  project:        'Project Competition',
  'wall-magazine': 'Wall Magazine',
  olympiad:       'Science Olympiad',
  guest:          'Guest',
};

const POSITIONS = [
  'Campus Ambassador (C.A)',
  'Club Partner',
  'Volunteer',
  'District & Divisional Leader',
  'General Guest',
];

/* Olympiad participants do NOT get lunch but DO get coffee. Guests get both. */
const hasFood = (registrationType) => registrationType !== 'olympiad';

/* Parse card_uid from a verify URL or raw uid */
const extractUid = (raw) => {
  if (!raw) return '';
  const m = raw.match(/verify\/([^/?#]+)/);
  return m ? m[1] : raw.trim();
};

export default function QRScannerPanel() {
  const [scannerActive, setScannerActive] = useState(false);
  const [manualUid, setManualUid]         = useState('');
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(false);
  const [actionMsg, setActionMsg]         = useState('');
  const [allAttendance, setAllAttendance] = useState([]);
  const [logLoading, setLogLoading]       = useState(true);

  /* Guest ID card — generate dialog */
  const [guestDialog, setGuestDialog]       = useState(false);
  const [guestForm, setGuestForm]           = useState({ guest_name: '', guest_position: '' });
  const [guestResult, setGuestResult]       = useState(null);
  const [guestLoading, setGuestLoading]     = useState(false);

  /* Guest ID card — list */
  const [guestList, setGuestList]           = useState([]);
  const [guestListLoading, setGuestListLoading] = useState(true);
  const [viewCard, setViewCard]             = useState(null);
  const [deleteUid, setDeleteUid]           = useState(null); // uid awaiting confirm
  const [deleteLoading, setDeleteLoading]   = useState(false);
  const [downloadingUid, setDownloadingUid] = useState(null);
  const cardRef = useRef(null);

  const fetchGuestList = useCallback(async () => {
    setGuestListLoading(true);
    try {
      const res = await api.get('/api/id-card/admin/guests');
      setGuestList(res.data.guests || []);
    } catch { /* silently ignore */ }
    finally { setGuestListLoading(false); }
  }, []);

  const downloadCard = async (card) => {
    setDownloadingUid(card.card_uid);
    // Small delay so the hidden card renders fully before capture
    await new Promise(r => setTimeout(r, 120));
    try {
      const el = document.getElementById(`guestcard-${card.card_uid}`);
      if (!el) return;
      const canvas = await html2canvas(el, {
        scale: 2, useCORS: true, backgroundColor: null, logging: false,
      });
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${card.card_uid}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } finally {
      setDownloadingUid(null);
    }
  };

  const confirmDelete = async (uid) => {
    setDeleteLoading(true);
    try {
      await api.delete(`/api/id-card/admin/guests/${uid}`);
      setGuestList(prev => prev.filter(g => g.card_uid !== uid));
      if (viewCard?.card_uid === uid) setViewCard(null);
    } catch { /* silently ignore */ }
    finally { setDeleteLoading(false); setDeleteUid(null); }
  };

  const fetchAll = useCallback(async () => {
    setLogLoading(true);
    try {
      const res = await api.get('/api/admin-manage/attendance');
      setAllAttendance(res.data.attendance || []);
    } catch { /* silently ignore */ }
    finally { setLogLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchGuestList(); }, [fetchGuestList]);

  const stopScanner = () => setScannerActive(false);

  const handleScan = useCallback((data) => {
    if (!data) return;
    const uid = extractUid(data?.text || data);
    if (!uid) return;
    setScannerActive(false);
    lookup(uid);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleError = (err) => { console.error('QR error:', err); };

  const lookup = async (uid) => {
    if (!uid) return;
    setLoading(true);
    setResult(null);
    setActionMsg('');
    try {
      const res = await api.get(`/api/admin-manage/attendance/${encodeURIComponent(uid)}`);
      setResult(res.data);
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Card not found');
    } finally {
      setLoading(false);
    }
  };

  const checkin = async () => {
    if (!result?.card?.card_uid) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/admin-manage/attendance/${result.card.card_uid}/checkin`);
      setResult({ ...result, attendance: res.data.attendance });
      setActionMsg(res.data.already ? 'Already checked in.' : '✅ Checked in successfully!');
      fetchAll();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Check-in failed');
    } finally { setLoading(false); }
  };

  const markLunch = async () => {
    if (!result?.card?.card_uid) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/admin-manage/attendance/${result.card.card_uid}/lunch`);
      setResult({ ...result, attendance: res.data.attendance });
      setActionMsg(res.data.already ? 'Lunch already claimed.' : '🍱 Lunch marked!');
      fetchAll();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to mark lunch');
    } finally { setLoading(false); }
  };

  const markCoffee = async () => {
    if (!result?.card?.card_uid) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/admin-manage/attendance/${result.card.card_uid}/coffee`);
      setResult({ ...result, attendance: res.data.attendance });
      setActionMsg(res.data.already ? 'Coffee already claimed.' : '☕ Coffee marked!');
      fetchAll();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to mark coffee');
    } finally { setLoading(false); }
  };

  const handleGenerateGuestCard = async () => {
    if (!guestForm.guest_name.trim() || !guestForm.guest_position) return;
    setGuestLoading(true);
    setGuestResult(null);
    try {
      const r = await api.post('/api/id-card/admin/generate-guest', guestForm);
      setGuestResult(r.data);
      // Optimistically add to list so hidden card is renderable immediately for download
      if (r.data?.card) {
        const newCard = r.data.card;
        setGuestList(prev => {
          if (prev.some(g => g.card_uid === newCard.card_uid)) return prev;
          return [{ ...newCard, generated_at: newCard.generated_at || new Date().toISOString() }, ...prev];
        });
      }
      fetchGuestList();
    } catch (err) {
      setGuestResult({ error: err.response?.data?.message || 'Failed to generate card' });
    } finally { setGuestLoading(false); }
  };

  const att       = result?.attendance;
  const card      = result?.card;
  const regColor  = ROLE_COLORS[card?.registration_type] || C.red;
  const foodEligible = hasFood(card?.registration_type);

  const isPositive = (msg) => msg.startsWith('✅') || msg.startsWith('🍱') || msg.startsWith('☕');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 4, height: 22, borderRadius: 2, background: `linear-gradient(${C.red}, #6c63ff)` }} />
          <QrCodeScanner sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
          <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 17 }}>QR Scanner — Event Day</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" startIcon={<CardMembership sx={{ fontSize: 15 }} />}
            variant="outlined"
            onClick={() => { setGuestForm({ guest_name: '', guest_position: '' }); setGuestResult(null); setGuestDialog(true); }}
            sx={{ color: '#a855f7', borderColor: '#a855f740', textTransform: 'none', borderRadius: 2, fontSize: 12, fontWeight: 700 }}>
            Guest ID Card
          </Button>
          <Button size="small" startIcon={<Refresh sx={{ fontSize: 15 }} />}
            onClick={() => { setResult(null); setActionMsg(''); setManualUid(''); setScannerActive(false); }}
            sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontSize: 12 }}>
            Reset
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>

        {/* ── Left: Scanner + manual ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, mb: 1.5 }}>Camera Scanner</Typography>
            {!scannerActive ? (
              <Button fullWidth variant="contained" startIcon={<QrCodeScanner />}
                onClick={() => setScannerActive(true)}
                sx={{ background: `linear-gradient(135deg,${C.red},#6c63ff)`, textTransform: 'none', borderRadius: 2, fontWeight: 700, py: 1.4 }}>
                Start Camera
              </Button>
            ) : (
              <Box>
                <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 1.5, border: `2px solid ${C.red}40`, '& video': { width: '100% !important', height: 'auto !important', display: 'block' } }}>
                  <QrScanner delay={200} onScan={handleScan} onError={handleError}
                    constraints={{ video: { facingMode: 'environment' } }} style={{ width: '100%' }} />
                </Box>
                <Button fullWidth variant="outlined" onClick={stopScanner}
                  sx={{ color: C.red, borderColor: `${C.red}50`, textTransform: 'none', borderRadius: 2 }}>
                  Stop Scanner
                </Button>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, mb: 1.5 }}>Manual Entry</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input value={manualUid} onChange={e => setManualUid(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') lookup(extractUid(manualUid)); }}
                placeholder="e.g. WICE-PRJ-ABCD1234"
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'monospace' }} />
              <Button variant="contained" onClick={() => lookup(extractUid(manualUid))}
                disabled={!manualUid.trim() || loading}
                sx={{ background: `linear-gradient(135deg,${C.red},#6c63ff)`, textTransform: 'none', borderRadius: 2, px: 2, minWidth: 80 }}>
                {loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Lookup'}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* ── Right: Result panel ── */}
        <Box>
          {loading && !result && (
            <Paper sx={{ p: 6, borderRadius: 3, background: C.card, border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <CircularProgress sx={{ color: C.red }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', mt: 2, fontSize: 13 }}>Looking up card…</Typography>
            </Paper>
          )}

          {!loading && actionMsg && !result && (
            <Paper sx={{ p: 4, borderRadius: 3, background: `${C.red}10`, border: `1px solid ${C.red}30`, textAlign: 'center' }}>
              <PersonOff sx={{ fontSize: 40, color: C.red, mb: 1 }} />
              <Typography sx={{ color: C.red, fontWeight: 700, fontSize: 14 }}>{actionMsg}</Typography>
            </Paper>
          )}

          {result && card && (
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', background: C.card, border: `1px solid ${regColor}30` }}>
              <Box sx={{ height: 4, background: `linear-gradient(90deg, ${regColor}, ${regColor}44)` }} />

              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                  <Avatar sx={{ width: 52, height: 52, background: `linear-gradient(135deg,${regColor},${regColor}88)`, fontWeight: 800, fontSize: 22 }}>
                    {(card.user_name || '?').charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 16 }}>{card.user_name}</Typography>
                    {card.registration_type === 'guest' && card.guest_position
                      ? <Chip label={card.guest_position} size="small" sx={{ background: 'rgba(168,85,247,0.18)', color: '#c084fc', fontSize: 11, fontWeight: 700, mt: 0.3 }} />
                      : <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{card.user_email}</Typography>
                    }
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={ROLE_LABELS[card.registration_type] || card.registration_type} size="small"
                    sx={{ background: `${regColor}20`, color: regColor, fontWeight: 700, fontSize: 11 }} />
                  <Chip label={card.card_uid} size="small"
                    sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'monospace' }} />
                  {!foodEligible && (
                    <Chip label="No lunch" size="small"
                      sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                  )}
                </Box>

                <Divider sx={{ borderColor: C.border, mb: 2 }} />

                {/* Attendance status */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Check-in</Typography>
                    {att?.checked_in_at
                      ? <Chip icon={<CheckCircle sx={{ fontSize: '13px !important', color: `${C.green} !important` }} />}
                          label={new Date(att.checked_in_at).toLocaleTimeString()} size="small"
                          sx={{ background: `${C.green}18`, color: C.green, fontWeight: 700, fontSize: 11 }} />
                      : <Chip label="Not checked in" size="small"
                          sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                    }
                  </Box>
                  {foodEligible && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Lunch</Typography>
                      {att?.lunch_claimed_at
                        ? <Chip icon={<LunchDining sx={{ fontSize: '13px !important', color: `${C.amber} !important` }} />}
                            label={new Date(att.lunch_claimed_at).toLocaleTimeString()} size="small"
                            sx={{ background: `${C.amber}18`, color: C.amber, fontWeight: 700, fontSize: 11 }} />
                        : <Chip label="Not claimed" size="small"
                            sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                      }
                    </Box>
                  )}
                  {/* Coffee — all participants eligible */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Coffee</Typography>
                    {att?.coffee_claimed_at
                      ? <Chip icon={<LocalCafe sx={{ fontSize: '13px !important', color: `${C.coffee} !important` }} />}
                          label={new Date(att.coffee_claimed_at).toLocaleTimeString()} size="small"
                          sx={{ background: `${C.coffee}25`, color: C.coffee, fontWeight: 700, fontSize: 11 }} />
                      : <Chip label="Not claimed" size="small"
                          sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                    }
                  </Box>
                </Box>

                {/* Action message */}
                {actionMsg && (
                  <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2,
                    background: isPositive(actionMsg) ? `${C.green}12` : `${C.amber}12`,
                    border: `1px solid ${isPositive(actionMsg) ? C.green : C.amber}30` }}>
                    <Typography sx={{ color: isPositive(actionMsg) ? C.green : C.amber, fontSize: 13, fontWeight: 600 }}>
                      {actionMsg}
                    </Typography>
                  </Paper>
                )}

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="contained" sx={{ flex: 1, minWidth: 100,
                    background: att?.checked_in_at ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${C.green},#059669)`,
                    textTransform: 'none', borderRadius: 2, fontWeight: 700, fontSize: 13, py: 1.2 }}
                    startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <CheckCircle sx={{ fontSize: 16 }} />}
                    onClick={checkin} disabled={loading || !!att?.checked_in_at}>
                    {att?.checked_in_at ? 'Checked In ✓' : 'Check In'}
                  </Button>
                  {foodEligible && (
                    <Button variant="contained" sx={{ flex: 1, minWidth: 90,
                      background: att?.lunch_claimed_at ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${C.amber},#d97706)`,
                      textTransform: 'none', borderRadius: 2, fontWeight: 700, fontSize: 13, py: 1.2 }}
                      startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <LunchDining sx={{ fontSize: 16 }} />}
                      onClick={markLunch} disabled={loading || !!att?.lunch_claimed_at}>
                      {att?.lunch_claimed_at ? 'Lunch ✓' : 'Lunch'}
                    </Button>
                  )}
                  <Button variant="contained" sx={{ flex: 1, minWidth: 90,
                    background: att?.coffee_claimed_at ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${C.coffee},#92400e)`,
                    textTransform: 'none', borderRadius: 2, fontWeight: 700, fontSize: 13, py: 1.2 }}
                    startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <LocalCafe sx={{ fontSize: 16 }} />}
                    onClick={markCoffee} disabled={loading || !!att?.coffee_claimed_at}>
                    {att?.coffee_claimed_at ? 'Coffee ✓' : 'Coffee'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {!loading && !result && !actionMsg && (
            <Paper sx={{ p: 6, borderRadius: 3, background: C.card, border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <QrCodeScanner sx={{ fontSize: 56, color: 'rgba(255,255,255,0.08)', mb: 2 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
                Scan a participant QR code or enter their Card UID manually
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* ── Attendance Log ── */}
      <Paper sx={{ mt: 4, borderRadius: 3, background: C.card, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14 }}>Attendance Log</Typography>
            {!logLoading && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`${allAttendance.length} checked in`} size="small"
                  sx={{ background: `${C.green}18`, color: C.green, fontSize: 11, fontWeight: 700 }} />
                <Chip label={`${allAttendance.filter(e => e.lunch_claimed_at && e.registration_type !== 'olympiad').length} meals`} size="small"
                  sx={{ background: `${C.amber}18`, color: C.amber, fontSize: 11, fontWeight: 700 }} />
                <Chip label={`${allAttendance.filter(e => e.coffee_claimed_at).length} coffees`} size="small"
                  sx={{ background: `${C.coffee}25`, color: C.coffee, fontSize: 11, fontWeight: 700 }} />
              </Box>
            )}
          </Box>
          <Button size="small"
            startIcon={logLoading ? <CircularProgress size={12} sx={{ color: C.cyan }} /> : <Refresh sx={{ fontSize: 14 }} />}
            onClick={fetchAll} disabled={logLoading}
            sx={{ color: C.cyan, textTransform: 'none', fontSize: 12, border: `1px solid ${C.cyan}30`, borderRadius: 2, px: 1.5 }}>
            Refresh
          </Button>
        </Box>

        {logLoading ? (
          <Box sx={{ py: 5, textAlign: 'center' }}><CircularProgress size={28} sx={{ color: C.red }} /></Box>
        ) : allAttendance.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No check-ins yet.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Name', 'Type', 'Card UID', 'Check-in', 'Lunch', 'Coffee'].map(h => (
                    <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.4)', borderColor: C.border, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allAttendance.map(entry => (
                  <TableRow key={entry.card_uid} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                    <TableCell sx={{ color: '#fff', borderColor: C.border, fontSize: 13, fontWeight: 600 }}>{entry.participant_name}</TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      <Chip label={ROLE_LABELS[entry.registration_type] || entry.registration_type} size="small"
                        sx={{ background: `${ROLE_COLORS[entry.registration_type] || C.red}20`, color: ROLE_COLORS[entry.registration_type] || C.red, fontSize: 10, fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: C.border, fontSize: 11, fontFamily: 'monospace' }}>{entry.card_uid}</TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      {entry.checked_in_at
                        ? <Chip icon={<CheckCircle sx={{ fontSize: '11px !important', color: `${C.green} !important` }} />}
                            label={new Date(entry.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} size="small"
                            sx={{ background: `${C.green}18`, color: C.green, fontSize: 10 }} />
                        : <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>—</Typography>
                      }
                    </TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      {entry.registration_type === 'olympiad'
                        ? <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>N/A</Typography>
                        : entry.lunch_claimed_at
                          ? <Chip icon={<LunchDining sx={{ fontSize: '11px !important', color: `${C.amber} !important` }} />}
                              label={new Date(entry.lunch_claimed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} size="small"
                              sx={{ background: `${C.amber}18`, color: C.amber, fontSize: 10 }} />
                          : <Chip label="—" size="small" sx={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', fontSize: 10 }} />
                      }
                    </TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      {entry.coffee_claimed_at
                        ? <Chip icon={<LocalCafe sx={{ fontSize: '11px !important', color: `${C.coffee} !important` }} />}
                            label={new Date(entry.coffee_claimed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} size="small"
                            sx={{ background: `${C.coffee}25`, color: C.coffee, fontSize: 10 }} />
                        : <Chip label="—" size="small" sx={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', fontSize: 10 }} />
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ── Guest ID Cards List ── */}
      <Paper sx={{ mt: 4, borderRadius: 3, background: C.card, border: '1px solid rgba(168,85,247,0.2)', overflow: 'hidden' }}>
        <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CardMembership sx={{ color: '#a855f7', fontSize: 18 }} />
            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14 }}>Guest ID Cards</Typography>
            {!guestListLoading && (
              <Chip label={`${guestList.length} issued`} size="small"
                sx={{ background: 'rgba(168,85,247,0.18)', color: '#c084fc', fontSize: 11, fontWeight: 700 }} />
            )}
          </Box>
          <Button size="small"
            startIcon={guestListLoading ? <CircularProgress size={12} sx={{ color: '#a855f7' }} /> : <Refresh sx={{ fontSize: 14 }} />}
            onClick={fetchGuestList} disabled={guestListLoading}
            sx={{ color: '#a855f7', textTransform: 'none', fontSize: 12, border: '1px solid rgba(168,85,247,0.3)', borderRadius: 2, px: 1.5 }}>
            Refresh
          </Button>
        </Box>

        {guestListLoading ? (
          <Box sx={{ py: 5, textAlign: 'center' }}><CircularProgress size={28} sx={{ color: '#a855f7' }} /></Box>
        ) : guestList.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No guest cards issued yet.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Name', 'Position', 'Card UID', 'Issued At', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.4)', borderColor: C.border, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {guestList.map(g => (
                  <TableRow key={g.card_uid} sx={{ '&:hover': { background: 'rgba(168,85,247,0.05)' } }}>
                    <TableCell sx={{ color: '#fff', borderColor: C.border, fontSize: 13, fontWeight: 600 }}>{g.guest_name}</TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      <Chip label={g.guest_position} size="small"
                        sx={{ background: 'rgba(168,85,247,0.18)', color: '#c084fc', fontSize: 10, fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: C.border, fontSize: 11, fontFamily: 'monospace' }}>{g.card_uid}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.45)', borderColor: C.border, fontSize: 12 }}>
                      {new Date(g.generated_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Tooltip title="View card">
                          <IconButton size="small" onClick={() => setViewCard(g)}
                            sx={{ color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 1.5, p: 0.6 }}>
                            <VisibilityOutlined sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download card as PNG">
                          <IconButton size="small" onClick={() => downloadCard(g)} disabled={downloadingUid === g.card_uid}
                            sx={{ color: C.green, border: `1px solid ${C.green}40`, borderRadius: 1.5, p: 0.6 }}>
                            {downloadingUid === g.card_uid
                              ? <CircularProgress size={13} sx={{ color: C.green }} />
                              : <FileDownload sx={{ fontSize: 15 }} />}
                          </IconButton>
                        </Tooltip>
                        {deleteUid === g.card_uid ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Button size="small" onClick={() => confirmDelete(g.card_uid)} disabled={deleteLoading}
                              sx={{ color: C.red, border: `1px solid ${C.red}50`, borderRadius: 1.5, textTransform: 'none', fontSize: 10, fontWeight: 700, px: 1, py: 0.4, minWidth: 0 }}>
                              {deleteLoading ? <CircularProgress size={11} sx={{ color: C.red }} /> : 'Confirm'}
                            </Button>
                            <Button size="small" onClick={() => setDeleteUid(null)}
                              sx={{ color: 'rgba(255,255,255,0.35)', textTransform: 'none', fontSize: 10, px: 0.8, py: 0.4, minWidth: 0 }}>
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <Tooltip title="Delete card">
                            <IconButton size="small" onClick={() => setDeleteUid(g.card_uid)}
                              sx={{ color: C.red, border: `1px solid ${C.red}30`, borderRadius: 1.5, p: 0.6 }}>
                              <DeleteOutline sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ── View Guest Card Dialog ── */}
      <Dialog open={!!viewCard} onClose={() => setViewCard(null)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { background: '#080d1e', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: `1px solid ${C.border}`, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CardMembership sx={{ color: '#a855f7', fontSize: 20 }} />
              Guest ID Card Preview
            </Box>
            <Chip label={`Issued ${viewCard ? new Date(viewCard.generated_at).toLocaleDateString() : ''}`} size="small"
              sx={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', fontSize: 11 }} />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {viewCard && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              {/* The actual designed card — also used for html2canvas capture */}
              <Box sx={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.7))' }}>
                <GuestIDCard
                  card={viewCard}
                  ref={cardRef}
                  id={`guestcard-${viewCard.card_uid}`}
                />
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'center' }}>
                Click Download to save this card as a high-resolution PNG
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5, borderTop: `1px solid ${C.border}` }}>
          <Button onClick={() => setViewCard(null)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>
            Close
          </Button>
          {viewCard && deleteUid === viewCard.card_uid ? (
            <>
              <Button onClick={() => setDeleteUid(null)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
              <Button variant="outlined" onClick={() => confirmDelete(viewCard.card_uid)} disabled={deleteLoading}
                startIcon={deleteLoading ? <CircularProgress size={14} sx={{ color: C.red }} /> : <WarningAmberRounded sx={{ fontSize: 16 }} />}
                sx={{ color: C.red, borderColor: `${C.red}60`, textTransform: 'none', borderRadius: 2, fontWeight: 700 }}>
                Confirm Delete
              </Button>
            </>
          ) : (
            <Button variant="outlined" onClick={() => setDeleteUid(viewCard?.card_uid)}
              startIcon={<DeleteOutline sx={{ fontSize: 16 }} />}
              sx={{ color: C.red, borderColor: `${C.red}40`, textTransform: 'none', borderRadius: 2, fontWeight: 700 }}>
              Delete
            </Button>
          )}
          {viewCard && (
            <Button variant="contained"
              onClick={() => downloadCard(viewCard)}
              disabled={downloadingUid === viewCard?.card_uid}
              startIcon={downloadingUid === viewCard?.card_uid
                ? <CircularProgress size={14} sx={{ color: '#fff' }} />
                : <FileDownload sx={{ fontSize: 16 }} />}
              sx={{ background: 'linear-gradient(135deg, #a855f7, #6c63ff)', textTransform: 'none', borderRadius: 2, fontWeight: 700, px: 3 }}>
              Download Card
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Hidden cards for html2canvas capture (one per guest, off-screen) */}
      <Box sx={{ position: 'fixed', top: -9999, left: -9999, pointerEvents: 'none' }}>
        {guestList.map(g => (
          <div key={g.card_uid} id={`guestcard-${g.card_uid}`}>
            <GuestIDCard card={g} />
          </div>
        ))}
      </Box>

      {/* ── Guest ID Card Generate Dialog ── */}
      <Dialog open={guestDialog} onClose={() => setGuestDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: `1px solid ${C.border}`, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CardMembership sx={{ color: '#a855f7', fontSize: 20 }} />
            Generate Guest ID Card
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, overflowX: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1, alignItems: 'center' }}>
            {/* Form fields — always full width */}
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)' }}>
                <Typography sx={{ color: '#c084fc', fontSize: 13, lineHeight: 1.7 }}>
                  Fill in the guest's name and position to generate an ID card. This is for CAs, volunteers, leaders, and other non-participant guests.
                </Typography>
              </Box>

              <TextField
                label="Guest Full Name *"
                placeholder="e.g. Tamim Hossain"
                value={guestForm.guest_name}
                onChange={e => setGuestForm(f => ({ ...f, guest_name: e.target.value }))}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: C.border }, '&:hover fieldset': { borderColor: '#a855f7' }, '&.Mui-focused fieldset': { borderColor: '#a855f7' } },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#a855f7' },
                }}
              />

              <FormControl fullWidth sx={{ '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#a855f7' } }}>Position *</InputLabel>
                <Select
                  value={guestForm.guest_position}
                  label="Position *"
                  onChange={e => setGuestForm(f => ({ ...f, guest_position: e.target.value }))}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: C.border },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#a855f7' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#a855f7' },
                  }}
                  MenuProps={{ PaperProps: { sx: { background: C.surface, border: `1px solid ${C.border}`, '& .MuiMenuItem-root': { color: '#fff' }, '& .MuiMenuItem-root:hover': { background: 'rgba(168,85,247,0.15)' }, '& .MuiMenuItem-root.Mui-selected': { background: 'rgba(168,85,247,0.25)' } } } }}
                >
                  {POSITIONS.map(p => (
                    <MenuItem key={p} value={p} sx={{ color: '#fff' }}>{p}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {guestResult && !guestResult.error && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ color: C.green, fontWeight: 700, fontSize: 13, alignSelf: 'flex-start' }}>
                  ✅ Guest ID Card generated!
                </Typography>
                <Box sx={{ filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.6))' }}>
                  <GuestIDCard card={guestResult.card} />
                </Box>
                <Button size="small" variant="outlined"
                  onClick={() => guestResult.card && downloadCard(guestResult.card)}
                  disabled={downloadingUid === guestResult.card?.card_uid}
                  startIcon={downloadingUid === guestResult.card?.card_uid
                    ? <CircularProgress size={13} sx={{ color: C.green }} />
                    : <FileDownload sx={{ fontSize: 15 }} />}
                  sx={{ color: C.green, borderColor: `${C.green}50`, textTransform: 'none', borderRadius: 2, fontSize: 12, fontWeight: 700 }}>
                  Download Card
                </Button>
              </Box>
            )}
            {guestResult?.error && (
              <Box sx={{ p: 2, borderRadius: 2, background: `${C.red}10`, border: `1px solid ${C.red}30` }}>
                <Typography sx={{ color: C.red, fontSize: 13, fontWeight: 600 }}>✗ {guestResult.error}</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, borderTop: `1px solid ${C.border}` }}>
          <Button onClick={() => setGuestDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>
            {guestResult && !guestResult.error ? 'Done' : 'Cancel'}
          </Button>
          {!(guestResult && !guestResult.error) && (
            <Button variant="contained"
              onClick={handleGenerateGuestCard}
              disabled={!guestForm.guest_name.trim() || !guestForm.guest_position || guestLoading}
              startIcon={guestLoading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <CardMembership />}
              sx={{ background: 'linear-gradient(135deg, #a855f7, #6c63ff)', textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 700,
                '&:disabled': { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' } }}>
              Generate Card
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
