import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, CircularProgress, Paper, Chip, Grid,
} from '@mui/material';
import { QrCode2, Download, CheckCircle, Badge, Lock } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/index';

const C = {
  bg:      '#0d0006',
  border:  'rgba(255,255,255,0.07)',
  primary: '#800020',
  accent:  '#c0002a',
  muted:   'rgba(255,255,255,0.38)',
  card:    'rgba(255,255,255,0.04)',
};

/* ── Small label/value row used inside the card ── */
const CardRow = ({ label, value, mono = false }) => (
  <Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.15 }}>
      {label}
    </Typography>
    {typeof value === 'string' ? (
      <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: mono ? 'monospace' : 'inherit', letterSpacing: mono ? '0.06em' : 'normal', wordBreak: 'break-all' }}>
        {value}
      </Typography>
    ) : value}
  </Box>
);

const TYPE_META = {
  project:         { label: 'Project Competition', color: '#800020', prefix: 'PRJ' },
  'wall-magazine': { label: 'Wall Magazine',        color: '#10b981', prefix: 'MAG' },
  olympiad:        { label: 'Science Olympiad',     color: '#0f3460', prefix: 'OLY' },
};

/* ── Single ID card visual ── */
const IDCardVisual = ({ reg, card }) => {
  const cardRef = useRef(null);
  const meta    = TYPE_META[reg.type] || TYPE_META.project;
  const verifyUrl = card?.qr_data || '';

  const handleDownload = () => {
    if (!cardRef.current) return;
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `WICE-IDCard-${card.card_uid}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }).catch(() => {});
  };

  return (
    <Box>
      {/* Card */}
      <Box
        ref={cardRef}
        sx={{
          width: '100%', maxWidth: 420, mx: 'auto',
          borderRadius: 3, overflow: 'hidden',
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)`,
        }}
      >
        {/* Header band */}
        <Box sx={{
          background: `linear-gradient(135deg, ${meta.color}cc 0%, ${meta.color} 60%, ${meta.color}99 100%)`,
          px: 2.5, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, zIndex: 1 }}>
            <img src="/images/logo-normal.PNG" alt="WICE" style={{ height: 36, objectFit: 'contain', filter: 'brightness(1.2)' }} />
          </Box>
          <Box sx={{ textAlign: 'right', zIndex: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
              8th Edition
            </Typography>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 13, letterSpacing: '0.06em', lineHeight: 1.2 }}>
              PARTICIPANT ID CARD
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 8.5, letterSpacing: '0.08em' }}>
              WICE BANGLADESH 2026
            </Typography>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{
          background: 'linear-gradient(180deg, #12000a 0%, #0d0006 100%)',
          px: 2.5, py: 2.5,
          display: 'flex', gap: 2.5, alignItems: 'flex-start',
        }}>
          {/* Left */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', mb: 0.4 }}>
              Participant
            </Typography>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 17, lineHeight: 1.2, letterSpacing: '-0.2px', wordBreak: 'break-word' }}>
              {reg.name}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, mt: 0.3, mb: 2 }}>
              {reg.email}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <CardRow label="Competition" value={meta.label} />
              {reg.title && <CardRow label={reg.type === 'olympiad' ? 'Institution' : 'Project / Title'} value={reg.title} />}
              <CardRow label="Registration ID" value={reg.reg_id} mono />
              <CardRow label="Card ID" value={card.card_uid} mono />
              <CardRow label="Event" value="WICE Bangladesh 2026" />
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.15 }}>
                  Status
                </Typography>
                <Chip
                  icon={<CheckCircle sx={{ fontSize: '12px !important', color: '#10b981 !important' }} />}
                  label="Valid"
                  size="small"
                  sx={{ background: '#10b98118', color: '#10b981', border: '1px solid #10b98130', fontSize: 10, height: 20, fontWeight: 700 }}
                />
              </Box>
            </Box>
          </Box>

          {/* Right — QR */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Box sx={{ p: 1.2, borderRadius: 2, background: '#fff', boxShadow: `0 4px 16px ${meta.color}44` }}>
              <QRCodeSVG value={verifyUrl || 'https://wicebd.com'} size={90} level="M" bgColor="#ffffff" fgColor="#1a0008" />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: 8.5, textAlign: 'center', letterSpacing: '0.04em' }}>
              Scan to verify
            </Typography>
          </Box>
        </Box>

        {/* Footer strip */}
        <Box sx={{
          background: 'rgba(255,255,255,0.03)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          px: 2.5, py: 1.2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.18)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            wicebd.com
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[...Array(8)].map((_, i) => (
              <Box key={i} sx={{ width: 3, height: 3, borderRadius: '50%', background: i % 2 === 0 ? `${meta.color}88` : 'rgba(255,255,255,0.1)' }} />
            ))}
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.18)', fontSize: 9, letterSpacing: '0.08em' }}>
            {meta.prefix} · 8th Ed.
          </Typography>
        </Box>
      </Box>

      {/* Download button */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          onClick={handleDownload}
          startIcon={<Download sx={{ fontSize: 16 }} />}
          size="small"
          variant="outlined"
          sx={{
            borderColor: `${meta.color}66`, color: 'rgba(255,255,255,0.6)',
            textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: 12.5,
            '&:hover': { borderColor: meta.color, background: `${meta.color}15`, color: '#fff' },
          }}
        >
          Download ID Card
        </Button>
      </Box>
    </Box>
  );
};

/* ── Registration slot (one per reg) ── */
const RegSlot = ({ reg, onGenerated, profileComplete }) => {
  const [loading, setLoading] = useState(false);
  const [card, setCard]       = useState(reg.card);
  const meta = TYPE_META[reg.type] || TYPE_META.project;

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/id-card/generate', {
        registration_type: reg.type,
        registration_id:   reg.reg_id,
      });
      if (data.success) {
        setCard(data.card);
        onGenerated?.();
      }
    } catch {
      // silently fail — user can retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{
      p: 3, borderRadius: 3,
      background: `linear-gradient(135deg, ${meta.color}10 0%, ${meta.color}04 100%)`,
      border: `1px solid ${meta.color}28`,
    }}>
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Chip
            label={meta.label}
            size="small"
            sx={{ background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}33`, fontSize: 11, fontWeight: 700, mb: 0.8 }}
          />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{reg.name}</Typography>
          {reg.title && (
            <Typography sx={{ color: C.muted, fontSize: 12.5, mt: 0.3 }}>{reg.title}</Typography>
          )}
          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, mt: 0.5, fontFamily: 'monospace' }}>
            {reg.reg_id}
          </Typography>
        </Box>
        {card ? (
          <Chip
            icon={<CheckCircle sx={{ fontSize: '13px !important', color: '#10b981 !important' }} />}
            label="Card Generated"
            size="small"
            sx={{ background: '#10b98118', color: '#10b981', border: '1px solid #10b98130', fontSize: 11, fontWeight: 700 }}
          />
        ) : profileComplete ? (
          <Button
            onClick={generate}
            disabled={loading}
            size="small"
            startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <QrCode2 sx={{ fontSize: 16 }} />}
            sx={{
              background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
              color: '#fff', textTransform: 'none', fontWeight: 700, fontSize: 12.5,
              borderRadius: 2, px: 2, py: 0.9,
              boxShadow: `0 4px 14px ${meta.color}44`,
              '&:hover': { opacity: 0.9 },
              '&:disabled': { background: `${meta.color}44`, color: 'rgba(255,255,255,0.4)' },
            }}
          >
            {loading ? 'Generating…' : 'Generate ID Card'}
          </Button>
        ) : (
          <Chip
            label="Complete profile first"
            size="small"
            sx={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', fontSize: 11, fontWeight: 600 }}
          />
        )}
      </Box>

      {/* Show card if generated */}
      {card && <IDCardVisual reg={reg} card={card} />}
    </Paper>
  );
};

/* ── Main section ── */
const IDCardSection = ({ user, profileComplete }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/api/id-card/my-cards')
      .then(({ data: d }) => { if (d.success) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress sx={{ color: C.primary }} />
    </Box>
  );

  const regs = data?.registrations || [];
  const hasRegs = regs.length > 0;

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>ID Cards</Typography>
        <Typography sx={{ color: C.muted, fontSize: 13.5, mt: 0.5 }}>
          Generate your official WICE Bangladesh 2026 participant ID card for each competition you've registered in.
        </Typography>
      </Box>

      {/* Profile incomplete gate */}
      {!profileComplete && (
        <Paper sx={{
          p: 3, mb: 3, borderRadius: 3,
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap',
        }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2, flexShrink: 0,
            background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontSize: 20 }}>⚠️</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography sx={{ color: '#f59e0b', fontWeight: 700, fontSize: 14, mb: 0.3 }}>
              Profile Incomplete — Required Before Generating ID Card
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>
              You must complete your profile (personal &amp; family information) before you can generate a participant ID card. This ensures your card displays accurate details.
            </Typography>
          </Box>
          <Button
            component="a" href="#profile"
            onClick={(e) => { e.preventDefault(); document.dispatchEvent(new CustomEvent('dashboard:navigate', { detail: 'profile' })); }}
            size="small"
            sx={{
              background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)',
              color: '#f59e0b', textTransform: 'none', fontWeight: 700,
              fontSize: 12.5, borderRadius: 2, px: 2.5, py: 1,
              '&:hover': { background: 'rgba(245,158,11,0.25)' },
            }}
          >
            Complete Profile →
          </Button>
        </Paper>
      )}

      {!hasRegs ? (
        /* No registrations */
        <Paper sx={{ p: 6, borderRadius: 3, background: C.card, border: `1px solid ${C.border}`, textAlign: 'center' }}>
          <Lock sx={{ fontSize: 56, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 17, mb: 1 }}>
            Registration Required
          </Typography>
          <Typography sx={{ color: C.muted, fontSize: 13.5, mb: 3, maxWidth: 400, mx: 'auto', lineHeight: 1.7 }}>
            ID cards are exclusively for registered WICE participants. Register for the Project Competition, Wall Magazine, or Science Olympiad to get your card.
          </Typography>
          <Button
            component="a" href="/registration"
            sx={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
              color: '#fff', textTransform: 'none', fontWeight: 700,
              fontSize: 14, borderRadius: 2, px: 4, py: 1.3,
              boxShadow: '0 6px 20px rgba(128,0,32,0.4)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            Register Now
          </Button>
        </Paper>
      ) : (
        /* Registration slots */
        <Grid container spacing={3}>
          {regs.map(reg => (
            <Grid size={{ xs: 12, lg: 6 }} key={`${reg.type}:${reg.reg_id}`}>
              <RegSlot reg={reg} onGenerated={load} profileComplete={profileComplete} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Info note */}
      {hasRegs && (
        <Paper sx={{ mt: 3, p: 2.5, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.32)', fontSize: 12, lineHeight: 1.7, textAlign: 'center' }}>
            Present your ID card (digital or printed) at the WICE Bangladesh 2026 venue gate. Each competition registration generates a unique card with its own QR code.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default IDCardSection;
