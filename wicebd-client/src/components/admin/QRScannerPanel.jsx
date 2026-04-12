import { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Chip, CircularProgress,
  Divider, Avatar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from '@mui/material';
import { QrCodeScanner, CheckCircle, LunchDining, PersonOff, Refresh } from '@mui/icons-material';
import QrScanner from 'react-qr-scanner';
import api from '../../api/index';

const C = {
  bg: '#07070f', surface: '#0e0e1c', card: '#12122a',
  border: 'rgba(255,255,255,0.07)', red: '#e94560',
  green: '#10b981', amber: '#f59e0b', cyan: '#06b6d4',
};

const ROLE_COLORS = {
  project:        C.red,
  'wall-magazine': C.green,
  olympiad:       C.cyan,
};

const ROLE_LABELS = {
  project:        'Project Competition',
  'wall-magazine': 'Wall Magazine',
  olympiad:       'Science Olympiad',
};

/* Olympiad participants do NOT get food */
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
  const [result, setResult]               = useState(null);   // { card, attendance }
  const [loading, setLoading]             = useState(false);
  const [actionMsg, setActionMsg]         = useState('');
  const [log, setLog]                     = useState([]);     // persistent scan log

  /* ── Start / stop camera ── */
  const stopScanner = () => setScannerActive(false);

  const handleScan = useCallback((data) => {
    if (!data) return;
    const uid = extractUid(data?.text || data);
    if (!uid) return;
    setScannerActive(false);
    lookup(uid);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleError = (err) => {
    console.error('QR error:', err);
  };

  /* ── Lookup card from server ── */
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

  /* ── Update log entry after action ── */
  const updateLog = (att, card) => {
    setLog(prev => {
      const idx = prev.findIndex(e => e.card_uid === card.card_uid);
      const entry = {
        card_uid: card.card_uid,
        name: card.user_name,
        type: card.registration_type,
        checked_in_at: att?.checked_in_at,
        lunch_claimed_at: att?.lunch_claimed_at,
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [entry, ...prev];
    });
  };

  /* ── Check-in ── */
  const checkin = async () => {
    if (!result?.card?.card_uid) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/admin-manage/attendance/${result.card.card_uid}/checkin`);
      const updated = { ...result, attendance: res.data.attendance };
      setResult(updated);
      setActionMsg(res.data.already ? 'Already checked in.' : '✅ Checked in successfully!');
      updateLog(res.data.attendance, result.card);
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Check-in failed');
    } finally { setLoading(false); }
  };

  /* ── Mark lunch ── */
  const markLunch = async () => {
    if (!result?.card?.card_uid) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/admin-manage/attendance/${result.card.card_uid}/lunch`);
      const updated = { ...result, attendance: res.data.attendance };
      setResult(updated);
      setActionMsg(res.data.already ? 'Lunch already claimed.' : '🍱 Lunch marked!');
      updateLog(res.data.attendance, result.card);
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to mark lunch');
    } finally { setLoading(false); }
  };

  const att  = result?.attendance;
  const card = result?.card;
  const regColor = ROLE_COLORS[card?.registration_type] || C.red;
  const foodEligible = hasFood(card?.registration_type);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 4, height: 22, borderRadius: 2, background: `linear-gradient(${C.red}, #6c63ff)` }} />
          <QrCodeScanner sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
          <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 17 }}>QR Scanner — Event Day</Typography>
        </Box>
        <Button size="small" startIcon={<Refresh sx={{ fontSize: 15 }} />}
          onClick={() => { setResult(null); setActionMsg(''); setManualUid(''); setScannerActive(false); }}
          sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontSize: 12 }}>
          Reset
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>

        {/* ── Left: Scanner + manual ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Camera scanner */}
          <Paper sx={{ p: 2.5, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, mb: 1.5 }}>
              Camera Scanner
            </Typography>
            {!scannerActive ? (
              <Button fullWidth variant="contained" startIcon={<QrCodeScanner />}
                onClick={() => setScannerActive(true)}
                sx={{ background: `linear-gradient(135deg,${C.red},#6c63ff)`, textTransform: 'none', borderRadius: 2, fontWeight: 700, py: 1.4 }}>
                Start Camera
              </Button>
            ) : (
              <Box>
                <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 1.5, border: `2px solid ${C.red}40`, '& video': { width: '100% !important', height: 'auto !important', display: 'block' } }}>
                  <QrScanner
                    delay={200}
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{ video: { facingMode: 'environment' } }}
                    style={{ width: '100%' }}
                  />
                </Box>
                <Button fullWidth variant="outlined" onClick={stopScanner}
                  sx={{ color: C.red, borderColor: `${C.red}50`, textTransform: 'none', borderRadius: 2 }}>
                  Stop Scanner
                </Button>
              </Box>
            )}
          </Paper>

          {/* Manual UID entry */}
          <Paper sx={{ p: 2.5, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14, mb: 1.5 }}>
              Manual Entry
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                value={manualUid}
                onChange={e => setManualUid(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') lookup(extractUid(manualUid)); }}
                placeholder="e.g. WICE-PRJ-ABCD1234"
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13,
                  outline: 'none', fontFamily: 'monospace',
                }}
              />
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
                {/* Participant */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                  <Avatar sx={{ width: 52, height: 52, background: `linear-gradient(135deg,${regColor},${regColor}88)`, fontWeight: 800, fontSize: 22 }}>
                    {(card.user_name || '?').charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={800} sx={{ color: '#fff', fontSize: 16 }}>{card.user_name}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{card.user_email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={ROLE_LABELS[card.registration_type] || card.registration_type} size="small"
                    sx={{ background: `${regColor}20`, color: regColor, fontWeight: 700, fontSize: 11 }} />
                  <Chip label={card.card_uid} size="small"
                    sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'monospace' }} />
                  {!foodEligible && (
                    <Chip label="No meal" size="small"
                      sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                  )}
                </Box>

                <Divider sx={{ borderColor: C.border, mb: 2 }} />

                {/* Attendance status */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Check-in</Typography>
                    {att?.checked_in_at ? (
                      <Chip icon={<CheckCircle sx={{ fontSize: '13px !important', color: `${C.green} !important` }} />}
                        label={new Date(att.checked_in_at).toLocaleTimeString()} size="small"
                        sx={{ background: `${C.green}18`, color: C.green, fontWeight: 700, fontSize: 11 }} />
                    ) : (
                      <Chip label="Not checked in" size="small"
                        sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                    )}
                  </Box>
                  {foodEligible && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Lunch</Typography>
                      {att?.lunch_claimed_at ? (
                        <Chip icon={<LunchDining sx={{ fontSize: '13px !important', color: `${C.amber} !important` }} />}
                          label={new Date(att.lunch_claimed_at).toLocaleTimeString()} size="small"
                          sx={{ background: `${C.amber}18`, color: C.amber, fontWeight: 700, fontSize: 11 }} />
                      ) : (
                        <Chip label="Not claimed" size="small"
                          sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                      )}
                    </Box>
                  )}
                </Box>

                {/* Action message */}
                {actionMsg && (
                  <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2,
                    background: actionMsg.startsWith('✅') || actionMsg.startsWith('🍱') ? `${C.green}12` : `${C.amber}12`,
                    border: `1px solid ${actionMsg.startsWith('✅') || actionMsg.startsWith('🍱') ? C.green : C.amber}30` }}>
                    <Typography sx={{ color: actionMsg.startsWith('✅') || actionMsg.startsWith('🍱') ? C.green : C.amber, fontSize: 13, fontWeight: 600 }}>
                      {actionMsg}
                    </Typography>
                  </Paper>
                )}

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button fullWidth variant="contained"
                    startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <CheckCircle sx={{ fontSize: 16 }} />}
                    onClick={checkin} disabled={loading || !!att?.checked_in_at}
                    sx={{ background: att?.checked_in_at ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${C.green},#059669)`, textTransform: 'none', borderRadius: 2, fontWeight: 700, fontSize: 13, py: 1.2 }}>
                    {att?.checked_in_at ? 'Checked In ✓' : 'Check In'}
                  </Button>
                  {foodEligible && (
                    <Button fullWidth variant="contained"
                      startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <LunchDining sx={{ fontSize: 16 }} />}
                      onClick={markLunch} disabled={loading || !att?.checked_in_at || !!att?.lunch_claimed_at}
                      sx={{ background: att?.lunch_claimed_at ? 'rgba(255,255,255,0.08)' : !att?.checked_in_at ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg,${C.amber},#d97706)`, textTransform: 'none', borderRadius: 2, fontWeight: 700, fontSize: 13, py: 1.2 }}>
                      {att?.lunch_claimed_at ? 'Lunch ✓' : 'Lunch'}
                    </Button>
                  )}
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

      {/* ── Scan log ── */}
      {log.length > 0 && (
        <Paper sx={{ mt: 4, borderRadius: 3, background: C.card, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 14 }}>
              Session Log — {log.length} participant{log.length !== 1 ? 's' : ''}
            </Typography>
            <Button size="small" onClick={() => setLog([])}
              sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'none', fontSize: 11 }}>
              Clear
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Name', 'Type', 'Card UID', 'Check-in', 'Lunch'].map(h => (
                    <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.4)', borderColor: C.border, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {log.map(entry => (
                  <TableRow key={entry.card_uid} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                    <TableCell sx={{ color: '#fff', borderColor: C.border, fontSize: 13, fontWeight: 600 }}>{entry.name}</TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      <Chip label={ROLE_LABELS[entry.type] || entry.type} size="small"
                        sx={{ background: `${ROLE_COLORS[entry.type] || C.red}20`, color: ROLE_COLORS[entry.type] || C.red, fontSize: 10, fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: C.border, fontSize: 11, fontFamily: 'monospace' }}>{entry.card_uid}</TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      {entry.checked_in_at
                        ? <Chip icon={<CheckCircle sx={{ fontSize: '11px !important', color: `${C.green} !important` }} />}
                            label={new Date(entry.checked_in_at).toLocaleTimeString()} size="small"
                            sx={{ background: `${C.green}18`, color: C.green, fontSize: 10 }} />
                        : <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>—</Typography>
                      }
                    </TableCell>
                    <TableCell sx={{ borderColor: C.border }}>
                      {entry.type === 'olympiad'
                        ? <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>N/A</Typography>
                        : entry.lunch_claimed_at
                          ? <Chip icon={<LunchDining sx={{ fontSize: '11px !important', color: `${C.amber} !important` }} />}
                              label={new Date(entry.lunch_claimed_at).toLocaleTimeString()} size="small"
                              sx={{ background: `${C.amber}18`, color: C.amber, fontSize: 10 }} />
                          : <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>—</Typography>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
