import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, CircularProgress, Paper, Chip, Grid,
  Collapse, TextField, MenuItem as MuiMenuItem, Divider,
} from '@mui/material';
import {
  QrCode2, Download, CheckCircle, Lock, ExpandMore, ExpandLess,
  Person, Group, Edit, Save, WorkspacePremium, Print,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/index';

/* ── Brand ── */
const C = {
  bg:      '#0d0006',
  border:  'rgba(255,255,255,0.07)',
  primary: '#800020',
  accent:  '#c0002a',
  muted:   'rgba(255,255,255,0.38)',
  card:    'rgba(255,255,255,0.04)',
};

const fSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff', borderRadius: '8px', background: 'rgba(255,255,255,0.04)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(128,0,32,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#800020', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c0002a' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.35)' },
};

const MP = {
  PaperProps: {
    sx: {
      background: '#1a000a', border: '1px solid rgba(128,0,32,0.3)',
      '& .MuiMenuItem-root': {
        color: 'rgba(255,255,255,0.8)',
        '&:hover': { background: 'rgba(128,0,32,0.2)' },
      },
    },
  },
};

const TYPE_META = {
  project:         { label: 'Project Competition',    color: '#800020', prefix: 'PRJ' },
  'wall-magazine': { label: 'Wall Magazine',           color: '#10b981', prefix: 'MAG' },
  olympiad:        { label: 'Science Olympiad',        color: '#0f3460', prefix: 'OLY' },
  robo_soccer:     { label: 'Robo Soccer',             color: '#f59e0b', prefix: 'RSC' },
  micromouse:      { label: 'Micromouse Maze-Solving', color: '#6366f1', prefix: 'MCM' },
};

/* ─────────────────────────────────────────────────────────────
   CardRow — label/value inside the ID card visual
   ───────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   IDCardVisual — 3×4 inch portrait printable card
   ───────────────────────────────────────────────────────────── */
const IDCardVisual = ({ member, reg, card }) => {
  const cardRef = useRef(null);
  const meta    = TYPE_META[reg.type] || TYPE_META.project;
  const verifyUrl = card?.qr_data || '';
  const titleLabel = reg.type === 'olympiad' ? 'Institution'
                   : (reg.type === 'robo_soccer' || reg.type === 'micromouse') ? 'Team Name'
                   : 'Project Title';

  /* Capture card as canvas. White bg fills any transparent rounded corners. */
  const captureCanvas = () =>
    import('html2canvas').then(({ default: h2c }) =>
      h2c(cardRef.current, { scale: 4, backgroundColor: '#ffffff', useCORS: true })
    );

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await captureCanvas().catch(() => null);
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `WICE-IDCard-${card.card_uid}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  /* Opens a 3×4 in print window — card fills the page exactly, rest is white */
  const handlePrint = async () => {
    if (!cardRef.current) return;
    const canvas = await captureCanvas().catch(() => null);
    if (!canvas) return;
    const imgData = canvas.toDataURL('image/png');
    const win = window.open('', '_blank', 'width=500,height=700');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>WICE ID Card – ${card.card_uid}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    @page{size:3in 4in portrait;margin:0}
    html,body{width:3in;height:4in;background:#fff;overflow:hidden}
    img{display:block;width:3in;height:4in;object-fit:fill}
  </style>
</head>
<body>
  <img src="${imgData}"/>
  <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}<\/script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <Box>
      {/* Card — 3:4 portrait, 300×400px on screen (scale×4 → 1200×1600 = 300 DPI at 4×4in) */}
      <Box ref={cardRef} sx={{
        width: 300, mx: 'auto',
        height: 400,
        borderRadius: '8px', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: `0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)`,
      }}>
        {/* Header band */}
        <Box sx={{
          background: `linear-gradient(135deg, ${meta.color}ee 0%, ${meta.color} 55%, ${meta.color}cc 100%)`,
          px: 2, py: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', right: -16, top: -16, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <img src="/images/logo-normal.PNG" alt="WICE" style={{ height: 26, objectFit: 'contain', filter: 'brightness(1.15)', position: 'relative', zIndex: 1 }} />
          <Box sx={{ textAlign: 'right', zIndex: 1 }}>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 9.5, letterSpacing: '0.07em', lineHeight: 1.25 }}>
              PARTICIPANT ID CARD
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 6.5, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              WICE Bangladesh 2026 · 8th Ed.
            </Typography>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{
          flex: 1, minHeight: 0,
          background: 'linear-gradient(160deg, #14000c 0%, #0d0006 100%)',
          px: '14px', py: '12px',
          display: 'flex', gap: '12px',
        }}>
          {/* Left: info */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.32)', fontSize: 6.5, letterSpacing: '0.2em', textTransform: 'uppercase', mb: '3px' }}>
              Participant
            </Typography>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 15, lineHeight: 1.2, wordBreak: 'break-word', mb: '3px' }}>
              {member.name}
            </Typography>
            {member.email && (
              <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 7.5, mb: '8px', wordBreak: 'break-all' }}>
                {member.email}
              </Typography>
            )}

            {/* Info rows */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mt: member.email ? 0 : '8px' }}>
              {[
                { label: 'Competition', value: meta.label },
                reg.title ? { label: titleLabel, value: reg.title } : null,
                member.institution ? { label: 'Institution', value: member.institution } : null,
                { label: 'Event', value: 'WICE Bangladesh 2026' },
              ].filter(Boolean).map(({ label, value }) => (
                <Box key={label}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.27)', fontSize: 6, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ color: '#fff', fontSize: 8.5, fontWeight: 700, lineHeight: 1.3, wordBreak: 'break-word' }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* IDs pushed to bottom */}
            <Box sx={{ mt: 'auto', pt: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { label: 'Registration ID', value: reg.reg_id },
                { label: 'Card ID', value: card.card_uid },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.27)', fontSize: 6, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 7.5, fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right: QR + valid badge */}
          <Box sx={{ flexShrink: 0, width: 88, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Box sx={{ p: '8px', borderRadius: '6px', background: '#fff', boxShadow: `0 3px 14px ${meta.color}55` }}>
              <QRCodeSVG value={verifyUrl || 'https://wicebd.com'} size={72} level="H" bgColor="#ffffff" fgColor="#1a0008" />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: 6.5, textAlign: 'center', lineHeight: 1.4 }}>
              Admin scan only
            </Typography>
            <Chip
              icon={<CheckCircle sx={{ fontSize: '9px !important', color: '#10b981 !important' }} />}
              label="Valid" size="small"
              sx={{ background: '#10b98118', color: '#10b981', border: '1px solid #10b98130', fontSize: 7.5, height: 16, fontWeight: 700 }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{
          background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)',
          px: 2, py: '7px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.18)', fontSize: 6.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            wicebd.com
          </Typography>
          <Box sx={{ display: 'flex', gap: '3px' }}>
            {[...Array(8)].map((_, i) => (
              <Box key={i} sx={{ width: 3, height: 3, borderRadius: '50%', background: i % 2 === 0 ? `${meta.color}aa` : 'rgba(255,255,255,0.1)' }} />
            ))}
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.18)', fontSize: 6.5, letterSpacing: '0.08em' }}>
            {meta.prefix} · 8th Ed.
          </Typography>
        </Box>
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
        <Button
          onClick={handlePrint}
          startIcon={<Print sx={{ fontSize: 15 }} />}
          size="small" variant="contained"
          sx={{
            background: `linear-gradient(135deg,${meta.color},${meta.color}cc)`,
            color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: 2, fontSize: 12.5,
            boxShadow: `0 4px 14px ${meta.color}44`,
            '&:hover': { opacity: 0.9 },
          }}
        >
          Print (3×4 in)
        </Button>
        <Button
          onClick={handleDownload}
          startIcon={<Download sx={{ fontSize: 15 }} />}
          size="small" variant="outlined"
          sx={{
            borderColor: `${meta.color}55`, color: 'rgba(255,255,255,0.6)',
            textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: 12.5,
            '&:hover': { borderColor: meta.color, background: `${meta.color}15`, color: '#fff' },
          }}
        >
          Download PNG
        </Button>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────
   MemberProfileForm — inline form to fill family info for a
   team member before their ID card can be generated
   ───────────────────────────────────────────────────────────── */
const GENDER_OPTS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const MemberProfileForm = ({ paymentId, slot, onSaved }) => {
  const [open, setOpen]     = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({
    father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
    guardian_phone: '', address: '', date_of_birth: '', gender: '', class_grade: '',
  });

  /* Load existing data when expanding */
  useEffect(() => {
    if (!open) return;
    api.get(`/api/id-card/member-profile/${paymentId}/${slot}`)
      .then(({ data }) => {
        if (data.success && data.profile) {
          const p = data.profile;
          setForm({
            father_name:        p.father_name        || '',
            father_occupation:  p.father_occupation  || '',
            mother_name:        p.mother_name        || '',
            mother_occupation:  p.mother_occupation  || '',
            guardian_phone:     p.guardian_phone     || '',
            address:            p.address            || '',
            date_of_birth:      p.date_of_birth ? p.date_of_birth.slice(0, 10) : '',
            gender:             p.gender             || '',
            class_grade:        p.class_grade        || '',
          });
        }
      })
      .catch(() => {});
  }, [open, paymentId, slot]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.post('/api/id-card/member-profile', {
        payment_id: paymentId, member_slot: slot, ...form,
      });
      if (data.success) { setOpen(false); onSaved?.(); }
    } catch { /* noop */ }
    finally { setSaving(false); }
  };

  return (
    <Box>
      <Button
        onClick={() => setOpen(o => !o)}
        size="small"
        startIcon={<Edit sx={{ fontSize: 14 }} />}
        endIcon={open ? <ExpandLess sx={{ fontSize: 14 }} /> : <ExpandMore sx={{ fontSize: 14 }} />}
        sx={{
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)',
          color: '#f59e0b', textTransform: 'none', fontWeight: 700, fontSize: 12, borderRadius: 2, px: 1.8, py: 0.7,
          '&:hover': { background: 'rgba(245,158,11,0.18)' },
        }}
      >
        Fill Family Info
      </Button>

      <Collapse in={open}>
        <Box sx={{
          mt: 2, p: 2.5, borderRadius: 2,
          background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)',
        }}>
          <Typography sx={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, mb: 2 }}>
            Family &amp; Personal Information — required before generating ID card
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Father's Name" value={form.father_name}
                onChange={e => set('father_name', e.target.value)} sx={fSx} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Father's Occupation" value={form.father_occupation}
                onChange={e => set('father_occupation', e.target.value)} sx={fSx} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Mother's Name" value={form.mother_name}
                onChange={e => set('mother_name', e.target.value)} sx={fSx} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Mother's Occupation" value={form.mother_occupation}
                onChange={e => set('mother_occupation', e.target.value)} sx={fSx} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Guardian Phone" value={form.guardian_phone}
                onChange={e => set('guardian_phone', e.target.value)} sx={fSx} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Date of Birth" type="date" value={form.date_of_birth}
                onChange={e => set('date_of_birth', e.target.value)} sx={fSx} size="small"
                slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Gender" value={form.gender}
                onChange={e => set('gender', e.target.value)} sx={fSx} size="small"
                slotProps={{ select: { MenuProps: MP } }}>
                {GENDER_OPTS.map(g => <MuiMenuItem key={g} value={g}>{g}</MuiMenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Class / Grade" value={form.class_grade}
                onChange={e => set('class_grade', e.target.value)} sx={fSx} size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Home Address" value={form.address} multiline rows={2}
                onChange={e => set('address', e.target.value)} sx={fSx} size="small" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button size="small" onClick={() => setOpen(false)}
              sx={{ color: C.muted, textTransform: 'none', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              size="small" onClick={handleSave} disabled={saving}
              startIcon={saving ? <CircularProgress size={13} sx={{ color: '#fff' }} /> : <Save sx={{ fontSize: 14 }} />}
              sx={{
                background: 'linear-gradient(135deg,#800020,#c0002a)', color: '#fff',
                textTransform: 'none', fontWeight: 700, fontSize: 12.5, borderRadius: 2, px: 2.5,
                '&:hover': { opacity: 0.9 },
                '&:disabled': { background: 'rgba(128,0,32,0.3)', color: 'rgba(255,255,255,0.4)' },
              }}
            >
              {saving ? 'Saving…' : 'Save Info'}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────
   MemberSlot — one row per team member (or leader)
   ───────────────────────────────────────────────────────────── */
const MemberSlot = ({ member, reg, profileComplete, onGenerated }) => {
  const [loading, setLoading]   = useState(false);
  const [card, setCard]         = useState(member.card);
  const [profDone, setProfDone] = useState(member.profile_completed);
  const [expanded, setExpanded] = useState(false);   // card starts collapsed
  const meta = TYPE_META[reg.type] || TYPE_META.project;
  const isLeader = member.slot === null;

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/id-card/generate', {
        registration_type: reg.type,
        registration_id:   reg.reg_id,
        member_slot:       member.slot,
      });
      if (data.success) { setCard(data.card); setExpanded(true); onGenerated?.(); }
    } catch { /* user can retry */ }
    finally { setLoading(false); }
  };

  /* After saving member profile, mark complete so generate becomes available */
  const handleProfileSaved = () => {
    setProfDone(true);
    onGenerated?.();     // re-fetch parent list
  };

  const canGenerate = isLeader ? profileComplete : profDone;

  return (
    <Box sx={{
      p: 2.5, borderRadius: 2,
      background: isLeader ? `${meta.color}10` : 'rgba(255,255,255,0.025)',
      border: `1px solid ${isLeader ? meta.color + '30' : 'rgba(255,255,255,0.07)'}`,
    }}>
      {/* Member header row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: isLeader ? `linear-gradient(135deg,${meta.color},${meta.color}aa)` : 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isLeader
              ? <Person sx={{ fontSize: 16, color: '#fff' }} />
              : <Group sx={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }} />
            }
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{member.name}</Typography>
              {isLeader && (
                <Chip label="Leader" size="small"
                  sx={{ background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}33`, fontSize: 10, height: 18, fontWeight: 700 }} />
              )}
            </Box>
            {member.institution && (
              <Typography sx={{ color: C.muted, fontSize: 12, mt: 0.2 }}>{member.institution}</Typography>
            )}
            {member.email && (
              <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, mt: 0.1 }}>{member.email}</Typography>
            )}
          </Box>
        </Box>

        {/* Action area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          {card ? (
            /* Card exists — show toggle button */
            <Button
              onClick={() => setExpanded(e => !e)}
              size="small"
              startIcon={<CheckCircle sx={{ fontSize: '14px !important', color: '#10b981 !important' }} />}
              endIcon={expanded
                ? <ExpandLess sx={{ fontSize: 14 }} />
                : <ExpandMore sx={{ fontSize: 14 }} />}
              sx={{
                background: expanded ? '#10b98118' : 'rgba(16,185,129,0.08)',
                border: '1px solid #10b98130',
                color: '#10b981', textTransform: 'none', fontWeight: 700, fontSize: 12,
                borderRadius: 2, px: 1.8, py: 0.7,
                '&:hover': { background: '#10b98122', borderColor: '#10b98150' },
              }}
            >
              {expanded ? 'Hide Card' : 'View ID Card'}
            </Button>
          ) : canGenerate ? (
            <Button
              onClick={generate} disabled={loading} size="small"
              startIcon={loading ? <CircularProgress size={13} sx={{ color: '#fff' }} /> : <QrCode2 sx={{ fontSize: 15 }} />}
              sx={{
                background: `linear-gradient(135deg,${meta.color},${meta.color}cc)`,
                color: '#fff', textTransform: 'none', fontWeight: 700, fontSize: 12,
                borderRadius: 2, px: 1.8, py: 0.7,
                boxShadow: `0 4px 14px ${meta.color}44`,
                '&:hover': { opacity: 0.9 },
                '&:disabled': { background: `${meta.color}44`, color: 'rgba(255,255,255,0.4)' },
              }}
            >
              {loading ? 'Generating…' : 'Generate ID Card'}
            </Button>
          ) : !isLeader ? null : (
            <Chip label="Complete profile first" size="small"
              sx={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', fontSize: 11, fontWeight: 600 }} />
          )}

          {/* Family info form for non-leader members — project/wall-magazine only */}
          {!isLeader && !card && (reg.type === 'project' || reg.type === 'wall-magazine') && (
            <MemberProfileForm paymentId={reg.reg_id} slot={member.slot} onSaved={handleProfileSaved} />
          )}
        </Box>
      </Box>

      {/* Collapsible card visual — unmountOnExit prevents rendering with card=null */}
      <Collapse in={!!(card && expanded)} timeout={300} unmountOnExit>
        <Box sx={{ mt: 2.5 }}>
          {card && <IDCardVisual member={member} reg={reg} card={card} />}
        </Box>
      </Collapse>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────
   RegSlot — one card per registration, expands to show all
   team members for project / wall-magazine registrations
   ───────────────────────────────────────────────────────────── */
const RegSlot = ({ reg, onGenerated, profileComplete }) => {
  const meta    = TYPE_META[reg.type] || TYPE_META.project;
  const members = reg.members || [];
  const leader  = members[0];
  const extras  = members.slice(1);
  const hasTeam = extras.length > 0;

  const totalCards    = members.filter(m => m.card).length;
  const totalMembers  = members.length;

  return (
    <Paper sx={{
      p: 3, borderRadius: 3,
      background: `linear-gradient(135deg,${meta.color}10 0%,${meta.color}04 100%)`,
      border: `1px solid ${meta.color}28`,
    }}>
      {/* Registration header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Chip label={meta.label} size="small"
            sx={{ background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}33`, fontSize: 11, fontWeight: 700, mb: 0.8 }} />
          {reg.title && (
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{reg.title}</Typography>
          )}
          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, mt: 0.4, fontFamily: 'monospace' }}>
            {reg.reg_id}
          </Typography>
        </Box>
        <Chip
          label={`${totalCards} / ${totalMembers} card${totalMembers > 1 ? 's' : ''} generated`}
          size="small"
          sx={{
            background: totalCards === totalMembers ? '#10b98118' : 'rgba(255,255,255,0.06)',
            color: totalCards === totalMembers ? '#10b981' : C.muted,
            border: `1px solid ${totalCards === totalMembers ? '#10b98130' : 'rgba(255,255,255,0.1)'}`,
            fontSize: 11, fontWeight: 700,
          }}
        />
      </Box>

      {/* Member slots */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Leader */}
        {leader && (
          <MemberSlot
            member={leader}
            reg={reg}
            profileComplete={profileComplete}
            onGenerated={onGenerated}
          />
        )}

        {/* Additional team members */}
        {hasTeam && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 0.5 }}>
              <Typography sx={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', px: 1 }}>
                Team Members
              </Typography>
            </Divider>

            {extras.map(m => (
              <MemberSlot
                key={`slot-${m.slot}`}
                member={m}
                reg={reg}
                profileComplete={false}    /* members always need their own form */
                onGenerated={onGenerated}
              />
            ))}
          </>
        )}
      </Box>
    </Paper>
  );
};

/* ─────────────────────────────────────────────────────────────
   IDCardSection — main export
   ───────────────────────────────────────────────────────────── */
const IDCardSection = ({ profileComplete }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
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

  const regs    = data?.registrations || [];
  const hasRegs = regs.length > 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>ID Cards</Typography>
        <Typography sx={{ color: C.muted, fontSize: 13.5, mt: 0.5 }}>
          Generate official WICE Bangladesh 2026 participant ID cards. Team leaders can generate cards for every team member — fill in their family info first.
        </Typography>
      </Box>

      {/* Profile incomplete warning (for leader) */}
      {!profileComplete && (
        <Paper sx={{
          p: 3, mb: 3, borderRadius: 3,
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
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
              Complete Your Profile First
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>
              Your profile must be completed before you can generate your own ID card. Team members' cards require their family info to be filled separately.
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => document.dispatchEvent(new CustomEvent('dashboard:navigate', { detail: 'profile' }))}
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
              background: `linear-gradient(135deg,${C.primary},${C.accent})`,
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
        <Grid container spacing={3}>
          {regs.map(reg => (
            <Grid size={{ xs: 12, lg: 6 }} key={`${reg.type}:${reg.reg_id}`}>
              <RegSlot reg={reg} onGenerated={load} profileComplete={profileComplete} />
            </Grid>
          ))}
        </Grid>
      )}

      {hasRegs && (
        <Paper sx={{ mt: 3, p: 2.5, borderRadius: 3, background: C.card, border: `1px solid ${C.border}` }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.32)', fontSize: 12, lineHeight: 1.7, textAlign: 'center' }}>
            Present your ID card (digital or printed) at the WICE Bangladesh 2026 venue gate. Each team member gets their own unique card with an individual QR code.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default IDCardSection;
