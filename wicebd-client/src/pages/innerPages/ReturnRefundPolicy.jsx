import React from 'react';
import { Link } from 'react-router-dom';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: 36 }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid rgba(128,0,32,0.3)' }}>{title}</h3>
        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.9 }}>{children}</div>
    </div>
);

export default function ReturnRefundPolicy() {
    return (
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" />

            {/* Hero */}
            <section style={{ position: 'relative', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', padding: '160px 0 72px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.2),transparent 70%)', top: -100, left: -80, filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>Legal</span>
                    <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 44, margin: '10px 0 12px', lineHeight: 1.15 }}>Return &amp; Refund Policy</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
                        Last updated: April 2026 — Our policy on cancellations, returns, and refunds for WICEBD registrations.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)', padding: '64px 0 100px' }}>
                <div className="auto-container">
                    <div style={{
                        maxWidth: 860, margin: '0 auto',
                        background: 'rgba(255,255,255,0.042)',
                        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderTop: '3px solid #800020',
                        borderRadius: 20,
                        padding: '48px 52px 56px',
                        boxShadow: '0 20px 56px rgba(0,0,0,0.45)',
                    }}>

                        {/* Notice box */}
                        <div style={{ padding: '18px 24px', background: 'rgba(128,0,32,0.12)', borderRadius: 12, border: '1px solid rgba(128,0,32,0.35)', marginBottom: 36 }}>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                                <strong style={{ color: '#fff' }}>Important Notice:</strong> As WICEBD is a competition registration service, physical product returns do not apply. This policy covers registration fees and any physical competition materials (e.g. T-shirts, certificates) ordered as part of registration packages.
                            </p>
                        </div>

                        <Section title="1. Registration Fee Refunds">
                            <p>Registration fees are generally <strong style={{ color: '#fff' }}>non-refundable</strong> once a payment has been successfully processed. However, we may consider refunds in the following circumstances:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 12 }}>
                                <li style={{ marginBottom: 10 }}>
                                    <strong style={{ color: '#fff' }}>Duplicate Payment:</strong> If you are charged more than once for the same registration due to a technical error, a full refund of the duplicate charge will be issued within 7–10 business days.
                                </li>
                                <li style={{ marginBottom: 10 }}>
                                    <strong style={{ color: '#fff' }}>Event Cancellation by Organisers:</strong> If WICEBD cancels the entire event (not just a postponement), registered participants will receive a full refund of their registration fee within 14 business days.
                                </li>
                                <li style={{ marginBottom: 10 }}>
                                    <strong style={{ color: '#fff' }}>Eligibility Rejection:</strong> If a registration is rejected by the organisers due to eligibility non-compliance and payment has already been made, a full refund will be processed within 7 business days.
                                </li>
                            </ul>
                        </Section>

                        <Section title="2. Cancellation by Participant">
                            <p>If a participant or team wishes to cancel their registration:</p>
                            <div style={{ overflowX: 'auto', marginTop: 12 }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(128,0,32,0.2)' }}>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', borderBottom: '1px solid rgba(128,0,32,0.3)' }}>Cancellation Timeline</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', borderBottom: '1px solid rgba(128,0,32,0.3)' }}>Refund Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ['More than 30 days before the event', '50% of registration fee'],
                                            ['15–30 days before the event', '25% of registration fee'],
                                            ['Less than 15 days before the event', 'No refund'],
                                            ['No-show on event day', 'No refund'],
                                        ].map(([time, refund], i) => (
                                            <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                                                <td style={{ padding: '11px 16px', color: 'rgba(255,255,255,0.65)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{time}</td>
                                                <td style={{ padding: '11px 16px', color: 'rgba(255,255,255,0.65)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{refund}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p style={{ marginTop: 14 }}>To request a cancellation, email <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a' }}>contact@wicebd.com</a> with your registration details and reason for cancellation.</p>
                        </Section>

                        <Section title="3. Physical Materials (T-Shirts, Kits)">
                            <p>If your registration package includes physical items such as T-shirts or competition kits:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>Size exchanges are permitted if requested within 48 hours of registration and before items are produced/dispatched.</li>
                                <li style={{ marginBottom: 8 }}>Defective or incorrect items will be replaced at no additional cost. Please report issues within 3 days of receipt with photographic evidence to <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a' }}>contact@wicebd.com</a>.</li>
                                <li style={{ marginBottom: 8 }}>No returns or exchanges are accepted for correctly delivered, undamaged items.</li>
                            </ul>
                        </Section>

                        <Section title="4. Refund Process">
                            <p>Approved refunds will be processed to the original payment method (bKash account) used during registration. Processing typically takes:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>bKash: 3–7 business days</li>
                                <li style={{ marginBottom: 8 }}>Bank transfer (if applicable): 7–14 business days</li>
                            </ul>
                        </Section>

                        <Section title="5. Event Postponement">
                            <p>In the event of a postponement (rather than cancellation), registrations will automatically transfer to the new date. Participants who cannot attend the rescheduled date may request a refund within 7 days of the postponement announcement, subject to a 10% administrative fee.</p>
                        </Section>

                        <Section title="6. Contact for Refund Requests">
                            <div style={{ marginTop: 4, padding: '20px 24px', background: 'rgba(128,0,32,0.1)', borderRadius: 12, border: '1px solid rgba(128,0,32,0.25)' }}>
                                <p style={{ margin: 0 }}><strong style={{ color: '#fff' }}>Dreams of Bangladesh</strong><br />
                                    737/728, West Shewrapara, Mirpur, Dhaka-1216<br />
                                    Phone: +880 1754-002201<br />
                                    Email: <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a' }}>contact@wicebd.com</a> &nbsp;|&nbsp; <a href="mailto:wicebangladeshofficial@gmail.com" style={{ color: '#c0002a' }}>wicebangladeshofficial@gmail.com</a>
                                </p>
                            </div>
                        </Section>

                        {/* Back links */}
                        <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                            <Link to="/terms-and-conditions" style={{ color: '#c0002a', fontSize: 14, textDecoration: 'none' }}>Terms &amp; Conditions</Link>
                            <Link to="/privacy-policy" style={{ color: '#c0002a', fontSize: 14, textDecoration: 'none' }}>Privacy Policy</Link>
                            <Link to="/delivery-policy" style={{ color: '#c0002a', fontSize: 14, textDecoration: 'none' }}>Delivery Policy</Link>
                        </div>
                    </div>
                </div>
            </section>

            <FooterV2 />
        </div>
    );
}
