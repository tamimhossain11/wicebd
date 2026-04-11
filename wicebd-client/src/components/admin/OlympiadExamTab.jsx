import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
  IconButton, Chip, Alert, CircularProgress, Grid, Divider, Tooltip, Avatar,
  LinearProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add, Edit as EditIcon, Delete, PlayArrow, Stop, Refresh,
  EmojiEvents, Quiz, Leaderboard, CheckCircle, Schedule,
} from '@mui/icons-material';
import api from '../../api/index';

/* ── Design tokens (mirrors AdminDashboard) ── */
const CARD    = '#12122a';
const SURFACE = '#0e0e1c';
const BORDER  = 'rgba(255,255,255,0.07)';
const RED     = '#e94560';
const GREEN   = '#10b981';
const AMBER   = '#f59e0b';
const ACCENT  = '#6c63ff';
const CYAN    = '#06b6d4';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: BORDER },
    '&:hover fieldset': { borderColor: RED },
    '&.Mui-focused fieldset': { borderColor: RED },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: RED },
  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.3)' },
};

const selectSx = {
  color: '#fff',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: RED },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: RED },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
};

const gridSx = {
  border: 'none',
  background: CARD,
  color: 'rgba(255,255,255,0.8)',
  '& .MuiDataGrid-main':            { background: CARD },
  '& .MuiDataGrid-virtualScroller': { background: CARD },
  /* v8 header — solid dark bg, white text */
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
  '& .MuiDataGrid-cell': { borderColor: BORDER, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  '& .MuiDataGrid-row': { background: CARD },
  '& .MuiDataGrid-row:hover': { background: 'rgba(255,255,255,0.04)' },
  '& .MuiDataGrid-footerContainer': { borderColor: BORDER, background: CARD },
  '& .MuiTablePagination-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiTablePagination-selectLabel': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiTablePagination-displayedRows': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiTablePagination-actions .MuiIconButton-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputBase-root': { color: '#fff' },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiDataGrid-overlay': { background: CARD, color: 'rgba(255,255,255,0.3)' },
};

const BLANK_Q = { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', marks: 1, question_order: 0 };
const TABS = ['Questions', 'Session Control', 'Results'];

export default function OlympiadExamTab() {
  const [activeTab, setActiveTab] = useState(0);
  const [questions, setQuestions]   = useState([]);
  const [session, setSession]       = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  const [qDialog, setQDialog]         = useState(false);
  const [editingQ, setEditingQ]       = useState(null);
  const [qForm, setQForm]             = useState(BLANK_Q);
  const [sessionDialog, setSessionDialog] = useState(false);
  const [sessionForm, setSessionForm] = useState({ title: 'Olympiad Exam', duration_minutes: 60 });
  const [detailDialog, setDetailDialog] = useState(false);
  const [submissionDetail, setSubmissionDetail] = useState(null);

  const notify = (msg, type = 'success') => {
    if (type === 'error') setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  };

  const fetchQuestions  = useCallback(async () => {
    try { const r = await api.get('/api/olympiad-exam/admin/questions'); setQuestions(r.data.questions || []); }
    catch { notify('Failed to load questions', 'error'); }
  }, []);

  const fetchSession = useCallback(async () => {
    try { const r = await api.get('/api/olympiad-exam/admin/session'); setSession(r.data.session); }
    catch { notify('Failed to load session', 'error'); }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    try { const r = await api.get('/api/olympiad-exam/admin/submissions'); setSubmissions(r.data.submissions || []); }
    catch { notify('Failed to load submissions', 'error'); }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchQuestions(), fetchSession(), fetchSubmissions()]).finally(() => setLoading(false));
  }, [fetchQuestions, fetchSession, fetchSubmissions]);

  const openAddDialog  = () => { setEditingQ(null); setQForm(BLANK_Q); setQDialog(true); };
  const openEditDialog = (q) => {
    setEditingQ(q);
    setQForm({ question_text: q.question_text, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, correct_answer: q.correct_answer, marks: q.marks, question_order: q.question_order });
    setQDialog(true);
  };

  const handleSaveQuestion = async () => {
    if (!qForm.question_text || !qForm.option_a || !qForm.option_b || !qForm.option_c || !qForm.option_d)
      return notify('All fields are required', 'error');
    try {
      if (editingQ) await api.put(`/api/olympiad-exam/admin/questions/${editingQ.id}`, qForm);
      else await api.post('/api/olympiad-exam/admin/questions', qForm);
      notify(editingQ ? 'Question updated' : 'Question added');
      setQDialog(false);
      fetchQuestions();
    } catch (err) { notify(err.response?.data?.message || 'Failed to save question', 'error'); }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try { await api.delete(`/api/olympiad-exam/admin/questions/${id}`); notify('Question deleted'); fetchQuestions(); }
    catch { notify('Failed to delete question', 'error'); }
  };

  const handleOpenSession = async () => {
    try {
      await api.post('/api/olympiad-exam/admin/session/open', sessionForm);
      notify('Exam portal is now OPEN');
      setSessionDialog(false);
      fetchSession();
    } catch (err) { notify(err.response?.data?.message || 'Failed to open session', 'error'); }
  };

  const handleCloseSession = async () => {
    if (!window.confirm('Close the exam portal? All remaining time will be lost.')) return;
    try { await api.post('/api/olympiad-exam/admin/session/close'); notify('Exam portal closed'); fetchSession(); }
    catch (err) { notify(err.response?.data?.message || 'Failed to close session', 'error'); }
  };

  const openSubmissionDetail = async (id) => {
    try { const r = await api.get(`/api/olympiad-exam/admin/submissions/${id}`); setSubmissionDetail(r.data); setDetailDialog(true); }
    catch { notify('Failed to load detail', 'error'); }
  };

  /* ── DataGrid columns ── */
  const questionCols = [
    { field: 'question_order', headerName: '#', width: 55 },
    { field: 'question_text', headerName: 'Question', flex: 1, minWidth: 200 },
    { field: 'correct_answer', headerName: 'Answer', width: 90,
      renderCell: p => <Chip label={p.value} size="small" sx={{ background: `${GREEN}20`, color: GREEN, fontWeight: 800, fontSize: 12 }} /> },
    { field: 'marks', headerName: 'Marks', width: 75,
      renderCell: p => <Chip label={p.value} size="small" sx={{ background: `${ACCENT}20`, color: ACCENT, fontWeight: 700 }} /> },
    { field: 'actions', headerName: 'Actions', width: 110, sortable: false,
      renderCell: p => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEditDialog(p.row)} sx={{ color: AMBER, '&:hover': { background: `${AMBER}15` } }}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteQuestion(p.row.id)} sx={{ color: RED, '&:hover': { background: `${RED}15` } }}>
              <Delete sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const submissionCols = [
    { field: 'submission_id', headerName: 'ID', width: 65 },
    { field: 'user_name', headerName: 'Name', width: 160 },
    { field: 'user_email', headerName: 'Email', width: 220 },
    { field: 'score', headerName: 'Score', width: 120,
      valueGetter: (_, row) => `${row.total_marks} / ${row.max_marks}`,
      renderCell: p => <Chip label={p.value} size="small" sx={{ background: `${CYAN}20`, color: CYAN, fontWeight: 700 }} />,
    },
    { field: 'submitted_at', headerName: 'Submitted', width: 170, valueFormatter: v => v ? new Date(v).toLocaleString() : '' },
    { field: 'detail', headerName: '', width: 90, sortable: false,
      renderCell: p => (
        <Button size="small" variant="outlined"
          sx={{ color: RED, borderColor: `${RED}50`, fontSize: 11, textTransform: 'none', '&:hover': { background: `${RED}10`, borderColor: RED } }}
          onClick={() => openSubmissionDetail(p.row.submission_id)}>
          View
        </Button>
      ),
    },
  ];

  const totalMarks = questions.reduce((s, q) => s + (q.marks || 1), 0);

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
      <CircularProgress sx={{ color: RED }} />
      <LinearProgress sx={{ width: 160, borderRadius: 2, background: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: RED } }} />
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 4, height: 24, borderRadius: 2, background: `linear-gradient(${RED}, ${ACCENT})` }} />
          <EmojiEvents sx={{ color: RED, fontSize: 24 }} />
          <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>Olympiad Exam Management</Typography>
        </Box>
        {session && (
          <Chip
            icon={session.status === 'open' ? <CheckCircle sx={{ fontSize: '14px !important', color: `${GREEN} !important` }} /> : <Schedule sx={{ fontSize: '14px !important' }} />}
            label={session.status === 'open' ? 'LIVE' : session.status === 'closed' ? 'Closed' : 'Draft'}
            sx={{
              background: session.status === 'open' ? `${GREEN}18` : session.status === 'closed' ? `${RED}18` : `${AMBER}18`,
              color: session.status === 'open' ? GREEN : session.status === 'closed' ? RED : AMBER,
              border: `1px solid ${session.status === 'open' ? GREEN : session.status === 'closed' ? RED : AMBER}30`,
              fontWeight: 700, fontSize: 12,
            }}
          />
        )}
      </Box>

      {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Sub-tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, p: 0.5, background: 'rgba(255,255,255,0.03)', borderRadius: 2, width: 'fit-content', border: `1px solid ${BORDER}` }}>
        {TABS.map((t, i) => (
          <Button
            key={t}
            size="small"
            startIcon={i === 0 ? <Quiz sx={{ fontSize: '16px !important' }} /> : i === 1 ? <PlayArrow sx={{ fontSize: '16px !important' }} /> : <Leaderboard sx={{ fontSize: '16px !important' }} />}
            onClick={() => setActiveTab(i)}
            sx={{
              borderRadius: 1.5, px: 2, py: 0.75, textTransform: 'none', fontSize: 13, fontWeight: activeTab === i ? 700 : 400,
              background: activeTab === i ? `linear-gradient(135deg, ${RED}22, ${ACCENT}11)` : 'transparent',
              border: activeTab === i ? `1px solid ${RED}30` : '1px solid transparent',
              color: activeTab === i ? '#fff' : 'rgba(255,255,255,0.5)',
              '&:hover': { background: activeTab === i ? `linear-gradient(135deg, ${RED}25, ${ACCENT}15)` : 'rgba(255,255,255,0.04)' },
            }}
          >{t}</Button>
        ))}
      </Box>

      {/* ── TAB 0: Questions ── */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ px: 2, py: 0.8, borderRadius: 2, background: `${ACCENT}15`, border: `1px solid ${ACCENT}25` }}>
                <Typography sx={{ color: ACCENT, fontSize: 12, fontWeight: 700 }}>{questions.length} Questions</Typography>
              </Box>
              <Box sx={{ px: 2, py: 0.8, borderRadius: 2, background: `${GREEN}15`, border: `1px solid ${GREEN}25` }}>
                <Typography sx={{ color: GREEN, fontSize: 12, fontWeight: 700 }}>{totalMarks} Total Marks</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<Refresh sx={{ fontSize: 16 }} />} onClick={fetchQuestions}
                variant="outlined" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: BORDER, textTransform: 'none', borderRadius: 2 }}>Refresh</Button>
              <Button size="small" startIcon={<Add sx={{ fontSize: 16 }} />} onClick={openAddDialog}
                variant="contained" sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, boxShadow: `0 4px 14px ${RED}40` }}>
                Add Question
              </Button>
            </Box>
          </Box>
          <Paper sx={{ background: CARD, borderRadius: 3, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <DataGrid
              rows={questions}
              columns={questionCols}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
              sx={{ ...gridSx, '--DataGrid-overlayHeight': '200px' }}
            />
          </Paper>
        </Box>
      )}

      {/* ── TAB 1: Session Control ── */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Status Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 4, height: 18, borderRadius: 2, background: `linear-gradient(${RED}, ${ACCENT})` }} />
                <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 15 }}>Current Status</Typography>
              </Box>
              {!session ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Schedule sx={{ fontSize: 40, color: 'rgba(255,255,255,0.1)', mb: 1 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>No session created yet</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    ['Title', session.title, '#fff'],
                    ['Duration', `${session.duration_minutes} minutes`, '#fff'],
                    ...(session.started_at ? [['Started', new Date(session.started_at).toLocaleString(), '#fff']] : []),
                    ...(session.ends_at ? [['Ends At', new Date(session.ends_at).toLocaleString(), AMBER]] : []),
                  ].map(([label, val, color]) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${BORDER}` }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{label}</Typography>
                      <Typography sx={{ color: color, fontSize: 13, fontWeight: 600 }}>{val}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>Status</Typography>
                    <Chip label={session.status.toUpperCase()} size="small"
                      sx={{
                        background: session.status === 'open' ? `${GREEN}18` : `${RED}18`,
                        color: session.status === 'open' ? GREEN : RED,
                        fontWeight: 700, fontSize: 11,
                      }} />
                  </Box>
                </Box>
              )}
              <Button size="small" startIcon={<Refresh sx={{ fontSize: 14 }} />} onClick={fetchSession}
                sx={{ mt: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'none', fontSize: 12 }}>
                Refresh
              </Button>
            </Paper>
          </Grid>

          {/* Controls */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 4, height: 18, borderRadius: 2, background: `linear-gradient(${GREEN}, ${CYAN})` }} />
                <Typography fontWeight={700} sx={{ color: '#fff', fontSize: 15 }}>Exam Controls</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                  Opening the portal makes all questions visible to olympiad-registered users. A countdown timer starts immediately.
                </Box>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  disabled={session?.status === 'open'}
                  onClick={() => setSessionDialog(true)}
                  sx={{
                    background: `linear-gradient(135deg, ${GREEN}, #059669)`,
                    textTransform: 'none', borderRadius: 2, fontWeight: 700,
                    boxShadow: `0 4px 14px ${GREEN}40`,
                    '&:disabled': { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  {session?.status === 'open' ? 'Portal Already Open' : 'Open Exam Portal'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Stop />}
                  disabled={session?.status !== 'open'}
                  onClick={handleCloseSession}
                  sx={{
                    color: RED, borderColor: `${RED}50`, textTransform: 'none', borderRadius: 2, fontWeight: 700,
                    '&:hover': { background: `${RED}10`, borderColor: RED },
                    '&:disabled': { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Close Exam Portal
                </Button>
                {questions.length === 0 && (
                  <Box sx={{ p: 2, borderRadius: 2, background: `${AMBER}10`, border: `1px solid ${AMBER}30` }}>
                    <Typography sx={{ color: AMBER, fontSize: 12, fontWeight: 600 }}>⚠ No questions added yet. Go to the Questions tab first.</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ── TAB 2: Results ── */}
      {activeTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5, alignItems: 'center' }}>
            <Box sx={{ px: 2, py: 0.8, borderRadius: 2, background: `${CYAN}15`, border: `1px solid ${CYAN}25` }}>
              <Typography sx={{ color: CYAN, fontSize: 12, fontWeight: 700 }}>{submissions.length} Submissions</Typography>
            </Box>
            <Button size="small" startIcon={<Refresh sx={{ fontSize: 16 }} />} onClick={fetchSubmissions}
              variant="outlined" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: BORDER, textTransform: 'none', borderRadius: 2 }}>Refresh</Button>
          </Box>
          {submissions.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', background: CARD, borderRadius: 3, border: `1px solid ${BORDER}` }}>
              <Leaderboard sx={{ fontSize: 56, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.35)' }}>No submissions yet</Typography>
            </Paper>
          ) : (
            <Paper sx={{ background: CARD, borderRadius: 3, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              <DataGrid
                rows={submissions}
                getRowId={r => r.submission_id}
                columns={submissionCols}
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                disableRowSelectionOnClick
                sx={{ ...gridSx, '--DataGrid-overlayHeight': '200px' }}
              />
            </Paper>
          )}
        </Box>
      )}

      {/* ── Add / Edit Question Dialog ── */}
      <Dialog open={qDialog} onClose={() => setQDialog(false)} maxWidth="md" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: `1px solid ${BORDER}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Quiz sx={{ color: RED, fontSize: 20 }} />
            {editingQ ? 'Edit Question' : 'Add New Question'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField multiline rows={3} label="Question Text *" value={qForm.question_text}
              onChange={e => setQForm(f => ({ ...f, question_text: e.target.value }))} sx={inputSx} fullWidth />
            <Grid container spacing={2}>
              {['a', 'b', 'c', 'd'].map(opt => (
                <Grid size={{ xs: 12, sm: 6 }} key={opt}>
                  <TextField label={`Option ${opt.toUpperCase()} *`} value={qForm[`option_${opt}`]}
                    onChange={e => setQForm(f => ({ ...f, [`option_${opt}`]: e.target.value }))} sx={inputSx} fullWidth />
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth sx={{ '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: RED } }}>Correct Answer</InputLabel>
                  <Select value={qForm.correct_answer} label="Correct Answer"
                    onChange={e => setQForm(f => ({ ...f, correct_answer: e.target.value }))} sx={selectSx}
                    slotProps={{ paper: { sx: { background: SURFACE, color: '#fff' } } }}>
                    {['A', 'B', 'C', 'D'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <TextField label="Marks" type="number" value={qForm.marks} slotProps={{ htmlInput: { min: 1 } }}
                  onChange={e => setQForm(f => ({ ...f, marks: parseInt(e.target.value) || 1 }))} sx={inputSx} fullWidth />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <TextField label="Order" type="number" value={qForm.question_order} slotProps={{ htmlInput: { min: 0 } }}
                  onChange={e => setQForm(f => ({ ...f, question_order: parseInt(e.target.value) || 0 }))} sx={inputSx} fullWidth />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, borderTop: `1px solid ${BORDER}` }}>
          <Button onClick={() => setQDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveQuestion}
            sx={{ background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, textTransform: 'none', borderRadius: 2, px: 3 }}>
            {editingQ ? 'Update Question' : 'Add Question'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Open Session Dialog ── */}
      <Dialog open={sessionDialog} onClose={() => setSessionDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: `1px solid ${BORDER}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PlayArrow sx={{ color: GREEN }} />Open Exam Portal</Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Box sx={{ p: 2, borderRadius: 2, background: `${AMBER}10`, border: `1px solid ${AMBER}30` }}>
              <Typography sx={{ color: AMBER, fontSize: 13, lineHeight: 1.7 }}>
                ⚠ Once opened, all olympiad-registered users can see and start the exam. Ensure all questions are ready before proceeding.
              </Typography>
            </Box>
            <TextField label="Session Title" value={sessionForm.title}
              onChange={e => setSessionForm(f => ({ ...f, title: e.target.value }))} sx={inputSx} fullWidth />
            <TextField label="Duration (minutes)" type="number" value={sessionForm.duration_minutes}
              slotProps={{ htmlInput: { min: 1, max: 600 } }}
              onChange={e => setSessionForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) || 60 }))}
              helperText="Exam will auto-close after this many minutes"
              sx={inputSx} fullWidth />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, background: `${ACCENT}12`, border: `1px solid ${ACCENT}25`, textAlign: 'center' }}>
                <Typography sx={{ color: ACCENT, fontWeight: 800, fontSize: 20 }}>{questions.length}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Questions</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, background: `${GREEN}12`, border: `1px solid ${GREEN}25`, textAlign: 'center' }}>
                <Typography sx={{ color: GREEN, fontWeight: 800, fontSize: 20 }}>{totalMarks}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Total Marks</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, borderTop: `1px solid ${BORDER}` }}>
          <Button onClick={() => setSessionDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleOpenSession} startIcon={<PlayArrow />}
            sx={{ background: `linear-gradient(135deg, ${GREEN}, #059669)`, textTransform: 'none', borderRadius: 2, px: 3, boxShadow: `0 4px 14px ${GREEN}40` }}>
            Open Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Submission Detail Dialog ── */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="md" fullWidth
        slotProps={{ paper: { sx: { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 } } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: `1px solid ${BORDER}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Leaderboard sx={{ color: CYAN, fontSize: 20 }} />
            Submission Detail
            {submissionDetail && (
              <Chip label={`${submissionDetail.submission?.total_marks} / ${submissionDetail.submission?.max_marks} marks`}
                size="small" sx={{ background: `${CYAN}18`, color: CYAN, fontWeight: 700, ml: 1 }} />
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {submissionDetail && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.03)' }}>
                <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${RED}, ${ACCENT})`, fontSize: 14, fontWeight: 800 }}>
                  {submissionDetail.submission?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{submissionDetail.submission?.name}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                    {submissionDetail.submission?.email} · {new Date(submissionDetail.submission?.submitted_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: BORDER, mb: 2 }} />
              {submissionDetail.answers?.map((a, i) => (
                <Box key={a.id} sx={{ mb: 2, p: 2, borderRadius: 2, background: a.is_correct ? `${GREEN}08` : `${RED}08`, border: `1px solid ${a.is_correct ? GREEN : RED}20` }}>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 13, mb: 1.5 }}>
                    Q{i + 1}. {a.question_text}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const optText = a[`option_${opt.toLowerCase()}`];
                      const isSelected = a.selected_answer === opt;
                      const isCorrect  = a.correct_answer === opt;
                      return (
                        <Chip key={opt} size="small" label={`${opt}: ${optText}`}
                          sx={{
                            background: isCorrect ? `${GREEN}25` : isSelected ? `${RED}25` : 'rgba(255,255,255,0.05)',
                            color: isCorrect ? GREEN : isSelected ? RED : 'rgba(255,255,255,0.5)',
                            border: `1px solid ${isCorrect ? GREEN : isSelected ? RED : 'transparent'}30`,
                            fontWeight: (isSelected || isCorrect) ? 700 : 400, fontSize: 11,
                          }}
                        />
                      );
                    })}
                  </Box>
                  <Typography sx={{ fontSize: 11, color: a.is_correct ? GREEN : RED, fontWeight: 600 }}>
                    {a.is_correct ? `✓ Correct (+${a.marks} mark${a.marks > 1 ? 's' : ''})` : `✗ Wrong — selected: ${a.selected_answer || 'none'}, correct: ${a.correct_answer}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${BORDER}` }}>
          <Button onClick={() => setDetailDialog(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
