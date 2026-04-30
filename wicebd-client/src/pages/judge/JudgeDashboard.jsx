import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, CircularProgress, Alert,
  TextField, Chip, Avatar, Divider, Drawer, IconButton,
  Collapse, Tooltip, Badge, LinearProgress, InputAdornment,
  useMediaQuery, useTheme,
} from '@mui/material';
import {
  Gavel, Logout, Menu as MenuIcon, Close, ExpandMore, ExpandLess,
  CheckCircle, RadioButtonUnchecked, Save, Person, Groups,
  EmojiEvents, School, Refresh, Notes,
} from '@mui/icons-material';
import { useJudgeAuth } from '../../context/JudgeAuthContext';
import api from '../../api/index';
import { toast } from 'react-toastify';

/* ── Design tokens ── */
const BG = '#07070f';
const SURFACE = '#0e0e1c';
const CARD = '#12122a';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#800020';
const GREEN = '#10b981';
const AMBER = '#f59e0b';
const SIDEBAR_W = 260;

const CATEGORY_ORDER = ['Primary School', 'High School', 'college', 'University'];
const CATEGORY_LABELS = { 'Primary School': 'Primary School', 'High School': 'High School', college: 'College', University: 'University' };

const MEDAL_COLORS = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
const MEDAL_LABELS = { 1: 'Gold', 2: 'Silver', 3: 'Bronze' };

/* ── Stat card ── */
const StatCard = ({ icon, label, value, color }) => (
  <Paper sx={{ p: 2, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}`, flex: 1, minWidth: 120 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ width: 40, height: 40, borderRadius: 2, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{value}</Typography>
      </Box>
    </Box>
  </Paper>
);

/* ── Team card for marking ── */
const TeamCard = ({ team, rank, onMarkSave }) => {
  const [marks, setMarks] = useState(team.my_marks !== null ? String(team.my_marks) : '');
  const [notes, setNotes] = useState(team.my_notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(team.my_marks !== null);
  const [showNotes, setShowNotes] = useState(false);

  const marksNum = parseFloat(marks);
  const valid = marks !== '' && !isNaN(marksNum) && marksNum >= 0 && marksNum <= 100;

  const handleSave = async () => {
    if (!valid) return toast.error('Enter valid marks (0–100)');
    setSaving(true);
    try {
      await api.post('/api/judge/marks', {
        registration_id: team.registration_id,
        marks: marksNum,
        notes,
        competition_type: team.competition_type,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('judgeToken')}` } });
      setSaved(true);
      toast.success('Marks saved');
      onMarkSave(team.registration_id, marksNum);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{
      p: 2.5, borderRadius: 3, background: CARD, border: `1px solid ${saved ? GREEN + '30' : BORDER}`,
      transition: 'border-color 0.3s, box-shadow 0.3s',
      boxShadow: saved ? `0 0 0 1px ${GREEN}25` : 'none',
      position: 'relative', overflow: 'hidden',
    }}>
      {rank <= 3 && (
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 40px 40px 0', borderColor: `transparent ${MEDAL_COLORS[rank]} transparent transparent` }} />
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 38, height: 38, background: `${ACCENT}22`, color: ACCENT, fontWeight: 700, fontSize: 15 }}>
            {(team.team_name || '?')[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{team.team_name}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{team.institution}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {saved && <Chip icon={<CheckCircle sx={{ fontSize: '14px !important' }} />} label={`${marksNum}/100`} size="small" sx={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}30`, fontSize: 11 }} />}
        </Box>
      </Box>

      {team.project_title && (
        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, mb: 1.5, fontStyle: 'italic' }}>
          "{team.project_title}"
        </Typography>
      )}

      {/* Members */}
      {[team.member2, team.member3, team.member4, team.member5, team.member6].filter(Boolean).length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {[team.member2, team.member3, team.member4, team.member5, team.member6].filter(Boolean).map((m, i) => (
            <Chip key={i} icon={<Person sx={{ fontSize: '13px !important' }} />} label={m} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', fontSize: 11 }} />
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TextField
          label="Marks (0–100)" size="small" type="number"
          value={marks}
          onChange={e => { setMarks(e.target.value); setSaved(false); }}
          inputProps={{ min: 0, max: 100, step: 0.5 }}
          sx={{
            width: 150,
            '& .MuiOutlinedInput-root': {
              color: '#fff', background: 'rgba(255,255,255,0.04)',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
              '&:hover fieldset': { borderColor: `${ACCENT}80` },
              '&.Mui-focused fieldset': { borderColor: ACCENT },
            },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
            '& .MuiInputLabel-root.Mui-focused': { color: ACCENT },
          }}
        />
        <Tooltip title="Add notes">
          <IconButton size="small" onClick={() => setShowNotes(p => !p)} sx={{ color: showNotes ? AMBER : 'rgba(255,255,255,0.3)', border: `1px solid ${showNotes ? AMBER + '40' : BORDER}`, borderRadius: 1.5 }}>
            <Notes fontSize="small" />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained" size="small" onClick={handleSave}
          disabled={saving || !valid}
          startIcon={saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <Save />}
          sx={{
            borderRadius: '10px', fontWeight: 600, fontSize: 13,
            background: saved ? GREEN : `linear-gradient(135deg, ${ACCENT}, #4f0014)`,
            '&:hover': { background: saved ? '#059669' : `linear-gradient(135deg, #a00028, #600018)` },
            boxShadow: 'none',
          }}
        >
          {saving ? 'Saving…' : saved ? 'Update' : 'Save'}
        </Button>
      </Box>

      <Collapse in={showNotes}>
        <TextField
          fullWidth label="Notes (optional)" multiline rows={2} size="small"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          sx={{
            mt: 1.5,
            '& .MuiOutlinedInput-root': {
              color: '#fff', background: 'rgba(255,255,255,0.03)',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
              '&:hover fieldset': { borderColor: `${ACCENT}60` },
              '&.Mui-focused fieldset': { borderColor: ACCENT },
            },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)' },
          }}
        />
      </Collapse>
    </Paper>
  );
};

/* ── Category group ── */
const CategoryGroup = ({ category, teams, onMarkSave }) => {
  const [open, setOpen] = useState(true);
  const markedCount = teams.filter(t => t.my_marks !== null).length;

  const sorted = [...teams].sort((a, b) => (b.my_marks ?? -1) - (a.my_marks ?? -1));

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        fullWidth variant="text"
        onClick={() => setOpen(p => !p)}
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        sx={{
          justifyContent: 'space-between', px: 2.5, py: 1.5, mb: 1,
          background: 'rgba(255,255,255,0.04)', borderRadius: 2,
          border: `1px solid ${BORDER}`, color: '#fff',
          '&:hover': { background: 'rgba(255,255,255,0.07)' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <School sx={{ color: ACCENT, fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{CATEGORY_LABELS[category] || category}</Typography>
          <Chip label={`${teams.length} teams`} size="small" sx={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
          {markedCount > 0 && (
            <Chip
              icon={<CheckCircle sx={{ fontSize: '13px !important' }} />}
              label={`${markedCount}/${teams.length} marked`}
              size="small"
              sx={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}30`, fontSize: 11 }}
            />
          )}
        </Box>
      </Button>

      <Collapse in={open}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {sorted.map((team, idx) => (
            <TeamCard
              key={team.registration_id}
              team={team}
              rank={idx + 1}
              onMarkSave={(regId, marks) => {
                team.my_marks = marks;
                onMarkSave();
              }}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

/* ── Main Dashboard ── */
const JudgeDashboard = () => {
  const navigate = useNavigate();
  const { judge, logoutJudge } = useJudgeAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  const token = localStorage.getItem('judgeToken');

  const fetchTeams = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/api/judge/teams', { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) setGrouped(data.grouped);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, [token, refresh]);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const handleLogout = () => { logoutJudge(); navigate('/judge/login'); };

  const totalTeams = Object.values(grouped).reduce((s, arr) => s + arr.length, 0);
  const markedTeams = Object.values(grouped).flat().filter(t => t.my_marks !== null).length;
  const progress = totalTeams > 0 ? Math.round((markedTeams / totalTeams) * 100) : 0;

  const orderedCategories = [
    ...CATEGORY_ORDER.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !CATEGORY_ORDER.includes(c)),
  ];

  const SidebarContent = () => (
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: '12px', background: `linear-gradient(135deg, ${ACCENT}, #4f0014)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Gavel sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Judge Portal</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 11 }}>8th WICEBD</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: BORDER, mb: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>Judge Info</Typography>
        <Box sx={{ p: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 2, border: `1px solid ${BORDER}` }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{judge?.name}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, mt: 0.5 }}>@{judge?.username}</Typography>
          <Box sx={{ display: 'flex', gap: 0.75, mt: 1.25, flexWrap: 'wrap' }}>
            <Chip
              label={judge?.judge_type === 'wall_magazine' ? 'Wall Magazine' : 'Project'}
              size="small"
              sx={{ background: `${ACCENT}20`, color: '#ff6b6b', border: `1px solid ${ACCENT}40`, fontSize: 11 }}
            />
            {judge?.subcategory && (
              <Chip label={judge.subcategory} size="small" sx={{ background: 'rgba(108,99,255,0.15)', color: '#a5b4fc', border: '1px solid rgba(108,99,255,0.3)', fontSize: 11 }} />
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Progress</Typography>
          <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{markedTeams}/{totalTeams}</Typography>
        </Box>
        <LinearProgress
          variant="determinate" value={progress}
          sx={{ borderRadius: 2, height: 6, background: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${ACCENT}, #ff6b6b)` } }}
        />
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, mt: 0.75 }}>{progress}% marked</Typography>
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Button
          fullWidth variant="text" onClick={handleLogout}
          startIcon={<Logout />}
          sx={{ justifyContent: 'flex-start', color: 'rgba(255,100,100,0.8)', borderRadius: 2, '&:hover': { background: 'rgba(220,38,38,0.1)' } }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: BG }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box sx={{ width: SIDEBAR_W, flexShrink: 0, background: SURFACE, borderRight: `1px solid ${BORDER}`, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
          <SidebarContent />
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: SIDEBAR_W, background: SURFACE, borderRight: `1px solid ${BORDER}` } }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}><Close /></IconButton>
        </Box>
        <SidebarContent />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, maxWidth: 900, mx: 'auto', width: '100%' }}>
        {/* Mobile header */}
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'rgba(255,255,255,0.7)' }}><MenuIcon /></IconButton>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Judge Dashboard</Typography>
            <IconButton onClick={() => setRefresh(p => p + 1)} sx={{ color: 'rgba(255,255,255,0.5)' }}><Refresh /></IconButton>
          </Box>
        )}

        {/* Header */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>
                {judge?.judge_type === 'wall_magazine' ? 'Wall Magazine Judging' : `${judge?.subcategory} Judging`}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, mt: 0.5 }}>
                Mark teams group-wise • Top 3 per group advance to national round
              </Typography>
            </Box>
            <Button
              startIcon={<Refresh />} variant="outlined" size="small"
              onClick={() => setRefresh(p => p + 1)}
              sx={{ borderColor: BORDER, color: 'rgba(255,255,255,0.6)', borderRadius: 2, '&:hover': { borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)' } }}
            >
              Refresh
            </Button>
          </Box>
        )}

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <StatCard icon={<Groups sx={{ color: '#6c63ff', fontSize: 22 }} />} label="Total Teams" value={totalTeams} color="#6c63ff" />
          <StatCard icon={<CheckCircle sx={{ color: GREEN, fontSize: 22 }} />} label="Marked" value={markedTeams} color={GREEN} />
          <StatCard icon={<RadioButtonUnchecked sx={{ color: AMBER, fontSize: 22 }} />} label="Remaining" value={totalTeams - markedTeams} color={AMBER} />
        </Box>

        {/* Progress bar */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, background: CARD, border: `1px solid ${BORDER}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Marking progress</Typography>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{progress}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={progress}
            sx={{ borderRadius: 2, height: 8, background: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { background: progress === 100 ? `linear-gradient(90deg, ${GREEN}, #059669)` : `linear-gradient(90deg, ${ACCENT}, #ff6b6b)` } }}
          />
        </Paper>

        {/* Teams */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: ACCENT }} /></Box>
        ) : error ? (
          <Alert severity="error" sx={{ background: 'rgba(220,38,38,0.12)', color: '#fca5a5' }}>{error}</Alert>
        ) : orderedCategories.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: 'center', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 3 }}>
            <EmojiEvents sx={{ color: 'rgba(255,255,255,0.15)', fontSize: 56, mb: 2 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>No teams assigned to you yet</Typography>
          </Paper>
        ) : (
          orderedCategories.map(cat => (
            <CategoryGroup
              key={cat}
              category={cat}
              teams={grouped[cat]}
              onMarkSave={() => setRefresh(p => p + 1)}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default JudgeDashboard;
