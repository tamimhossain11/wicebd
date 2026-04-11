const db = require('../db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.HOSTINGER_EMAIL_USER,
    pass: process.env.HOSTINGER_EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

// Admin: create announcement
const createAnnouncement = async (req, res) => {
  const { title, body, image_url = null, target_audience = 'all', send_email = false } = req.body;
  const admin_id = req.admin.id;

  if (!title || !body) {
    return res.status(400).json({ success: false, message: 'Title and body are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO announcements (admin_id, title, body, image_url, target_audience, send_email, is_published)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [admin_id, title, body, image_url || null, target_audience, send_email ? 1 : 0]
    );

    const announcementId = result.insertId;

    // Send emails if requested
    if (send_email) {
      sendAnnouncementEmails(announcementId, title, body, target_audience);
    }

    res.json({ success: true, id: announcementId, message: 'Announcement created' });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ success: false, message: 'Failed to create announcement' });
  }
};

// Admin: list all announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, ad.username as admin_name
      FROM announcements a
      JOIN admins ad ON a.admin_id = ad.id
      ORDER BY a.created_at DESC
    `);
    res.json({ success: true, announcements: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
};

// Admin: delete announcement
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM announcements WHERE id = ?', [id]);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement' });
  }
};

// Public/User: get published announcements
const getPublishedAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, body, image_url, target_audience, created_at
      FROM announcements
      WHERE is_published = 1
      ORDER BY created_at DESC
      LIMIT 50
    `);
    res.json({ success: true, announcements: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
};

// Background: send emails to relevant users
const sendAnnouncementEmails = async (announcementId, title, body, audience) => {
  try {
    let emails = [];

    if (audience === 'all' || audience === 'event_registered') {
      const [rows] = await db.query(
        'SELECT DISTINCT email FROM users WHERE email NOT LIKE "%@wicebd.local"'
      );
      emails = rows.map(r => r.email);
    } else if (audience === 'project') {
      const [rows] = await db.query('SELECT DISTINCT leaderEmail as email FROM registrations WHERE leaderEmail IS NOT NULL');
      emails = rows.map(r => r.email);
    } else if (audience === 'olympiad') {
      const [rows] = await db.query('SELECT DISTINCT email FROM olympiad_registrations WHERE email IS NOT NULL');
      emails = rows.map(r => r.email);
    } else if (audience === 'wall_magazine') {
      const [rows] = await db.query("SELECT DISTINCT leaderEmail as email FROM registrations WHERE competitionCategory = 'Megazine' AND leaderEmail IS NOT NULL");
      emails = rows.map(r => r.email);
    }

    if (emails.length === 0) return;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8b0000; padding: 20px; color: white; text-align: center;">
          <h2 style="margin:0;">WICE Bangladesh Announcement</h2>
        </div>
        <div style="padding: 25px; background: #f9f9f9;">
          <h3 style="color: #8b0000;">${title}</h3>
          <div style="white-space: pre-wrap; line-height: 1.6;">${body}</div>
        </div>
        <div style="background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          WICE Bangladesh &copy; ${new Date().getFullYear()} | <a href="https://wicebd.com">wicebd.com</a>
        </div>
      </div>
    `;

    // Send in batches of 50
    for (let i = 0; i < emails.length; i += 50) {
      const batch = emails.slice(i, i + 50);
      await transporter.sendMail({
        from: `"WICE Bangladesh" <${process.env.HOSTINGER_EMAIL_USER}>`,
        bcc: batch.join(','),
        subject: `[WICE] ${title}`,
        html,
      });
    }

    await db.query(
      'UPDATE announcements SET email_sent_at = NOW() WHERE id = ?',
      [announcementId]
    );

    console.log(`Announcement emails sent to ${emails.length} recipients`);
  } catch (err) {
    console.error('Email send error:', err);
  }
};

module.exports = { createAnnouncement, getAllAnnouncements, deleteAnnouncement, getPublishedAnnouncements };
