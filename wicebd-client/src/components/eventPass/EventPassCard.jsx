import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Chip } from '@mui/material';
import { QrCode2, Download, CheckCircle, CardMembership } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/index';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const EventPassCard = ({ user }) => {
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const passRef = useRef(null);

  useEffect(() => {
    api.get('/api/event-pass/my-pass')
      .then(({ data }) => { if (data.success) setPass(data.pass); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRequest = async () => {
    setRequesting(true);
    try {
      const { data } = await api.get('/api/event-pass/my-pass');
      if (data.success) setPass(data.pass);
    } catch {
      // pass
    } finally { setRequesting(false); }
  };

  const handleDownload = () => {
    if (!passRef.current) return;
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(passRef.current, { scale: 3, backgroundColor: null, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `WICE-EventPass-${pass.pass_id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }).catch(() => {
      // html2canvas not installed — skip silently
    });
  };

  const verifyUrl = `${BACKEND}/api/event-pass/verify/${pass?.pass_id}`;

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress sx={{ color: '#800020' }} />
    </Box>
  );

  if (!pass) return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <CardMembership sx={{ fontSize: 64, color: 'rgba(128,0,32,0.3)', mb: 2 }} />
      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18, mb: 1 }}>
        Get Your Free Event Pass
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, mb: 3, maxWidth: 360, mx: 'auto' }}>
        Your event pass gives you access to WICE Bangladesh 2026. It includes a QR code for quick check-in at the venue.
      </Typography>
      <Button
        onClick={handleRequest}
        disabled={requesting}
        startIcon={requesting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <QrCode2 />}
        sx={{
          background: 'linear-gradient(135deg, #800020, #c0002a)',
          color: '#fff', textTransform: 'none', fontWeight: 700,
          fontSize: 14, borderRadius: 2, px: 4, py: 1.3,
          boxShadow: '0 6px 20px rgba(128,0,32,0.4)',
          '&:hover': { opacity: 0.9 },
          '&:disabled': { background: 'rgba(128,0,32,0.3)', color: 'rgba(255,255,255,0.4)' },
        }}
      >
        {requesting ? 'Generating…' : 'Generate My Pass'}
      </Button>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>Event Pass</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13.5, mt: 0.5 }}>
            Your official WICE Bangladesh 2026 — 8th Edition entry pass
          </Typography>
        </Box>
        <Button
          onClick={handleDownload}
          startIcon={<Download />}
          variant="outlined"
          size="small"
          sx={{
            borderColor: 'rgba(128,0,32,0.5)', color: 'rgba(255,255,255,0.7)',
            textTransform: 'none', fontWeight: 600, borderRadius: 2,
            '&:hover': { borderColor: '#800020', background: 'rgba(128,0,32,0.1)', color: '#fff' },
          }}
        >
          Download Pass
        </Button>
      </Box>

      {/* ── Pass Card ── */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          ref={passRef}
          sx={{
            width: { xs: '100%', sm: 480 },
            maxWidth: 480,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
            position: 'relative',
          }}
        >
          {/* ── Header band ── */}
          <Box sx={{
            background: 'linear-gradient(135deg, #5a0010 0%, #8b0020 50%, #6e0018 100%)',
            px: 3, py: 2.5,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <Box sx={{ position: 'absolute', right: -40, top: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', right: 20, top: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 1 }}>
              <img
                src="/images/logo-normal.PNG"
                alt="WICE"
                style={{ height: 42, objectFit: 'contain', filter: 'brightness(1.15)' }}
              />
            </Box>

            <Box sx={{ textAlign: 'right', zIndex: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>
                8th Edition
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: '0.05em', lineHeight: 1.2 }}>
                EVENT PASS
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 9.5, letterSpacing: '0.08em' }}>
                WICE BANGLADESH 2026
              </Typography>
            </Box>
          </Box>

          {/* ── Body ── */}
          <Box sx={{
            background: 'linear-gradient(180deg, #12000a 0%, #0d0006 100%)',
            px: 3, py: 3,
            display: 'flex', gap: 3, alignItems: 'flex-start',
          }}>
            {/* Left — holder info */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', mb: 0.5 }}>
                Attendee
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20, lineHeight: 1.2, letterSpacing: '-0.3px' }}>
                {pass.name}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, mt: 0.4, mb: 2.5 }}>
                {pass.email}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <InfoRow label="Pass ID" value={pass.pass_id} mono />
                <InfoRow label="Event" value="WICE Bangladesh 2026" />
                <InfoRow label="Venue" value="Dhaka, Bangladesh" />
                <InfoRow label="Date" value="May 9, 2026" />
                <InfoRow label="Status" value={
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: '13px !important', color: '#10b981 !important' }} />}
                    label="Valid"
                    size="small"
                    sx={{ background: '#10b98118', color: '#10b981', border: '1px solid #10b98130', fontSize: 10.5, height: 22, fontWeight: 700 }}
                  />
                } />
              </Box>
            </Box>

            {/* Right — QR code */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                p: 1.5, borderRadius: 2.5,
                background: '#fff',
                boxShadow: '0 4px 20px rgba(128,0,32,0.3)',
              }}>
                <QRCodeSVG
                  value={verifyUrl}
                  size={100}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#1a0008"
                />
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, textAlign: 'center', letterSpacing: '0.05em' }}>
                Scan to verify
              </Typography>
            </Box>
          </Box>

          {/* ── Perforated divider ── */}
          <Box sx={{
            height: 1,
            background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 8px, transparent 8px, transparent 14px)',
            mx: 3,
          }} />

          {/* ── Footer strip ── */}
          <Box sx={{
            background: 'linear-gradient(180deg, #0d0006 0%, #120009 100%)',
            px: 3, py: 1.8,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              wicebd.com
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[...Array(8)].map((_, i) => (
                <Box key={i} sx={{ width: 3, height: 3, borderRadius: '50%', background: i % 2 === 0 ? 'rgba(128,0,32,0.5)' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.08em' }}>
              Free Entry
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Info below pass */}
      <Paper sx={{ mt: 3, p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', maxWidth: 480, mx: 'auto' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, lineHeight: 1.7, textAlign: 'center' }}>
          Present this pass (digital or printed) at the venue gate. The QR code will be scanned by our team for quick entry verification.
        </Typography>
      </Paper>
    </Box>
  );
};

/* Small helper row */
const InfoRow = ({ label, value, mono = false }) => (
  <Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 9.5, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.15 }}>
      {label}
    </Typography>
    {typeof value === 'string' ? (
      <Typography sx={{ color: '#fff', fontSize: 12.5, fontWeight: 600, fontFamily: mono ? 'monospace' : 'inherit', letterSpacing: mono ? '0.08em' : 'normal' }}>
        {value}
      </Typography>
    ) : value}
  </Box>
);

export default EventPassCard;
