import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getMyRegistrations } from '../../api/userAuth';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from "../../components/footer/FooterV2";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(true);

  useEffect(() => {
    getMyRegistrations()
      .then(({ data }) => {
        if (data.success) setRegistrations(data.registrations);
      })
      .catch(() => {})
      .finally(() => setLoadingRegs(false));
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('You have been signed out.');
    navigate('/sign-in');
  };

  const avatarSrc = user?.avatar || null;

  return (
    <div className="page-wrapper">
      <span className="header-span"></span>
      <HeaderV1 headerStyle="header-style-two" />

      {/* ── Hero Banner ── */}
      <section
        className="page-banner"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '80px 0 50px',
        }}
      >
        <div className="auto-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#e94560',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  color: '#fff',
                  fontWeight: 700,
                  flexShrink: 0,
                  border: '3px solid rgba(255,255,255,0.3)',
                }}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 style={{ color: '#fff', margin: 0, fontSize: 26 }}>
                  Welcome, {user?.name}!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="theme-btn btn-style-two"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
            >
              <span className="btn-title">Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Dashboard Body ── */}
      <section style={{ padding: '60px 0', background: '#f8f9fa', minHeight: '60vh' }}>
        <div className="auto-container">
          <div className="row">

            {/* ── Register for WICE Card ── */}
            <div className="col-lg-4 col-md-6" style={{ marginBottom: 30 }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '32px 28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #e94560, #c0392b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <span className="fa fa-pencil-square-o" style={{ fontSize: 24, color: '#fff' }}></span>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: 10 }}>Register for WICE</h4>
                <p style={{ color: '#666', flex: 1, lineHeight: 1.6 }}>
                  Register your team and project for the World Innovation, Creativity &amp; Entrepreneurship (WICE) competition.
                </p>
                <Link
                  to="/registration"
                  className="theme-btn btn-style-two"
                  style={{ marginTop: 20, textAlign: 'center' }}
                >
                  <span className="btn-title">Register Now</span>
                </Link>
              </div>
            </div>

            {/* ── Olympiad Card ── */}
            <div className="col-lg-4 col-md-6" style={{ marginBottom: 30 }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '32px 28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #0f3460, #16213e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <span className="fa fa-trophy" style={{ fontSize: 24, color: '#fff' }}></span>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: 10 }}>Science Olympiad</h4>
                <p style={{ color: '#666', flex: 1, lineHeight: 1.6 }}>
                  Participate in the Science Olympiad section of WICE for school and college students.
                </p>
                <Link
                  to="/registration?tab=olympiad"
                  className="theme-btn btn-style-one"
                  style={{ marginTop: 20, textAlign: 'center' }}
                >
                  <span className="btn-title">Register for Olympiad</span>
                </Link>
              </div>
            </div>

            {/* ── My Registrations Card ── */}
            <div className="col-lg-4 col-md-6" style={{ marginBottom: 30 }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '32px 28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #27ae60, #1e8449)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <span className="fa fa-list-alt" style={{ fontSize: 24, color: '#fff' }}></span>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: 10 }}>My Registrations</h4>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  {loadingRegs
                    ? 'Loading...'
                    : registrations.length === 0
                    ? 'You have no confirmed registrations yet.'
                    : `You have ${registrations.length} confirmed registration(s).`}
                </p>
              </div>
            </div>
          </div>

          {/* ── Registrations Table ── */}
          {!loadingRegs && registrations.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ marginBottom: 20, fontWeight: 700 }}>My Registrations</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table table-hover" style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <thead style={{ background: '#1a1a2e', color: '#fff' }}>
                    <tr>
                      <th style={{ padding: '14px 16px', color: '#fff' }}>#</th>
                      <th style={{ padding: '14px 16px', color: '#fff' }}>Category</th>
                      <th style={{ padding: '14px 16px', color: '#fff' }}>Project Title</th>
                      <th style={{ padding: '14px 16px', color: '#fff' }}>Team Leader</th>
                      <th style={{ padding: '14px 16px', color: '#fff' }}>Amount</th>
                      <th style={{ padding: '14px 16px', color: '#fff' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, idx) => (
                      <tr key={reg.id}>
                        <td style={{ padding: '12px 16px' }}>{idx + 1}</td>
                        <td style={{ padding: '12px 16px' }}>{reg.competitionCategory || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>{reg.projectTitle || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>{reg.leader || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          {reg.amount ? `৳ ${reg.amount}` : '—'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {new Date(reg.created_at).toLocaleDateString('en-BD')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Quick Links ── */}
          <div style={{ marginTop: 40, paddingTop: 30, borderTop: '1px solid #e0e0e0' }}>
            <h5 style={{ fontWeight: 700, marginBottom: 16, color: '#555' }}>Quick Links</h5>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'About WICE', to: '/about-us' },
                { label: 'Schedule', to: '/schedule' },
                { label: 'Speakers', to: '/speakers' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'FAQs', to: '/faqs' },
                { label: 'Contact Us', to: '/contact' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    padding: '8px 18px',
                    border: '1px solid #ddd',
                    borderRadius: 20,
                    color: '#444',
                    textDecoration: 'none',
                    fontSize: 13,
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
};

export default UserDashboard;
