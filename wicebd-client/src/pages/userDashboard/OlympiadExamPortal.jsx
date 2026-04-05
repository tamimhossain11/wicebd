import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/index';
import { useAuth } from '../../context/AuthContext';

// ── Countdown Timer ──────────────────────────────────────────────────────────

function CountdownTimer({ secondsRemaining, onExpire }) {
  const [secs, setSecs] = useState(secondsRemaining);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (secs <= 0) {
      if (!expiredRef.current) { expiredRef.current = true; onExpire(); }
      return;
    }
    const id = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secs, onExpire]);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pct = Math.max(0, secs / secondsRemaining);
  const isWarning = secs < 300; // last 5 minutes
  const isDanger = secs < 60;

  const color = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      background: isDanger ? 'rgba(239,68,68,0.1)' : isWarning ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
      border: `1px solid ${color}44`,
      borderRadius: '12px', padding: '10px 18px',
      transition: 'all 0.3s',
    }}>
      <span style={{ fontSize: 20 }}>⏱</span>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Time Remaining</div>
        <div style={{ fontSize: 22, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>
          {h > 0 && `${String(h).padStart(2, '0')}:`}
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>
      </div>
      {/* progress bar */}
      <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: color, borderRadius: 3, transition: 'width 1s linear' }} />
      </div>
    </div>
  );
}

// ── Main Portal ──────────────────────────────────────────────────────────────

export default function OlympiadExamPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState('loading'); // loading | closed | exam | submitted | result
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitConfirm, setSubmitConfirm] = useState(false);

  const loadPortal = useCallback(async () => {
    setState('loading');
    try {
      const res = await api.get('/api/olympiad-exam/portal');
      const data = res.data;
      if (!data.is_open) { setState('closed'); return; }
      if (data.already_submitted) {
        setResult({ total_marks: data.submission.total_marks, max_marks: data.submission.max_marks, submitted_at: data.submission.submitted_at });
        setState('submitted');
        return;
      }
      setExamData(data);
      setState('exam');
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.message || 'You are not registered for the olympiad');
        setState('closed');
      } else {
        setError('Failed to load the exam portal. Please refresh.');
        setState('closed');
      }
    }
  }, []);

  useEffect(() => { loadPortal(); }, [loadPortal]);

  const handleSelect = (questionId, option) => {
    setAnswers(a => ({ ...a, [questionId]: option }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !submitConfirm) { setSubmitConfirm(true); return; }
    setSubmitConfirm(false);
    setSubmitting(true);
    try {
      const answersArray = examData.questions.map(q => ({
        question_id: q.id,
        selected_answer: answers[q.id] || '',
      }));
      const res = await api.post('/api/olympiad-exam/submit', {
        session_id: examData.session_id,
        answers: answersArray,
      });
      setResult({ total_marks: res.data.total_marks, max_marks: res.data.max_marks });
      setState('submitted');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalQ = examData?.questions?.length || 0;

  // ── Render: Loading ──
  if (state === 'loading') return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.spinner} />
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16 }}>Loading exam portal...</p>
      </div>
    </div>
  );

  // ── Render: Closed ──
  if (state === 'closed') return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
        <h2 style={{ color: '#fff', fontWeight: 800, margin: '0 0 8px' }}>Exam Portal Closed</h2>
        {error ? (
          <p style={{ color: '#e94560', marginBottom: 20, textAlign: 'center' }}>{error}</p>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 20, textAlign: 'center' }}>
            The olympiad exam is not currently active.<br />Please wait for the admin to open the portal.
          </p>
        )}
        <button onClick={() => navigate('/dashboard')} style={styles.btnSecondary}>← Back to Dashboard</button>
      </div>
    </div>
  );

  // ── Render: Already Submitted ──
  if (state === 'submitted') return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: '#10b981', fontWeight: 800, margin: '0 0 8px' }}>Submitted Successfully!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24, textAlign: 'center' }}>
          Your answers have been recorded and verified.
        </p>
        {result && (
          <div style={styles.resultBox}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Your Score</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#e94560' }}>{result.total_marks}</div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)' }}>out of {result.max_marks}</div>
            <div style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
              {result.max_marks > 0 ? Math.round((result.total_marks / result.max_marks) * 100) : 0}% correct
            </div>
          </div>
        )}
        <button onClick={() => navigate('/dashboard')} style={{ ...styles.btnPrimary, marginTop: 24 }}>← Back to Dashboard</button>
      </div>
    </div>
  );

  // ── Render: Exam ──
  return (
    <div style={styles.examPage}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🏅</span>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{examData.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Logged in as {user?.name}</div>
          </div>
        </div>
        <CountdownTimer secondsRemaining={examData.seconds_remaining} onExpire={() => handleSubmit(true)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Progress</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: answeredCount === totalQ ? '#10b981' : '#f59e0b' }}>
              {answeredCount} / {totalQ} answered
            </div>
          </div>
          <button onClick={() => handleSubmit(false)} disabled={submitting} style={styles.btnPrimary}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid #e94560', borderRadius: 8, padding: '10px 16px', margin: '12px 16px', color: '#e94560', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Submit confirmation */}
      {submitConfirm && (
        <div style={styles.overlay}>
          <div style={{ ...styles.card, maxWidth: 400 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <h3 style={{ color: '#fff', margin: '0 0 8px', fontWeight: 700 }}>Submit Exam?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 4 }}>
              You have answered <strong style={{ color: '#fff' }}>{answeredCount}</strong> of <strong style={{ color: '#fff' }}>{totalQ}</strong> questions.
            </p>
            {answeredCount < totalQ && (
              <p style={{ color: '#f59e0b', textAlign: 'center', fontSize: 13, marginBottom: 16 }}>
                ⚠ {totalQ - answeredCount} question(s) unanswered will be marked as wrong.
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
              <button onClick={() => setSubmitConfirm(false)} style={styles.btnSecondary}>Go Back</button>
              <button onClick={() => handleSubmit(true)} disabled={submitting} style={styles.btnPrimary}>
                {submitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div style={styles.questionsWrap}>
        {examData.questions.map((q, idx) => {
          const selected = answers[q.id];
          return (
            <div key={q.id} style={styles.qCard}>
              <div style={styles.qHeader}>
                <span style={styles.qNumber}>Q{idx + 1}</span>
                <span style={styles.qMarks}>{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
              </div>
              <p style={styles.qText}>{q.question_text}</p>
              <div style={styles.optionsGrid}>
                {['A', 'B', 'C', 'D'].map(opt => {
                  const text = q[`option_${opt.toLowerCase()}`];
                  const isSelected = selected === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(q.id, opt)}
                      style={{
                        ...styles.optBtn,
                        background: isSelected ? 'rgba(233,69,96,0.18)' : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${isSelected ? '#e94560' : 'rgba(255,255,255,0.1)'}`,
                        color: isSelected ? '#fff' : 'rgba(255,255,255,0.75)',
                      }}
                    >
                      <span style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: isSelected ? '#e94560' : 'rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                      }}>{opt}</span>
                      <span style={{ textAlign: 'left', lineHeight: 1.4 }}>{text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Bottom submit */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 40px' }}>
          <button onClick={() => handleSubmit(false)} disabled={submitting} style={{ ...styles.btnPrimary, padding: '14px 40px', fontSize: 16, fontWeight: 700 }}>
            {submitting ? 'Submitting...' : '📤 Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a14 0%, #0f1929 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  },
  examPage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a14 0%, #0f1929 100%)',
    paddingBottom: 40,
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '40px 36px',
    textAlign: 'center',
    maxWidth: 480,
    width: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 12,
    background: 'rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '14px 24px',
    position: 'sticky', top: 0, zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  questionsWrap: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '24px 16px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  qCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '22px 24px',
  },
  qHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  qNumber: {
    background: '#e94560', color: '#fff', borderRadius: 8, padding: '3px 10px',
    fontSize: 13, fontWeight: 700,
  },
  qMarks: {
    fontSize: 12, color: 'rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '3px 8px',
  },
  qText: {
    color: '#fff', fontSize: 15, fontWeight: 500, lineHeight: 1.6,
    margin: '0 0 18px',
  },
  optionsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
  },
  optBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', borderRadius: 10,
    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
    fontSize: 14, fontWeight: 500,
  },
  btnPrimary: {
    background: '#e94560', color: '#fff', border: 'none',
    borderRadius: 10, padding: '10px 22px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnSecondary: {
    background: 'transparent', color: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10, padding: '10px 22px',
    fontSize: 14, cursor: 'pointer',
  },
  resultBox: {
    background: 'rgba(233,69,96,0.08)',
    border: '1px solid rgba(233,69,96,0.3)',
    borderRadius: 16, padding: '24px 40px',
    textAlign: 'center', width: '100%',
  },
  spinner: {
    width: 44, height: 44, border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#e94560', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 999, padding: 20,
  },
};
