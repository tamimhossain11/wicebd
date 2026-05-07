import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, CircularProgress, Alert,
  TextField, Chip, Avatar, Divider, Drawer, IconButton,
  Collapse, Tooltip, LinearProgress, InputAdornment,
  useMediaQuery, useTheme, Tab, Tabs,
} from '@mui/material';
import {
  Gavel, Logout, Menu as MenuIcon, Close, CheckCircle,
  Save, Person, Groups, EmojiEvents, Refresh, Notes,
  Search, Add, Remove, RadioButtonUnchecked, School,
  ArrowBack,
} from '@mui/icons-material';
import { useJudgeAuth } from '../../context/JudgeAuthContext';
import api from '../../api/index';
import { toast } from 'react-toastify';

/* ── Design tokens ─────────────────────────────────────────────── */
const BG      = '#060612';
const SURFACE = '#0c0c1e';
const CARD    = '#10102a';
const BORDER  = 'rgba(255,255,255,0.07)';
const ACCENT  = '#800020';
const GREEN   = '#10b981';
const AMBER   = '#f59e0b';
const CYAN    = '#06b6d4';
const PURPLE  = '#8b5cf6';
const RED     = '#ef4444';

const CATEGORY_ORDER  = ['Elementary', 'High School', 'college', 'University'];
const CATEGORY_LABELS = {
  Elementary: 'Elementary', 'Primary School': 'Elementary',
  'High School': 'High School', college: 'College', University: 'University',
};

const FIELDS = [
  { key: 'urgency',      label: 'Urgency',      max: 30, color: AMBER,  desc: 'How urgent is the problem being addressed?' },
  { key: 'visibility',   label: 'Visibility',   max: 20, color: CYAN,   desc: 'How visible and impactful is the solution?' },
  { key: 'relevance',    label: 'Relevance',    max: 30, color: PURPLE, desc: 'How relevant to the competition theme?' },
  { key: 'presentation', label: 'Presentation', max: 20, color: GREEN,  desc: 'Quality of delivery and communication?' },
];

const scoreColor = (v) =>
  v === null ? 'rgba(255,255,255,0.2)'
  : v >= 91  ? '#FFD700'
  : v >= 81  ? '#94a3b8'
  : v >= 71  ? '#CD7F32'
  : v >= 60  ? CYAN
  : RED;

const scoreLabel = (v) =>
  v === null ? '' : v >= 91 ? 'Gold' : v >= 81 ? 'Silver' : v >= 71 ? 'Bronze' : v >= 60 ? 'Honorable' : 'Below';

/* ── Single scoring criterion row ──────────────────────────────── */
const ScoringField = ({ field, value, onChange }) => {
  const num   = parseFloat(value);
  const valid = value !== '' && !isNaN(num) && num >= 0 && num <= field.max;
  const pct   = valid ? (num / field.max) * 100 : 0;
  const err   = value !== '' && !isNaN(num) && (num < 0 || num > field.max);

  const step = (delta) => {
    const base = valid ? num : delta > 0 ? 0 : field.max;
    onChange(String(Math.min(field.max, Math.max(0, parseFloat((base + delta).toFixed(1))))));
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      {/* Label row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', background: field.color, flexShrink: 0 }} />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1 }}>{field.label}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, display: { xs: 'none', sm: 'block' } }}>
            — {field.desc}
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }}>
          max {field.max}
        </Typography>
      </Box>

      {/* Input row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" onClick={() => step(-1)}
          sx={{ color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.06)', borderRadius: 1.5, width: 36, height: 36,
            '&:hover': { background: `${field.color}20`, color: field.color } }}>
          <Remove sx={{ fontSize: 17 }} />
        </IconButton>

        <TextField
          size="small" type="number" value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`0–${field.max}`}
          inputProps={{ min: 0, max: field.max, step: 0.5,
            style: { textAlign: 'center', fontWeight: 800, fontSize: 18,
              color: err ? RED : valid ? field.color : 'rgba(255,255,255,0.6)', padding: '8px 4px' } }}
          sx={{ flex: 1,
            '& .MuiOutlinedInput-root': {
              background: err ? `${RED}08` : valid ? `${field.color}08` : 'rgba(255,255,255,0.04)',
              borderRadius: 2,
              '& fieldset': { borderColor: err ? `${RED}60` : valid ? `${field.color}50` : 'rgba(255,255,255,0.1)', borderWidth: valid ? 1.5 : 1 },
              '&:hover fieldset': { borderColor: `${field.color}80` },
              '&.Mui-focused fieldset': { borderColor: field.color },
            },
          }}
        />

        <IconButton size="small" onClick={() => step(1)}
          sx={{ color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.06)', borderRadius: 1.5, width: 36, height: 36,
            '&:hover': { background: `${field.color}20`, color: field.color } }}>
          <Add sx={{ fontSize: 17 }} />
        </IconButton>

        <Box sx={{ minWidth: 44, textAlign: 'right' }}>
          {valid
            ? <Typography sx={{ color: field.color, fontWeight: 700, fontSize: 13 }}>{Math.round(pct)}%</Typography>
            : <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>—</Typography>}
        </Box>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mt: 0.75, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${pct}%`, borderRadius: 2,
          background: `linear-gradient(90deg, ${field.color}aa, ${field.color})`,
          transition: 'width 0.25s ease' }} />
      </Box>
    </Box>
  );
};

/* ── Team card ──────────────────────────────────────────────────── */
const TeamCard = ({ team, isOpen, onToggle, onMarkSave, searchQuery }) => {
  const [fields, setFields] = useState({
    urgency:      team.my_urgency      !== null ? String(team.my_urgency)      : '',
    visibility:   team.my_visibility   !== null ? String(team.my_visibility)   : '',
    relevance:    team.my_relevance    !== null ? String(team.my_relevance)    : '',
    presentation: team.my_presentation !== null ? String(team.my_presentation) : '',
  });
  const [notes, setNotes]   = useState(team.my_notes || '');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(team.my_marks !== null);
  const [showNotes, setShowNotes] = useState(false);
  const cardRef = useRef(null);

  const parsed = {};
  let allValid = true;
  FIELDS.forEach(f => {
    const n = parseFloat(fields[f.key]);
    if (fields[f.key] === '' || isNaN(n) || n < 0 || n > f.max) { allValid = false; parsed[f.key] = null; }
    else parsed[f.key] = n;
  });
  const total = allValid ? FIELDS.reduce((s, f) => s + parsed[f.key], 0) : null;

  const handleChange = (key, v) => { setFields(p => ({ ...p, [key]: v })); setSaved(false); };

  const handleSave = async () => {
    if (!allValid) return toast.error('Fill all fields within their valid ranges');
    setSaving(true);
    try {
      await api.post('/api/judge/marks', {
        registration_id: team.registration_id,
        urgency: parsed.urgency, visibility: parsed.visibility,
        relevance: parsed.relevance, presentation: parsed.presentation,
        notes, competition_type: team.competition_type,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('judgeToken')}` } });
      setSaved(true);
      toast.success('Marks saved!');
      onMarkSave(team.registration_id, total);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  // Scroll into view when opened
  useEffect(() => {
    if (isOpen && cardRef.current) {
      setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [isOpen]);

  const members = [team.member2, team.member3, team.member4, team.member5, team.member6].filter(Boolean);
  const initials = (team.team_name || '?').slice(0, 2).toUpperCase();

  // Highlight matching text
  const highlight = (text) => {
    if (!searchQuery || !text) return text;
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return text;
    return (
      <>{text.slice(0, idx)}<mark style={{ background: `${AMBER}40`, color: AMBER, borderRadius: 2, padding: '0 1px' }}>{text.slice(idx, idx + searchQuery.length)}</mark>{text.slice(idx + searchQuery.length)}</>
    );
  };

  return (
    <Paper ref={cardRef} sx={{
      borderRadius: 3, overflow: 'hidden',
      border: `1px solid ${isOpen ? ACCENT + '60' : saved ? GREEN + '25' : BORDER}`,
      background: isOpen ? 'rgba(128,0,32,0.06)' : CARD,
      transition: 'all 0.2s ease',
      boxShadow: isOpen ? `0 0 0 1px ${ACCENT}30, 0 4px 24px rgba(128,0,32,0.15)` : 'none',
    }}>
      {/* ── Collapsed header ── */}
      <Box onClick={onToggle} sx={{
        p: { xs: '14px 16px', sm: '14px 20px' }, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 },
        '&:hover': { background: 'rgba(255,255,255,0.03)' },
        userSelect: 'none',
      }}>
        <Avatar sx={{ width: 42, height: 42, fontWeight: 800, fontSize: 15, flexShrink: 0,
          background: saved ? `linear-gradient(135deg,${GREEN}80,${GREEN}40)` : isOpen ? `linear-gradient(135deg,${ACCENT},#4f0014)` : 'rgba(255,255,255,0.06)',
          border: `2px solid ${saved ? GREEN + '40' : isOpen ? ACCENT + '60' : 'transparent'}`,
          color: saved ? GREEN : isOpen ? '#fff' : 'rgba(255,255,255,0.5)',
        }}>
          {saved ? <CheckCircle sx={{ fontSize: 20 }} /> : initials}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {highlight(team.team_name)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mt: 0.25 }}>
            {team.leader_name && team.leader_name !== team.team_name && (
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                {highlight(team.leader_name)}
              </Typography>
            )}
            {team.leader_name && team.leader_name !== team.team_name && team.institution && (
              <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>·</Typography>
            )}
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: { xs: 140, sm: 280 } }}>
              {highlight(team.institution)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
          {team.judge_count > 0 && (
            <Chip label={`${team.judge_count}J`} size="small"
              sx={{ height: 20, fontSize: 10, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)',
                '& .MuiChip-label': { px: 0.75 } }} />
          )}
          {saved && total !== null ? (
            <Box sx={{ textAlign: 'center', minWidth: 48 }}>
              <Typography sx={{ color: scoreColor(total), fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{total}</Typography>
              <Typography sx={{ color: scoreColor(total), fontSize: 9, fontWeight: 700, opacity: 0.8, letterSpacing: '0.05em' }}>
                {scoreLabel(total)}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid rgba(255,255,255,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Expanded marking panel ── */}
      <Collapse in={isOpen}>
        <Box sx={{ borderTop: `1px solid ${BORDER}` }}>
          {/* Team detail strip */}
          <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2, pb: 1.5 }}>
            {team.project_title && team.project_title !== team.team_name && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5,
                p: 1.25, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>Project</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontStyle: 'italic' }}>
                  "{highlight(team.project_title)}"
                </Typography>
              </Box>
            )}
            {members.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                <Chip icon={<Person sx={{ fontSize: '12px !important' }} />}
                  label={`Leader: ${team.leader_name || team.team_name}`} size="small"
                  sx={{ background: `${ACCENT}15`, color: '#ff8fa3', border: `1px solid ${ACCENT}30`, fontSize: 11 }} />
                {members.map((m, i) => (
                  <Chip key={i} icon={<Person sx={{ fontSize: '12px !important' }} />} label={m} size="small"
                    sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                ))}
              </Box>
            )}
          </Box>

          {/* Scoring section */}
          <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 1.5,
            background: 'rgba(0,0,0,0.15)', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
            pt: 2 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', mb: 2 }}>
              Score this team
            </Typography>
            {FIELDS.map(f => (
              <ScoringField key={f.key} field={f} value={fields[f.key]} onChange={v => handleChange(f.key, v)} />
            ))}

            {/* Total score display */}
            <Box sx={{ mt: 1, p: 2, borderRadius: 2.5, textAlign: 'center',
              background: total !== null ? `${scoreColor(total)}10` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${total !== null ? scoreColor(total) + '30' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.3s ease' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                Total Score
              </Typography>
              <Typography sx={{ color: total !== null ? scoreColor(total) : 'rgba(255,255,255,0.2)', fontWeight: 900, fontSize: 40, lineHeight: 1 }}>
                {total !== null ? total.toFixed(1) : '—'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, mt: 0.25 }}>/&nbsp;100</Typography>
              {total !== null && (
                <Chip label={scoreLabel(total)} size="small" sx={{ mt: 1,
                  background: `${scoreColor(total)}20`, color: scoreColor(total),
                  border: `1px solid ${scoreColor(total)}40`, fontWeight: 700, fontSize: 11 }} />
              )}
            </Box>
          </Box>

          {/* Notes + Save */}
          <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: showNotes ? 1.5 : 0 }}>
              <Button
                variant="text" size="small"
                startIcon={<Notes sx={{ fontSize: 16 }} />}
                onClick={() => setShowNotes(p => !p)}
                sx={{ color: showNotes ? AMBER : 'rgba(255,255,255,0.35)', textTransform: 'none', fontSize: 12,
                  '&:hover': { color: AMBER, background: `${AMBER}10` } }}>
                {showNotes ? 'Hide notes' : 'Add notes'}
              </Button>
            </Box>

            <Collapse in={showNotes}>
              <TextField fullWidth label="Notes (optional)" multiline rows={2} size="small"
                value={notes} onChange={e => setNotes(e.target.value)}
                sx={{ mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff', background: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                    '&:hover fieldset': { borderColor: `${AMBER}60` },
                    '&.Mui-focused fieldset': { borderColor: AMBER },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: AMBER },
                }} />
            </Collapse>

            <Button fullWidth variant="contained" size="large"
              onClick={handleSave} disabled={saving || !allValid}
              startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : saved ? <CheckCircle /> : <Save />}
              sx={{ borderRadius: 2.5, fontWeight: 700, fontSize: 15, py: 1.4, textTransform: 'none',
                background: saved ? `linear-gradient(135deg, ${GREEN}, #059669)` : !allValid ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${ACCENT}, #4f0014)`,
                '&:hover': { background: saved ? '#059669' : `linear-gradient(135deg, #a00028, #600018)` },
                '&:disabled': { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' },
                boxShadow: (!allValid || saving) ? 'none' : saved ? `0 4px 16px ${GREEN}40` : `0 4px 16px ${ACCENT}50`,
              }}>
              {saving ? 'Saving…' : saved ? 'Update Marks' : 'Submit Marks'}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

/* ── Main Dashboard ─────────────────────────────────────────────── */
const JudgeDashboard = () => {
  const navigate   = useNavigate();
  const { judge, logoutJudge } = useJudgeAuth();
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [grouped,    setGrouped]    = useState({});
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [refresh,    setRefresh]    = useState(0);
  const [search,     setSearch]     = useState('');
  const [filterTab,  setFilterTab]  = useState(0);   // 0=all 1=pending 2=marked
  const [openTeam,   setOpenTeam]   = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const token = localStorage.getItem('judgeToken');

  const fetchTeams = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/api/judge/teams', { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) { setGrouped(data.grouped); }
    } catch (e) { setError(e.response?.data?.message || 'Failed to load teams'); }
    finally { setLoading(false); }
  }, [token, refresh]);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const handleLogout = () => { logoutJudge(); navigate('/judge/login'); };

  /* Derived data */
  const allTeams = Object.values(grouped).flat();
  const totalTeams  = allTeams.length;
  const markedTeams = allTeams.filter(t => t.my_marks !== null).length;
  const progress    = totalTeams > 0 ? Math.round((markedTeams / totalTeams) * 100) : 0;

  const orderedCategories = [
    ...CATEGORY_ORDER.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !CATEGORY_ORDER.includes(c)),
  ];

  /* Filtered + searched team list */
  const searchLower = search.trim().toLowerCase();
  const getFilteredTeams = (teams) => {
    return teams.filter(t => {
      const matchSearch = !searchLower || [
        t.team_name, t.leader_name, t.institution, t.project_title,
        t.member2, t.member3, t.member4, t.member5, t.member6,
      ].some(f => f?.toLowerCase().includes(searchLower));

      const matchFilter =
        filterTab === 0 ? true :
        filterTab === 1 ? t.my_marks === null :
        t.my_marks !== null;

      return matchSearch && matchFilter;
    });
  };

  const isSearching   = searchLower.length > 0 || filterTab !== 0 || activeCategory !== null;
  const teamsToShow   = isSearching
    ? orderedCategories.flatMap(cat => {
        if (activeCategory && cat !== activeCategory) return [];
        return getFilteredTeams(grouped[cat] || []).map(t => ({ ...t, _cat: cat }));
      })
    : null;

  const pendingCount = allTeams.filter(t => t.my_marks === null).length;
  const markedCount  = markedTeams;

  const toggleTeam = (id) => setOpenTeam(p => p === id ? null : id);

  /* ── Sidebar content ── */
  const SidebarContent = () => (
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', minHeight: isMobile ? '100vh' : 'auto' }}>
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 3, background: `linear-gradient(135deg, ${ACCENT}, #4f0014)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${ACCENT}50` }}>
          <Gavel sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>Judge Portal</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, mt: 0.25 }}>8th WICEBD</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: BORDER, mb: 2.5 }} />

      {/* Judge info */}
      <Box sx={{ p: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 2.5, border: `1px solid ${BORDER}`, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 38, height: 38, background: `${ACCENT}30`, color: '#ff8fa3', fontWeight: 700, fontSize: 15 }}>
            {(judge?.name || '?')[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{judge?.name}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 11 }}>@{judge?.username}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          <Chip label={judge?.judge_type === 'wall_magazine' ? '📰 Wall Magazine' : '🔬 Project'} size="small"
            sx={{ background: `${ACCENT}20`, color: '#ff8fa3', border: `1px solid ${ACCENT}40`, fontSize: 11 }} />
          {judge?.subcategory && (
            <Chip label={judge.subcategory} size="small"
              sx={{ background: 'rgba(108,99,255,0.15)', color: '#a5b4fc', border: '1px solid rgba(108,99,255,0.3)', fontSize: 11 }} />
          )}
        </Box>
      </Box>

      {/* Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>Marking Progress</Typography>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{markedTeams}/{totalTeams}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress}
          sx={{ borderRadius: 2, height: 8, background: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': { background: progress === 100 ? `linear-gradient(90deg,${GREEN},#059669)` : `linear-gradient(90deg,${ACCENT},#ff6b6b)`, borderRadius: 2 } }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{progress}% complete</Typography>
          {pendingCount > 0 && (
            <Typography sx={{ color: AMBER, fontSize: 11, fontWeight: 600 }}>{pendingCount} pending</Typography>
          )}
        </Box>
      </Box>

      {/* Category nav */}
      {orderedCategories.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5, fontWeight: 700 }}>
            Categories
          </Typography>
          {orderedCategories.map(cat => {
            const catTeams = grouped[cat] || [];
            const catDone  = catTeams.filter(t => t.my_marks !== null).length;
            const catDonePct = catTeams.length ? Math.round((catDone / catTeams.length) * 100) : 0;
            const isActive = activeCategory === cat;
            return (
              <Box key={cat} onClick={() => { setActiveCategory(isActive ? null : cat); setFilterTab(0); setSearch(''); if (isMobile) setDrawerOpen(false); }}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: '10px 12px', mb: 0.5, borderRadius: 2, cursor: 'pointer',
                  background: isActive ? `${ACCENT}25` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? ACCENT + '50' : BORDER}`,
                  '&:hover': { background: isActive ? `${ACCENT}30` : 'rgba(255,255,255,0.06)' },
                  transition: 'all 0.15s ease',
                }}>
                <Typography sx={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: isActive ? 700 : 500 }}>
                  {CATEGORY_LABELS[cat] || cat}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ color: catDone === catTeams.length ? GREEN : 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600 }}>
                    {catDone}/{catTeams.length}
                  </Typography>
                  {catDone === catTeams.length && catTeams.length > 0 && (
                    <CheckCircle sx={{ fontSize: 14, color: GREEN }} />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${BORDER}` }}>
        <Button fullWidth variant="text" onClick={handleLogout} startIcon={<Logout />}
          sx={{ justifyContent: 'flex-start', color: 'rgba(255,100,100,0.7)', borderRadius: 2,
            textTransform: 'none', fontWeight: 600, '&:hover': { background: 'rgba(220,38,38,0.1)', color: '#fc8181' } }}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  /* ── Render a group of teams ── */
  const renderTeamList = (teams) => {
    if (teams.length === 0) return (
      <Paper sx={{ p: 4, textAlign: 'center', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 3 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
          {search ? 'No teams match your search' : filterTab === 1 ? 'All teams marked! 🎉' : 'No teams found'}
        </Typography>
      </Paper>
    );
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {teams.map(t => (
          <TeamCard key={t.registration_id} team={t}
            isOpen={openTeam === t.registration_id}
            onToggle={() => toggleTeam(t.registration_id)}
            searchQuery={searchLower}
            onMarkSave={(id, marks) => {
              const newGrouped = { ...grouped };
              Object.keys(newGrouped).forEach(cat => {
                newGrouped[cat] = newGrouped[cat].map(tm =>
                  tm.registration_id === id ? { ...tm, my_marks: marks } : tm
                );
              });
              setGrouped(newGrouped);
            }}
          />
        ))}
      </Box>
    );
  };

  /* ── Main render ── */
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: BG }}>

      {/* Desktop sidebar */}
      {!isMobile && (
        <Box sx={{ width: 280, flexShrink: 0, background: SURFACE, borderRight: `1px solid ${BORDER}`,
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
          <SidebarContent />
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, background: SURFACE, borderRight: `1px solid ${BORDER}` } }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}><Close /></IconButton>
        </Box>
        <SidebarContent />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, maxWidth: 860, mx: 'auto', width: '100%', pb: 6 }}>

        {/* Sticky top bar */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10,
          background: `${BG}f0`, backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${BORDER}`, px: { xs: 2, sm: 3 }, py: 1.5 }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} size="small"
                sx={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}

            {/* Search */}
            <TextField
              placeholder="Search teams, leaders, institutions…" size="small"
              value={search} onChange={e => { setSearch(e.target.value); setOpenTeam(null); }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} /></InputAdornment>,
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')} sx={{ color: 'rgba(255,255,255,0.3)' }}>
                      <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{ flex: 1,
                '& .MuiOutlinedInput-root': {
                  color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: 2.5,
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: `${ACCENT}80` },
                },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.25)', fontSize: 13 },
              }}
            />

            <Tooltip title="Refresh">
              <IconButton onClick={() => setRefresh(p => p + 1)} size="small"
                sx={{ color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.05)', borderRadius: 2,
                  '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>
                <Refresh sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {!isMobile && (
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} size="small"
                  sx={{ color: 'rgba(255,100,100,0.6)', background: 'rgba(255,0,0,0.05)', borderRadius: 2,
                    '&:hover': { color: '#fc8181', background: 'rgba(255,0,0,0.1)' } }}>
                  <Logout sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 3 }}>

          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: 20, sm: 26 }, lineHeight: 1.2 }}>
              {judge?.judge_type === 'wall_magazine' ? 'Wall Magazine' : (judge?.subcategory || 'Project')}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, mt: 0.5 }}>
              Score each team across 4 criteria · Total 100 marks
            </Typography>
          </Box>

          {/* Stats row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1.5, mb: 3 }}>
            {[
              { label: 'Total', value: totalTeams, color: '#6c63ff', icon: <Groups sx={{ fontSize: 20, color: '#6c63ff' }} /> },
              { label: 'Marked', value: markedCount, color: GREEN, icon: <CheckCircle sx={{ fontSize: 20, color: GREEN }} /> },
              { label: 'Pending', value: pendingCount, color: AMBER, icon: <RadioButtonUnchecked sx={{ fontSize: 20, color: AMBER }} /> },
            ].map(c => (
              <Paper key={c.label} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2.5, background: CARD, border: `1px solid ${BORDER}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>{c.icon}
                  <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{c.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{c.value}</Typography>
              </Paper>
            ))}
          </Box>

          {/* Progress bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2.5, background: CARD, border: `1px solid ${BORDER}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>
                {activeCategory ? `${CATEGORY_LABELS[activeCategory] || activeCategory} — marking progress` : 'Overall progress'}
              </Typography>
              <Typography sx={{ color: progress === 100 ? GREEN : '#fff', fontWeight: 700, fontSize: 12 }}>
                {progress === 100 ? '✓ Complete!' : `${progress}%`}
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress}
              sx={{ borderRadius: 2, height: 7, background: 'rgba(255,255,255,0.07)',
                '& .MuiLinearProgress-bar': { background: progress === 100 ? `linear-gradient(90deg,${GREEN},#059669)` : `linear-gradient(90deg,${ACCENT},#ff6b6b)`, borderRadius: 2 } }} />
          </Paper>

          {/* Active category pill */}
          {activeCategory && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<School sx={{ fontSize: '14px !important' }} />}
                label={CATEGORY_LABELS[activeCategory] || activeCategory}
                onDelete={() => setActiveCategory(null)}
                deleteIcon={<Close sx={{ fontSize: '14px !important' }} />}
                sx={{ background: `${ACCENT}25`, color: '#fff', border: `1px solid ${ACCENT}50`, fontWeight: 700 }}
              />
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                {(grouped[activeCategory] || []).length} teams
              </Typography>
            </Box>
          )}

          {/* Filter tabs */}
          <Box sx={{ mb: 2.5 }}>
            <Tabs value={filterTab} onChange={(_, v) => { setFilterTab(v); setOpenTeam(null); }}
              sx={{ minHeight: 38,
                '& .MuiTabs-indicator': { background: ACCENT, height: 2.5, borderRadius: 2 },
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, textTransform: 'none', minHeight: 38, py: 0.5, px: 2 },
                '& .Mui-selected': { color: '#fff !important' },
                '& .MuiTabs-flexContainer': { gap: 0.5 },
              }}>
              <Tab label={`All  (${totalTeams})`} />
              <Tab label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: pendingCount > 0 ? AMBER : 'rgba(255,255,255,0.2)' }} />
                  Pending ({pendingCount})
                </Box>
              } />
              <Tab label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: markedCount > 0 ? GREEN : 'rgba(255,255,255,0.2)' }} />
                  Marked ({markedCount})
                </Box>
              } />
            </Tabs>
          </Box>

          {/* Team list */}
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
              <CircularProgress sx={{ color: ACCENT }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Loading teams…</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ background: 'rgba(220,38,38,0.12)', color: '#fca5a5', borderRadius: 2 }}>{error}</Alert>
          ) : totalTeams === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 3 }}>
              <EmojiEvents sx={{ color: 'rgba(255,255,255,0.1)', fontSize: 64, mb: 2 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>No teams assigned to you yet</Typography>
            </Paper>
          ) : isSearching ? (
            /* Search / filtered view — flat list */
            (() => {
              const results = teamsToShow;
              if (results.length === 0) return (
                <Paper sx={{ p: 5, textAlign: 'center', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 3 }}>
                  <Search sx={{ color: 'rgba(255,255,255,0.15)', fontSize: 48, mb: 1.5 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
                    {filterTab === 1 ? 'All teams marked! 🎉' : 'No teams match your search'}
                  </Typography>
                </Paper>
              );
              /* Group by category for display */
              const grouped2 = {};
              results.forEach(t => {
                const key = t._cat || 'Other';
                if (!grouped2[key]) grouped2[key] = [];
                grouped2[key].push(t);
              });
              return (
                <Box>
                  {search && (
                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, mb: 1.5 }}>
                      {results.length} result{results.length !== 1 ? 's' : ''} for "{search}"
                    </Typography>
                  )}
                  {Object.entries(grouped2).map(([cat, teams]) => (
                    <Box key={cat} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <School sx={{ color: ACCENT, fontSize: 15 }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {CATEGORY_LABELS[cat] || cat}
                        </Typography>
                        <Box sx={{ flex: 1, height: 1, background: BORDER }} />
                      </Box>
                      {renderTeamList(teams)}
                    </Box>
                  ))}
                </Box>
              );
            })()
          ) : (
            /* Normal grouped view by category */
            orderedCategories.map(cat => {
              const catTeams = grouped[cat] || [];
              const catDone  = catTeams.filter(t => t.my_marks !== null).length;
              return (
                <Box key={cat} sx={{ mb: 4 }}>
                  {/* Category header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ width: 3, height: 20, borderRadius: 2, background: `linear-gradient(${ACCENT}, #4f0014)` }} />
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>
                      {CATEGORY_LABELS[cat] || cat}
                    </Typography>
                    <Chip label={`${catTeams.length} teams`} size="small"
                      sx={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                    {catDone === catTeams.length && catTeams.length > 0 ? (
                      <Chip icon={<CheckCircle sx={{ fontSize: '13px !important' }} />} label="All marked"
                        size="small" sx={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30`, fontSize: 11 }} />
                    ) : catDone > 0 ? (
                      <Chip label={`${catDone}/${catTeams.length} marked`} size="small"
                        sx={{ background: `${AMBER}15`, color: AMBER, border: `1px solid ${AMBER}30`, fontSize: 11 }} />
                    ) : null}
                  </Box>
                  {renderTeamList(catTeams)}
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default JudgeDashboard;
