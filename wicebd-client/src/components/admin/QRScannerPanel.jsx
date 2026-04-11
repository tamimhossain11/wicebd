import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, Chip, CircularProgress, Divider, Avatar } from '@mui/material';
import { QrCodeScanner, CheckCircle, LunchDining, PersonOff, Refresh } from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
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

/* ── Parse card_uid from a verify URL or raw uid ── */
const extractUid = (raw) => {
  if (!raw) return '';
  // e.g. https://.../api/id-card/verify/WICE-PRJ-XXXXXXXX
  const m = raw.match(/verify\/([^/?#]+)/);
  return m ? m[1] : raw.trim();
};

export default function QRScannerPanel() {
  const [scannerActive, setScannerActive] = useState(false);
  const [manualUid, setManualUid]         = useState('');
  const [result, setResult]               = useState(null);   // { card, attendance }
  const [loading, setLoading]             = useState(false);
  const [actionMsg, setActionMsg]         = useState('');
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const scannedRef = useRef(false);

  /* ── Start camera scanner ── */
  const startScanner = async () => {
    setScannerActive(true);
    scannedRef.current = false;
    // Give DOM time to render the element
    await new Promise(r => setTimeout(r, 200));
    if (!scannerRef.current) return;
    const qr = new Html5Qrcode('qr-reader');
    html5QrRef.current = qr;
    try {
      await qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        (decoded) => {
          if (scannedRef.current) return;
          scannedRef.current = true;
          stopScanner();
          lookup(extractUid(decoded));
        },
        () => {}
      );
    } catch (err) {
      console.error('QR start error:', err);
      setScannerActive(false);
    }
  };

  const stopScanner = () => {
    html5QrRef.current?.stop().catch(() => {});
    html5QrRef.current?.clear().catch(() => {});
    html5QrRef.current = null;
    setScannerActive(false);
  };

  useEffect(() => () => stopScanner(), []);

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

  /* ── Check-in ── */
  const checkin = async () => {
    if (!result?.card?.card_uid) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/admin-manage/attendance/${result.card.card_uid}/checkin`);
      setResult(prev => ({ ...prev, attendance: res.data.attendance }));
      setActionMsg(res.data.already ? 'Already checked in.' : '✅ Checked in successfully!');
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
      setResult(prev => ({ ...prev, attendance: res.data.attendance }));
      setActionMsg(res.data.already ? 'Lunch already claimed.' : '🍱 Lunch marked!');
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to mark lunch');
    } finally { setLoading(false); }
  };

  const att = result?.attendance;
  const card = result?.card;
  const regColor = ROLE_COLORS[card?.registration_type] || C.red;

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
          onClick={() => { setResult(null); setActionMsg(''); setManualUid(''); }}
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
                onClick={startScanner}
                sx={{ background: `linear-gradient(135deg,${C.red},#6c63ff)`, textTransform: 'none', borderRadius: 2, fontWeight: 700, py: 1.4 }}>
                Start Camera
              </Button>
            ) : (
              <Box>
                <Box id="qr-reader" ref={scannerRef}
                  sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', mb: 1.5, border: `2px solid ${C.red}40` }} />
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
              {/* Colour strip */}
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
                </Box>

                {/* Action message */}
                {actionMsg && (
                  <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, background: actionMsg.startsWith('✅') || actionMsg.startsWith('🍱') ? `${C.green}12` : `${C.amber}12`, border: `1px solid ${actionMsg.startsWith('✅') || actionMsg.startsWith('🍱') ? C.green : C.amber}30` }}>
                    <Typography sx={{ color: actionMsg.startsWith('✅') || actionMsg.startsWith('🍱') ? C.green : C.amber, fontSize: 13, fontWeight: 600 }}>{actionMsg}</Typography>
                  </Paper>
                )}

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button fullWidth variant="contained" startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <CheckCircle sx={{ fontSize: 16 }} />}
                    onClick={checkin} disabled={loading || !!att?.checked_in_at}
                    sx={{ background: att?.checked_in_at ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${C.green},#059669)`, textTransform: 'none', borderRadius: 2, fontWeight: 700, fontSize: 13, py: 1.2 }}>
                    {att?.checked_in_at ? 'Checked In ✓' : 'Check In'}
                  </Button>
                  <Button fullWidth variant="contained" startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <LunchDining sx={{ fontSize: 16 }} />}
                    onClick={markLunch} disabled={loading || !att?.checked_in_at || !!att?.lunch_claimed_at}
                    sx={{ background: att?.lunch_claimed_at ? 'rgba(255,255,255,0.08)' : !att?.checked_in_at ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg,${C.amber},#d97706)`, textTransform: 'none', borderRadius: 2, fontWeight: 700, fontSize: 13, py: 1.2 }}>
                    {att?.lunch_claimed_at ? 'Lunch ✓' : 'Lunch'}
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
    </Box>
  );
}
