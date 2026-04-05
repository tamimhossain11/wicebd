import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
  IconButton, Chip, Alert, CircularProgress, Grid, Divider, Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add, Edit as EditIcon, Delete, PlayArrow, Stop, Refresh,
  EmojiEvents, Quiz, Leaderboard,
} from '@mui/icons-material';
import api from '../../api/index';

const sx = {
  input: {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: '#e94560' },
      '&.Mui-focused fieldset': { borderColor: '#e94560' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' },
  },
  select: {
    color: '#fff',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e94560' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e94560' },
    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
  },
  dataGrid: {
    border: 'none', color: 'rgba(255,255,255,0.8)',
    '& .MuiDataGrid-columnHeaders': { background: 'rgba(233,69,96,0.15)', color: '#fff', fontWeight: 700 },
    '& .MuiDataGrid-cell': { borderColor: 'rgba(255,255,255,0.06)' },
    '& .MuiDataGrid-row:hover': { background: 'rgba(255,255,255,0.04)' },
    '& .MuiDataGrid-footerContainer': { borderColor: 'rgba(255,255,255,0.08)', color: '#fff' },
    '& .MuiTablePagination-root': { color: 'rgba(255,255,255,0.6)' },
    '& .MuiInputBase-root': { color: '#fff' },
    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
  },
};

const BLANK_QUESTION = { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', marks: 1, question_order: 0 };

const TABS = ['Questions', 'Session Control', 'Results'];

export default function OlympiadExamTab() {
  const [activeTab, setActiveTab] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Question dialog
  const [qDialog, setQDialog] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [qForm, setQForm] = useState(BLANK_QUESTION);

  // Session open dialog
  const [sessionDialog, setSessionDialog] = useState(false);
  const [sessionForm, setSessionForm] = useState({ title: 'Olympiad Exam', duration_minutes: 60 });

  // Submission detail dialog
  const [detailDialog, setDetailDialog] = useState(false);
  const [submissionDetail, setSubmissionDetail] = useState(null);

  const notify = (msg, type = 'success') => {
    if (type === 'error') setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  };

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await api.get('/api/olympiad-exam/admin/questions');
      setQuestions(res.data.questions || []);
    } catch { notify('Failed to load questions', 'error'); }
  }, []);

  const fetchSession = useCallback(async () => {
    try {
      const res = await api.get('/api/olympiad-exam/admin/session');
      setSession(res.data.session);
    } catch { notify('Failed to load session', 'error'); }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await api.get('/api/olympiad-exam/admin/submissions');
      setSubmissions(res.data.submissions || []);
    } catch { notify('Failed to load submissions', 'error'); }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchQuestions(), fetchSession(), fetchSubmissions()]).finally(() => setLoading(false));
  }, [fetchQuestions, fetchSession, fetchSubmissions]);

  // ── Question CRUD ────────────────────────────────────────────────────────

  const openAddDialog = () => { setEditingQ(null); setQForm(BLANK_QUESTION); setQDialog(true); };
  const openEditDialog = (q) => {
    setEditingQ(q);
    setQForm({ question_text: q.question_text, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, correct_answer: q.correct_answer, marks: q.marks, question_order: q.question_order });
    setQDialog(true);
  };

  const handleSaveQuestion = async () => {
    if (!qForm.question_text || !qForm.option_a || !qForm.option_b || !qForm.option_c || !qForm.option_d) {
      return notify('All fields are required', 'error');
    }
    try {
      if (editingQ) {
        await api.put(`/api/olympiad-exam/admin/questions/${editingQ.id}`, qForm);
        notify('Question updated');
      } else {
        await api.post('/api/olympiad-exam/admin/questions', qForm);
        notify('Question added');
      }
      setQDialog(false);
      fetchQuestions();
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to save question', 'error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/api/olympiad-exam/admin/questions/${id}`);
      notify('Question deleted');
      fetchQuestions();
    } catch { notify('Failed to delete question', 'error'); }
  };

  // ── Session Control ──────────────────────────────────────────────────────

  const handleOpenSession = async () => {
    try {
      await api.post('/api/olympiad-exam/admin/session/open', sessionForm);
      notify('Exam portal is now OPEN');
      setSessionDialog(false);
      fetchSession();
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to open session', 'error');
    }
  };

  const handleCloseSession = async () => {
    if (!window.confirm('Close the exam portal? All remaining time will be lost.')) return;
    try {
      await api.post('/api/olympiad-exam/admin/session/close');
      notify('Exam portal closed');
      fetchSession();
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to close session', 'error');
    }
  };

  // ── Submission Detail ────────────────────────────────────────────────────

  const openSubmissionDetail = async (id) => {
    try {
      const res = await api.get(`/api/olympiad-exam/admin/submissions/${id}`);
      setSubmissionDetail(res.data);
      setDetailDialog(true);
    } catch { notify('Failed to load detail', 'error'); }
  };

  // ── DataGrid columns ─────────────────────────────────────────────────────

  const questionCols = [
    { field: 'id', headerName: '#', width: 55 },
    { field: 'question_order', headerName: 'Order', width: 70 },
    { field: 'question_text', headerName: 'Question', flex: 1, minWidth: 200 },
    { field: 'correct_answer', headerName: 'Answer', width: 80, renderCell: (p) => <Chip label={p.value} size="small" sx={{ background: '#10b98133', color: '#10b981', fontWeight: 700 }} /> },
    { field: 'marks', headerName: 'Marks', width: 70 },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false,
      renderCell: (p) => (
        <Box>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => openEditDialog(p.row)} sx={{ color: '#f59e0b' }}><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDeleteQuestion(p.row.id)} sx={{ color: '#e94560' }}><Delete fontSize="small" /></IconButton></Tooltip>
        </Box>
      ),
    },
  ];

  const submissionCols = [
    { field: 'submission_id', headerName: 'ID', width: 60 },
    { field: 'user_name', headerName: 'Name', width: 160 },
    { field: 'user_email', headerName: 'Email', width: 210 },
    {
      field: 'score', headerName: 'Score', width: 110,
      valueGetter: (_, row) => `${row.total_marks} / ${row.max_marks}`,
      renderCell: (p) => <Chip label={p.value} size="small" sx={{ background: '#0f3460', color: '#fff', fontWeight: 700 }} />,
    },
    { field: 'submitted_at', headerName: 'Submitted At', width: 160, valueFormatter: (v) => v ? new Date(v).toLocaleString() : '' },
    {
      field: 'detail', headerName: 'Detail', width: 90, sortable: false,
      renderCell: (p) => (
        <Button size="small" variant="outlined" sx={{ color: '#e94560', borderColor: '#e94560', fontSize: 11 }} onClick={() => openSubmissionDetail(p.row.submission_id)}>View</Button>
      ),
    },
  ];

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress sx={{ color: '#e94560' }} />
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <EmojiEvents sx={{ color: '#e94560', fontSize: 28 }} />
          <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>Olympiad Exam</Typography>
        </Box>
        {session && (
          <Chip
            label={session.status === 'open' ? '● LIVE' : session.status === 'closed' ? 'Closed' : 'Draft'}
            sx={{
              background: session.status === 'open' ? '#10b98133' : session.status === 'closed' ? '#e9456033' : '#f59e0b33',
              color: session.status === 'open' ? '#10b981' : session.status === 'closed' ? '#e94560' : '#f59e0b',
              fontWeight: 700, fontSize: 13,
            }}
          />
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Sub-tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {TABS.map((t, i) => (
          <Button
            key={t}
            variant={activeTab === i ? 'contained' : 'outlined'}
            size="small"
            startIcon={i === 0 ? <Quiz /> : i === 1 ? <PlayArrow /> : <Leaderboard />}
            onClick={() => setActiveTab(i)}
            sx={{
              background: activeTab === i ? '#e94560' : 'transparent',
              borderColor: activeTab === i ? '#e94560' : 'rgba(255,255,255,0.2)',
              color: activeTab === i ? '#fff' : 'rgba(255,255,255,0.6)',
              '&:hover': { background: activeTab === i ? '#c73652' : 'rgba(255,255,255,0.06)', borderColor: '#e94560' },
            }}
          >{t}</Button>
        ))}
      </Box>

      {/* ── TAB 0: Questions ── */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{questions.length} question(s) in the bank</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<Refresh />} onClick={fetchQuestions} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)' }} variant="outlined">Refresh</Button>
              <Button size="small" startIcon={<Add />} onClick={openAddDialog} variant="contained" sx={{ background: '#e94560', '&:hover': { background: '#c73652' } }}>Add Question</Button>
            </Box>
          </Box>
          <Paper sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <DataGrid
              rows={questions}
              columns={questionCols}
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
              sx={sx.dataGrid}
            />
          </Paper>
        </Box>
      )}

      {/* ── TAB 1: Session Control ── */}
      {activeTab === 1 && (
        <Box>
          <Grid container spacing={3}>
            {/* Status Card */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 2 }}>Current Status</Typography>
                {!session ? (
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No session created yet</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Title</Typography>
                      <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{session.title}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Status</Typography>
                      <Chip label={session.status.toUpperCase()} size="small"
                        sx={{ background: session.status === 'open' ? '#10b98133' : '#e9456033', color: session.status === 'open' ? '#10b981' : '#e94560', fontWeight: 700 }} />
                    </Box>
                    {session.started_at && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Started</Typography>
                        <Typography sx={{ color: '#fff', fontSize: 13 }}>{new Date(session.started_at).toLocaleString()}</Typography>
                      </Box>
                    )}
                    {session.ends_at && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Ends At</Typography>
                        <Typography sx={{ color: '#f59e0b', fontSize: 13, fontWeight: 600 }}>{new Date(session.ends_at).toLocaleString()}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Duration</Typography>
                      <Typography sx={{ color: '#fff', fontSize: 13 }}>{session.duration_minutes} min</Typography>
                    </Box>
                  </Box>
                )}
                <Button size="small" startIcon={<Refresh />} onClick={fetchSession} sx={{ mt: 2, color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Refresh</Button>
              </Paper>
            </Grid>

            {/* Controls */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 2 }}>Controls</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Alert severity="info" sx={{ fontSize: 12 }}>
                    Opening the portal makes questions visible to all olympiad-registered users. A countdown timer will start immediately.
                  </Alert>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    disabled={session?.status === 'open'}
                    onClick={() => setSessionDialog(true)}
                    sx={{ background: '#10b981', '&:hover': { background: '#059669' }, '&:disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' } }}
                  >
                    {session?.status === 'open' ? 'Portal Already Open' : 'Open Exam Portal'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Stop />}
                    disabled={session?.status !== 'open'}
                    onClick={handleCloseSession}
                    sx={{ background: '#e94560', '&:hover': { background: '#c73652' }, '&:disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' } }}
                  >
                    Close Exam Portal
                  </Button>
                  {questions.length === 0 && (
                    <Alert severity="warning" sx={{ fontSize: 12 }}>
                      No questions added yet. Go to the Questions tab first.
                    </Alert>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ── TAB 2: Results ── */}
      {activeTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{submissions.length} submission(s)</Typography>
            <Button size="small" startIcon={<Refresh />} onClick={fetchSubmissions} sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)' }} variant="outlined">Refresh</Button>
          </Box>
          {submissions.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 2 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>No submissions yet</Typography>
            </Paper>
          ) : (
            <Paper sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <DataGrid
                rows={submissions}
                getRowId={(r) => r.submission_id}
                columns={submissionCols}
                autoHeight
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                disableRowSelectionOnClick
                sx={sx.dataGrid}
              />
            </Paper>
          )}
        </Box>
      )}

      {/* ── Add/Edit Question Dialog ── */}
      <Dialog open={qDialog} onClose={() => setQDialog(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { background: '#0f1929', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2 }}>
          {editingQ ? 'Edit Question' : 'Add Question'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField multiline rows={3} label="Question Text" value={qForm.question_text}
              onChange={(e) => setQForm(f => ({ ...f, question_text: e.target.value }))} sx={sx.input} fullWidth />
            <Grid container spacing={2}>
              {['a', 'b', 'c', 'd'].map(opt => (
                <Grid item xs={12} sm={6} key={opt}>
                  <TextField label={`Option ${opt.toUpperCase()}`} value={qForm[`option_${opt}`]}
                    onChange={(e) => setQForm(f => ({ ...f, [`option_${opt}`]: e.target.value }))} sx={sx.input} fullWidth />
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Correct Answer</InputLabel>
                  <Select value={qForm.correct_answer} label="Correct Answer"
                    onChange={(e) => setQForm(f => ({ ...f, correct_answer: e.target.value }))} sx={sx.select}>
                    {['A', 'B', 'C', 'D'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField label="Marks" type="number" value={qForm.marks} inputProps={{ min: 1 }}
                  onChange={(e) => setQForm(f => ({ ...f, marks: parseInt(e.target.value) || 1 }))} sx={sx.input} fullWidth />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField label="Order" type="number" value={qForm.question_order} inputProps={{ min: 0 }}
                  onChange={(e) => setQForm(f => ({ ...f, question_order: parseInt(e.target.value) || 0 }))} sx={sx.input} fullWidth />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button onClick={() => setQDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveQuestion} sx={{ background: '#e94560', '&:hover': { background: '#c73652' } }}>
            {editingQ ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Open Session Dialog ── */}
      <Dialog open={sessionDialog} onClose={() => setSessionDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { background: '#0f1929', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2 }}>
          Open Exam Portal
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Alert severity="warning" sx={{ fontSize: 13 }}>
              Once opened, all olympiad-registered users will be able to see the exam and start answering. Make sure all questions are ready.
            </Alert>
            <TextField label="Session Title" value={sessionForm.title}
              onChange={(e) => setSessionForm(f => ({ ...f, title: e.target.value }))} sx={sx.input} fullWidth />
            <TextField label="Duration (minutes)" type="number" value={sessionForm.duration_minutes}
              inputProps={{ min: 1, max: 600 }}
              onChange={(e) => setSessionForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) || 60 }))}
              sx={sx.input} fullWidth helperText={<span style={{ color: 'rgba(255,255,255,0.3)' }}>Exam will auto-close after this many minutes</span>} />
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              {questions.length} question(s) will be shown • Total marks: {questions.reduce((s, q) => s + (q.marks || 1), 0)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button onClick={() => setSessionDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancel</Button>
          <Button variant="contained" onClick={handleOpenSession} startIcon={<PlayArrow />}
            sx={{ background: '#10b981', '&:hover': { background: '#059669' } }}>
            Open Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Submission Detail Dialog ── */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { background: '#0f1929', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2 }}>
          Submission Detail
          {submissionDetail && (
            <Chip label={`${submissionDetail.submission?.total_marks} / ${submissionDetail.submission?.max_marks} marks`}
              sx={{ ml: 2, background: '#0f3460', color: '#fff', fontWeight: 700 }} />
          )}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {submissionDetail && (
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, fontSize: 14 }}>
                {submissionDetail.submission?.name} ({submissionDetail.submission?.email}) —
                submitted {new Date(submissionDetail.submission?.submitted_at).toLocaleString()}
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
              {submissionDetail.answers?.map((a, i) => (
                <Box key={a.id} sx={{ mb: 2.5, p: 2, borderRadius: 2, background: a.is_correct ? 'rgba(16,185,129,0.07)' : 'rgba(233,69,96,0.07)', border: `1px solid ${a.is_correct ? 'rgba(16,185,129,0.2)' : 'rgba(233,69,96,0.2)'}` }}>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 14, mb: 1 }}>
                    Q{i + 1}. {a.question_text}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const optText = a[`option_${opt.toLowerCase()}`];
                      const isSelected = a.selected_answer === opt;
                      const isCorrect = a.correct_answer === opt;
                      return (
                        <Chip key={opt} size="small"
                          label={`${opt}: ${optText}`}
                          sx={{
                            background: isCorrect ? '#10b98133' : isSelected ? '#e9456033' : 'rgba(255,255,255,0.05)',
                            color: isCorrect ? '#10b981' : isSelected ? '#e94560' : 'rgba(255,255,255,0.5)',
                            border: `1px solid ${isCorrect ? '#10b98155' : isSelected ? '#e9456055' : 'transparent'}`,
                            fontWeight: (isSelected || isCorrect) ? 700 : 400,
                          }}
                        />
                      );
                    })}
                  </Box>
                  <Typography sx={{ fontSize: 12, mt: 1, color: a.is_correct ? '#10b981' : '#e94560' }}>
                    {a.is_correct ? `✓ Correct (+${a.marks})` : `✗ Wrong (selected: ${a.selected_answer || 'none'}, correct: ${a.correct_answer})`}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button onClick={() => setDetailDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
