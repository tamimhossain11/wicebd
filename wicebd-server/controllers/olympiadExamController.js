const db = require('../db');

// ── ADMIN: Question Management ──────────────────────────────────────────────

const getQuestions = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM olympiad_questions ORDER BY question_order ASC, id ASC'
    );
    res.json({ success: true, questions: rows });
  } catch (err) {
    console.error('getQuestions error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
};

const addQuestion = async (req, res) => {
  const { question_text, option_a, option_b, option_c, option_d, correct_answer, marks = 1, question_order = 0 } = req.body;

  if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (!['A', 'B', 'C', 'D'].includes(correct_answer.toUpperCase())) {
    return res.status(400).json({ success: false, message: 'correct_answer must be A, B, C, or D' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO olympiad_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, marks, question_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [question_text, option_a, option_b, option_c, option_d, correct_answer.toUpperCase(), marks, question_order]
    );
    res.json({ success: true, id: result.insertId, message: 'Question added' });
  } catch (err) {
    console.error('addQuestion error:', err);
    res.status(500).json({ success: false, message: 'Failed to add question' });
  }
};

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question_text, option_a, option_b, option_c, option_d, correct_answer, marks, question_order } = req.body;

  if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (!['A', 'B', 'C', 'D'].includes(correct_answer.toUpperCase())) {
    return res.status(400).json({ success: false, message: 'correct_answer must be A, B, C, or D' });
  }

  try {
    await db.query(
      `UPDATE olympiad_questions SET question_text=?, option_a=?, option_b=?, option_c=?, option_d=?,
       correct_answer=?, marks=?, question_order=? WHERE id=?`,
      [question_text, option_a, option_b, option_c, option_d, correct_answer.toUpperCase(), marks ?? 1, question_order ?? 0, id]
    );
    res.json({ success: true, message: 'Question updated' });
  } catch (err) {
    console.error('updateQuestion error:', err);
    res.status(500).json({ success: false, message: 'Failed to update question' });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM olympiad_questions WHERE id = ?', [id]);
    res.json({ success: true, message: 'Question deleted' });
  } catch (err) {
    console.error('deleteQuestion error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete question' });
  }
};

// ── ADMIN: Exam Session Control ──────────────────────────────────────────────

const getSession = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM olympiad_exam_sessions ORDER BY id DESC LIMIT 1'
    );
    const session = rows[0] || null;
    // Auto-close if time expired
    if (session && session.status === 'open' && new Date(session.ends_at) < new Date()) {
      await db.query('UPDATE olympiad_exam_sessions SET status = ? WHERE id = ?', ['closed', session.id]);
      session.status = 'closed';
    }
    res.json({ success: true, session });
  } catch (err) {
    console.error('getSession error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch session' });
  }
};

const openSession = async (req, res) => {
  const { title = 'Olympiad Exam', duration_minutes = 60 } = req.body;
  const admin_id = req.admin.id;

  if (duration_minutes < 1 || duration_minutes > 600) {
    return res.status(400).json({ success: false, message: 'Duration must be between 1 and 600 minutes' });
  }

  try {
    // Check if there's already an open session
    const [existing] = await db.query(
      "SELECT id FROM olympiad_exam_sessions WHERE status = 'open'"
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An exam session is already open' });
    }

    // Check there are questions
    const [qCount] = await db.query('SELECT COUNT(*) as cnt FROM olympiad_questions');
    if (qCount[0].cnt === 0) {
      return res.status(400).json({ success: false, message: 'Add at least one question before opening the exam' });
    }

    const now = new Date();
    const endsAt = new Date(now.getTime() + duration_minutes * 60 * 1000);

    const [result] = await db.query(
      `INSERT INTO olympiad_exam_sessions (title, duration_minutes, status, started_at, ends_at, created_by)
       VALUES (?, ?, 'open', NOW(), ?, ?)`,
      [title, duration_minutes, endsAt, admin_id]
    );

    res.json({ success: true, session_id: result.insertId, message: 'Exam portal opened', ends_at: endsAt });
  } catch (err) {
    console.error('openSession error:', err);
    res.status(500).json({ success: false, message: 'Failed to open exam session' });
  }
};

const closeSession = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id FROM olympiad_exam_sessions WHERE status = 'open' ORDER BY id DESC LIMIT 1"
    );
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No open session found' });
    }
    await db.query(
      "UPDATE olympiad_exam_sessions SET status = 'closed', ends_at = NOW() WHERE id = ?",
      [rows[0].id]
    );
    res.json({ success: true, message: 'Exam portal closed' });
  } catch (err) {
    console.error('closeSession error:', err);
    res.status(500).json({ success: false, message: 'Failed to close session' });
  }
};

// ── ADMIN: Submission Results ────────────────────────────────────────────────

const getSubmissions = async (req, res) => {
  const { session_id } = req.query;
  try {
    let query = `
      SELECT
        s.id as submission_id,
        s.submitted_at,
        s.total_marks,
        s.max_marks,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        ses.title as session_title,
        ses.id as session_id
      FROM olympiad_submissions s
      JOIN users u ON s.user_id = u.id
      JOIN olympiad_exam_sessions ses ON s.session_id = ses.id
    `;
    const params = [];
    if (session_id) {
      query += ' WHERE s.session_id = ?';
      params.push(session_id);
    }
    query += ' ORDER BY s.total_marks DESC, s.submitted_at ASC';

    const [rows] = await db.query(query, params);
    res.json({ success: true, submissions: rows });
  } catch (err) {
    console.error('getSubmissions error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
};

const getSubmissionDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const [subRows] = await db.query(
      `SELECT s.*, u.name, u.email FROM olympiad_submissions s
       JOIN users u ON s.user_id = u.id WHERE s.id = ?`,
      [id]
    );
    if (subRows.length === 0) return res.status(404).json({ success: false, message: 'Submission not found' });

    const [answers] = await db.query(
      `SELECT a.*, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.marks
       FROM olympiad_answers a
       JOIN olympiad_questions q ON a.question_id = q.id
       WHERE a.submission_id = ?
       ORDER BY q.question_order ASC, q.id ASC`,
      [id]
    );

    res.json({ success: true, submission: subRows[0], answers });
  } catch (err) {
    console.error('getSubmissionDetail error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch submission detail' });
  }
};

// ── USER: Portal Access ──────────────────────────────────────────────────────

// Public: check if portal is open (no auth needed — used to show/hide the portal button)
const getPortalStatus = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, status, started_at, ends_at FROM olympiad_exam_sessions WHERE status = 'open' ORDER BY id DESC LIMIT 1"
    );
    if (rows.length === 0) {
      return res.json({ success: true, is_open: false });
    }
    const session = rows[0];
    const now = new Date();
    if (new Date(session.ends_at) < now) {
      await db.query('UPDATE olympiad_exam_sessions SET status = ? WHERE id = ?', ['closed', session.id]);
      return res.json({ success: true, is_open: false });
    }
    const seconds_remaining = Math.max(0, Math.floor((new Date(session.ends_at) - now) / 1000));
    res.json({ success: true, is_open: true, session_id: session.id, title: session.title, seconds_remaining, ends_at: session.ends_at });
  } catch (err) {
    console.error('getPortalStatus error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch portal status' });
  }
};

// User (auth required): get exam questions + session info
const getExamPortal = async (req, res) => {
  const user_id = req.user.id;
  try {
    // Get active session
    const [sessions] = await db.query(
      "SELECT * FROM olympiad_exam_sessions WHERE status = 'open' ORDER BY id DESC LIMIT 1"
    );
    if (sessions.length === 0) {
      return res.json({ success: true, is_open: false, message: 'Exam portal is not open' });
    }
    const session = sessions[0];
    const now = new Date();
    if (new Date(session.ends_at) < now) {
      await db.query('UPDATE olympiad_exam_sessions SET status = ? WHERE id = ?', ['closed', session.id]);
      return res.json({ success: true, is_open: false, message: 'Exam time has ended' });
    }

    // Check if already submitted
    const [submitted] = await db.query(
      'SELECT id, total_marks, max_marks, submitted_at FROM olympiad_submissions WHERE user_id = ? AND session_id = ?',
      [user_id, session.id]
    );
    if (submitted.length > 0) {
      return res.json({
        success: true,
        is_open: true,
        already_submitted: true,
        submission: submitted[0],
        session_id: session.id,
        title: session.title,
      });
    }

    // Check olympiad registration by email
    const [userRows] = await db.query('SELECT email FROM users WHERE id = ?', [user_id]);
    const userEmail = userRows[0]?.email;
    const [registered] = await db.query(
      'SELECT id FROM olympiad_registrations WHERE email = ? LIMIT 1',
      [userEmail]
    );
    if (registered.length === 0) {
      return res.status(403).json({ success: false, message: 'You are not registered for the olympiad' });
    }

    // Fetch questions (WITHOUT correct_answer)
    const [questions] = await db.query(
      'SELECT id, question_text, option_a, option_b, option_c, option_d, marks, question_order FROM olympiad_questions ORDER BY question_order ASC, id ASC'
    );

    const seconds_remaining = Math.max(0, Math.floor((new Date(session.ends_at) - now) / 1000));

    res.json({
      success: true,
      is_open: true,
      already_submitted: false,
      session_id: session.id,
      title: session.title,
      seconds_remaining,
      ends_at: session.ends_at,
      questions,
    });
  } catch (err) {
    console.error('getExamPortal error:', err);
    res.status(500).json({ success: false, message: 'Failed to load exam portal' });
  }
};

// User (auth required): submit answers
const submitExam = async (req, res) => {
  const user_id = req.user.id;
  const { session_id, answers } = req.body;
  // answers: [ { question_id, selected_answer }, ... ]

  if (!session_id || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'session_id and answers array are required' });
  }

  try {
    // Validate session is still open
    const [sessions] = await db.query(
      "SELECT * FROM olympiad_exam_sessions WHERE id = ? AND status = 'open'",
      [session_id]
    );
    if (sessions.length === 0) {
      return res.status(400).json({ success: false, message: 'Exam session is not active' });
    }
    const session = sessions[0];
    if (new Date(session.ends_at) < new Date()) {
      await db.query('UPDATE olympiad_exam_sessions SET status = ? WHERE id = ?', ['closed', session.id]);
      return res.status(400).json({ success: false, message: 'Exam time has ended' });
    }

    // Prevent double submission
    const [existing] = await db.query(
      'SELECT id FROM olympiad_submissions WHERE user_id = ? AND session_id = ?',
      [user_id, session_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already submitted' });
    }

    // Fetch correct answers for all questions
    const [questions] = await db.query(
      'SELECT id, correct_answer, marks FROM olympiad_questions'
    );
    const questionMap = {};
    let maxMarks = 0;
    questions.forEach(q => {
      questionMap[q.id] = { correct_answer: q.correct_answer, marks: q.marks };
      maxMarks += q.marks;
    });

    // Score the submission
    let totalMarks = 0;
    const scoredAnswers = answers.map(a => {
      const q = questionMap[a.question_id];
      if (!q) return null;
      const selected = (a.selected_answer || '').toUpperCase();
      const isCorrect = selected === q.correct_answer ? 1 : 0;
      if (isCorrect) totalMarks += q.marks;
      return { question_id: a.question_id, selected_answer: selected, is_correct: isCorrect };
    }).filter(Boolean);

    // Insert submission
    const [subResult] = await db.query(
      'INSERT INTO olympiad_submissions (user_id, session_id, total_marks, max_marks) VALUES (?, ?, ?, ?)',
      [user_id, session_id, totalMarks, maxMarks]
    );
    const submission_id = subResult.insertId;

    // Insert individual answers
    if (scoredAnswers.length > 0) {
      const answerValues = scoredAnswers.map(a => [submission_id, a.question_id, a.selected_answer, a.is_correct]);
      await db.query(
        'INSERT INTO olympiad_answers (submission_id, question_id, selected_answer, is_correct) VALUES ?',
        [answerValues]
      );
    }

    res.json({ success: true, total_marks: totalMarks, max_marks: maxMarks, message: 'Submitted successfully' });
  } catch (err) {
    console.error('submitExam error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit exam' });
  }
};

module.exports = {
  // Admin
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getSession,
  openSession,
  closeSession,
  getSubmissions,
  getSubmissionDetail,
  // User
  getPortalStatus,
  getExamPortal,
  submitExam,
};
