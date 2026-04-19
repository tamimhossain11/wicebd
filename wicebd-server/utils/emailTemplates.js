/**
 * WICE Bangladesh — Shared Email Template Utilities
 * Theme: Burgundy / Deep Wine (#800020) on dark header, clean white body
 */

const YEAR = new Date().getFullYear();

/* ── Brand colours (inline-safe) ── */
const COLOR = {
  primary:   '#800020',
  accent:    '#c0002a',
  dark:      '#0d0006',
  darkMid:   '#1a000a',
  white:     '#ffffff',
  bodyBg:    '#fdfaf9',
  cardBg:    '#fff8f8',
  border:    '#f0e0e4',
  textMain:  '#1a0008',
  textSub:   '#5a3040',
  textMuted: '#8a6070',
  footerBg:  '#1a000a',
};

/* ── Common wrappers ── */
const wrapper = (content, frontendUrl = 'https://www.wicebd.com') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WICE Bangladesh</title>
</head>
<body style="margin:0;padding:0;background:#f4eef0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4eef0;padding:32px 12px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(128,0,32,0.14);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,${COLOR.dark} 0%,${COLOR.darkMid} 60%,#2a0010 100%);padding:32px 40px;text-align:center;">
            <img src="${frontendUrl}/images/logo-normal.PNG" alt="WICE Bangladesh" height="52"
              style="height:52px;object-fit:contain;display:inline-block;" />
            <div style="width:48px;height:2px;background:linear-gradient(90deg,transparent,${COLOR.accent},transparent);margin:16px auto 0;"></div>
          </td>
        </tr>

        ${content}

        <!-- FOOTER -->
        <tr>
          <td style="background:${COLOR.footerBg};padding:28px 40px;text-align:center;">
            <p style="margin:0 0 8px;color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">
              World Invention Competition &amp; Exhibition Bangladesh
            </p>
            <p style="margin:0 0 14px;color:rgba(255,255,255,0.18);font-size:11px;">
              WICE Bangladesh &copy; ${YEAR} &nbsp;|&nbsp;
              <a href="${frontendUrl}" style="color:${COLOR.accent};text-decoration:none;">www.wicebd.com</a>
              &nbsp;|&nbsp;
              <a href="mailto:contact@wicebd.com" style="color:rgba(255,255,255,0.35);text-decoration:none;">contact@wicebd.com</a>
            </p>
            <p style="margin:0;color:rgba(255,255,255,0.1);font-size:10px;">
              You are receiving this email because of your participation in WICE Bangladesh.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

/* ── Accent banner row (below header) ── */
const heroBanner = (title, subtitle) => `
<tr>
  <td style="background:linear-gradient(135deg,${COLOR.primary} 0%,${COLOR.accent} 100%);padding:28px 40px;text-align:center;">
    <p style="margin:0 0 6px;color:rgba(255,255,255,0.72);font-size:11px;letter-spacing:0.22em;text-transform:uppercase;font-weight:600;">
      ${subtitle}
    </p>
    <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:0.01em;line-height:1.2;">
      ${title}
    </h1>
  </td>
</tr>`;

/* ── Body content start ── */
const bodyStart = () => `
<tr>
  <td style="background:${COLOR.bodyBg};padding:36px 40px 0;">`;

const bodyEnd = () => `
  </td>
</tr>`;

/* ── Info row in a details table ── */
const infoTable = (rows) => `
<table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${COLOR.border};margin:0 0 24px;">
  ${rows.map((r, i) => `
  <tr style="background:${i % 2 === 0 ? '#fff' : COLOR.cardBg};">
    <td style="padding:12px 16px;font-size:13px;font-weight:700;color:${COLOR.textSub};width:38%;border-right:1px solid ${COLOR.border};">${r.label}</td>
    <td style="padding:12px 16px;font-size:13px;color:${COLOR.textMain};font-weight:600;">${r.value}</td>
  </tr>`).join('')}
</table>`;

/* ── Section heading ── */
const sectionHeading = (text) => `
<p style="margin:0 0 14px;font-size:13px;font-weight:800;color:${COLOR.primary};text-transform:uppercase;letter-spacing:0.16em;border-left:3px solid ${COLOR.primary};padding-left:10px;">
  ${text}
</p>`;

/* ── CTA Button ── */
const ctaButton = (text, href) => `
<div style="text-align:center;margin:28px 0;">
  <a href="${href}" style="display:inline-block;background:linear-gradient(135deg,${COLOR.primary},${COLOR.accent});color:#fff;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:800;text-decoration:none;letter-spacing:0.04em;box-shadow:0 6px 20px rgba(128,0,32,0.28);">
    ${text}
  </a>
</div>`;

/* ── Divider ── */
const divider = () => `
<div style="height:1px;background:${COLOR.border};margin:24px 0;"></div>`;

/* ── Highlighted badge (Registration ID, etc.) ── */
const idBadge = (label, value) => `
<div style="background:linear-gradient(135deg,#fff8f8,#fdf0f3);border:1.5px solid ${COLOR.border};border-left:4px solid ${COLOR.primary};border-radius:10px;padding:18px 20px;margin:0 0 24px;display:flex;align-items:center;">
  <div>
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${COLOR.textMuted};text-transform:uppercase;letter-spacing:0.14em;">${label}</p>
    <p style="margin:0;font-size:20px;font-weight:800;color:${COLOR.primary};letter-spacing:0.08em;font-family:monospace;">${value}</p>
  </div>
</div>`;

/* ── Next-steps list ── */
const stepsList = (steps) => `
<div style="background:#fff;border:1px solid ${COLOR.border};border-radius:10px;padding:20px 24px;margin:0 0 24px;">
  ${steps.map((s, i) => `
  <div style="display:flex;align-items:flex-start;gap:12px;${i < steps.length - 1 ? 'margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid ' + COLOR.border + ';' : ''}">
    <div style="min-width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,${COLOR.primary},${COLOR.accent});color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">${i + 1}</div>
    <p style="margin:0;font-size:13.5px;color:${COLOR.textMain};line-height:1.6;">${s}</p>
  </div>`).join('')}
</div>`;


/* ════════════════════════════════════════════════════════════
   TEMPLATE 1 — Welcome / Account Created
   ════════════════════════════════════════════════════════════ */
const welcomeEmail = ({ name, frontendUrl = 'https://www.wicebd.com' }) => {
  const body = `
    ${heroBanner('Welcome to WICE Bangladesh', 'Account Created Successfully')}
    ${bodyStart()}
      <p style="margin:0 0 18px;font-size:15px;color:${COLOR.textMain};line-height:1.75;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:${COLOR.textSub};line-height:1.8;">
        Your account has been successfully created. You can now log in to your personal dashboard and register for one or more of our prestigious competitions.
      </p>

      ${sectionHeading('Available Competitions')}

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        ${[
          { title: 'Project Competition', desc: 'Team projects in Technology, Science &amp; Social Innovation' },
          { title: 'Science Olympiad',    desc: 'Individual olympiad for school &amp; college students' },
          { title: 'Robo Soccer',         desc: 'Team robot-building &amp; programming tournament' },
          { title: 'Wall Magazine',       desc: 'Creative magazine &amp; publication competition' },
        ].map((c, i) => `
        <tr>
          <td style="padding:10px 0;${i > 0 ? 'border-top:1px solid ' + COLOR.border + ';' : ''}">
            <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:${COLOR.textMain};">${c.title}</p>
            <p style="margin:0;font-size:12.5px;color:${COLOR.textSub};">${c.desc}</p>
          </td>
        </tr>`).join('')}
      </table>

      ${ctaButton('Go to My Dashboard &rarr;', `${frontendUrl}/dashboard`)}

      ${divider()}

      <p style="margin:0 0 28px;font-size:12px;color:${COLOR.textMuted};line-height:1.7;text-align:center;">
        If you did not create this account, please ignore this email or contact us at
        <a href="mailto:contact@wicebd.com" style="color:${COLOR.primary};font-weight:700;">contact@wicebd.com</a>.
      </p>
    ${bodyEnd()}`;

  return wrapper(body, frontendUrl);
};


/* ════════════════════════════════════════════════════════════
   TEMPLATE 2 — Project / Wall Magazine Registration Confirmation
   ════════════════════════════════════════════════════════════ */
const projectConfirmationEmail = ({ registration, paymentDetails, amount, frontendUrl = 'https://www.wicebd.com' }) => {
  const members = [
    registration.leader  ? `${registration.leader} (Team Leader)` : null,
    registration.member2 || null,
    registration.member3 || null,
    registration.member4 ? `${registration.member4} (+৳300)` : null,
    registration.member5 ? `${registration.member5} (+৳300)` : null,
    registration.member6 ? `${registration.member6} (+৳300)` : null,
  ].filter(Boolean);

  const body = `
    ${heroBanner('Registration Confirmed', `WICE Bangladesh &mdash; ${registration.competitionCategory}`)}
    ${bodyStart()}
      <p style="margin:0 0 20px;font-size:15px;color:${COLOR.textMain};line-height:1.75;">
        Dear <strong>${registration.leader}</strong>,
      </p>
      <p style="margin:0 0 28px;font-size:14px;color:${COLOR.textSub};line-height:1.8;">
        Your payment has been received and your registration is now <strong style="color:${COLOR.primary};">confirmed</strong>. Please keep this email for your records.
      </p>

      ${sectionHeading('Payment Details')}
      ${infoTable([
        { label: 'Payment ID',      value: paymentDetails.paymentID || '—' },
        { label: 'Transaction ID',  value: paymentDetails.trxID || '—' },
        { label: 'Amount Paid',     value: `${amount} BDT` },
        { label: 'Payment Status',  value: 'Completed' },
      ])}

      ${sectionHeading('Team Information')}
      ${infoTable([
        { label: 'Project Title',    value: registration.projectTitle || '—' },
        { label: 'Competition',      value: registration.competitionCategory || '—' },
        { label: 'Team Members',     value: members.map(m => `<span style="display:block;">${m}</span>`).join('') },
      ])}

      ${sectionHeading('What Happens Next')}
      ${stepsList([
        'Save this confirmation email — you may be asked to present your Payment ID on event day.',
        'Join our official participants group for announcements and updates.',
        'Visit <a href="${frontendUrl}" style="color:${COLOR.primary};font-weight:600;">wicebd.com</a> regularly for schedule and venue updates.',
        'Log in to your dashboard to generate your participant ID card.',
      ])}

      ${ctaButton('Open My Dashboard &rarr;', `${frontendUrl}/dashboard`)}

      ${divider()}
      <p style="margin:0 0 28px;font-size:12px;color:${COLOR.textMuted};text-align:center;">
        Questions? Reach us at <a href="mailto:contact@wicebd.com" style="color:${COLOR.primary};font-weight:700;">contact@wicebd.com</a>
      </p>
    ${bodyEnd()}`;

  return wrapper(body, frontendUrl);
};


/* ════════════════════════════════════════════════════════════
   TEMPLATE 3 — Science Olympiad Registration Confirmation
   ════════════════════════════════════════════════════════════ */
const olympiadConfirmationEmail = ({ fullName, registrationId, frontendUrl = 'https://www.wicebd.com' }) => {
  const body = `
    ${heroBanner('Olympiad Registration Confirmed', 'WICE Bangladesh &mdash; Science Olympiad')}
    ${bodyStart()}
      <p style="margin:0 0 20px;font-size:15px;color:${COLOR.textMain};line-height:1.75;">
        Dear <strong>${fullName}</strong>,
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:${COLOR.textSub};line-height:1.8;">
        Congratulations! Your registration for the <strong>WICE Science Olympiad</strong> has been received. Please save your Registration ID below — you will need it on the event day.
      </p>

      ${idBadge('Your Registration ID', registrationId)}

      ${sectionHeading('What Happens Next')}
      ${stepsList([
        'Keep your Registration ID safe — present it at the event venue.',
        'We will send you further details about the competition schedule and syllabus.',
        'Log in to your dashboard to generate your participant ID card.',
        'For any questions, contact <a href="mailto:olympiad@wicebd.com" style="color:${COLOR.primary};font-weight:600;">olympiad@wicebd.com</a>.',
      ])}

      ${ctaButton('Open My Dashboard &rarr;', `${frontendUrl}/dashboard`)}

      ${divider()}
      <p style="margin:0 0 28px;font-size:12px;color:${COLOR.textMuted};text-align:center;">
        Questions about the Olympiad? &nbsp;<a href="mailto:olympiad@wicebd.com" style="color:${COLOR.primary};font-weight:700;">olympiad@wicebd.com</a>
      </p>
    ${bodyEnd()}`;

  return wrapper(body, frontendUrl);
};


/* ════════════════════════════════════════════════════════════
   TEMPLATE 4 — Announcement / Broadcast Email
   ════════════════════════════════════════════════════════════ */
const announcementEmail = ({ title, body: announcementBody, frontendUrl = 'https://www.wicebd.com' }) => {
  const body = `
    ${heroBanner(title, 'WICE Bangladesh &mdash; Official Announcement')}
    ${bodyStart()}
      <div style="font-size:14.5px;color:${COLOR.textSub};line-height:1.9;white-space:pre-wrap;margin:0 0 28px;">
        ${announcementBody}
      </div>

      ${ctaButton('Visit WICE Bangladesh &rarr;', frontendUrl)}

      ${divider()}
      <p style="margin:0 0 28px;font-size:12px;color:${COLOR.textMuted};text-align:center;">
        Stay updated at <a href="${frontendUrl}" style="color:${COLOR.primary};font-weight:700;">wicebd.com</a>
      </p>
    ${bodyEnd()}`;

  return wrapper(body, frontendUrl);
};


module.exports = {
  welcomeEmail,
  projectConfirmationEmail,
  olympiadConfirmationEmail,
  announcementEmail,
};
