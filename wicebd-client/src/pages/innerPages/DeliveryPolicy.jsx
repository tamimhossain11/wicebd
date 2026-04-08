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

export default function DeliveryPolicy() {
    return (
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" />

            {/* Hero */}
            <section style={{ position: 'relative', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', padding: '160px 0 72px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.2),transparent 70%)', top: -100, left: -80, filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>Legal</span>
                    <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 44, margin: '10px 0 12px', lineHeight: 1.15 }}>Delivery Policy</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
                        Last updated: April 2026 — How WICEBD delivers digital confirmations and physical competition materials.
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

                        <Section title="1. Digital Deliverables">
                            <p>Upon successful registration and payment, the following digital items will be delivered to your registered email address:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>
                                    <strong style={{ color: '#fff' }}>Registration Confirmation:</strong> An email confirmation will be sent within <strong style={{ color: '#fff' }}>24 hours</strong> of successful payment.
                                </li>
                                <li style={{ marginBottom: 8 }}>
                                    <strong style={{ color: '#fff' }}>Participant ID / QR Code:</strong> Issued within <strong style={{ color: '#fff' }}>3–5 business days</strong> of registration close, to be used for event check-in.
                                </li>
                                <li style={{ marginBottom: 8 }}>
                                    <strong style={{ color: '#fff' }}>Event Schedule & Guidebook:</strong> Delivered digitally via email at least <strong style={{ color: '#fff' }}>7 days</strong> before the event.
                                </li>
                                <li style={{ marginBottom: 8 }}>
                                    <strong style={{ color: '#fff' }}>Digital Certificate:</strong> Issued within <strong style={{ color: '#fff' }}>14 days</strong> after conclusion of the competition to all participants.
                                </li>
                                <li style={{ marginBottom: 8 }}>
                                    <strong style={{ color: '#fff' }}>Award Certificates (winners):</strong> Issued within <strong style={{ color: '#fff' }}>7 days</strong> after the event for prize-winning entries.
                                </li>
                            </ul>
                            <p style={{ marginTop: 12 }}>Please ensure your email address is entered correctly during registration. WICEBD is not responsible for non-delivery due to incorrect email addresses or spam filters.</p>
                        </Section>

                        <Section title="2. Physical Materials (T-Shirts & Competition Kits)">
                            <p>Where registration packages include physical items (e.g. participant T-shirts, competition kits), the following applies:</p>

                            <h4 style={{ color: '#fff', fontWeight: 600, fontSize: 15, margin: '16px 0 10px' }}>Collection at Event Venue</h4>
                            <ul style={{ paddingLeft: 20 }}>
                                <li style={{ marginBottom: 8 }}>In most cases, physical materials are distributed on-site at the event venue on the day of the competition.</li>
                                <li style={{ marginBottom: 8 }}>Participants must bring their Participant ID or QR Code to collect materials.</li>
                                <li style={{ marginBottom: 8 }}>Uncollected items will not be dispatched after the event unless a prior arrangement has been made in writing.</li>
                            </ul>

                            <h4 style={{ color: '#fff', fontWeight: 600, fontSize: 15, margin: '16px 0 10px' }}>Courier Delivery (if applicable)</h4>
                            <ul style={{ paddingLeft: 20 }}>
                                <li style={{ marginBottom: 8 }}>Where courier delivery is offered, items are dispatched within Bangladesh only.</li>
                                <li style={{ marginBottom: 8 }}>Estimated delivery time: <strong style={{ color: '#fff' }}>3–7 business days</strong> within Dhaka; <strong style={{ color: '#fff' }}>5–10 business days</strong> outside Dhaka.</li>
                                <li style={{ marginBottom: 8 }}>Delivery charges (if any) will be communicated during registration and are payable by the participant.</li>
                                <li style={{ marginBottom: 8 }}>WICEBD is not responsible for delays caused by courier services or incorrect delivery addresses provided by the participant.</li>
                            </ul>
                        </Section>

                        <Section title="3. International Participants">
                            <p>For participants in the International Round (Malaysia):</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>All physical materials for the International Round are distributed on-site at SEGI University, Kuala Lumpur.</li>
                                <li style={{ marginBottom: 8 }}>No international postal deliveries are made.</li>
                                <li style={{ marginBottom: 8 }}>Digital certificates and documents are emailed to registered addresses.</li>
                            </ul>
                        </Section>

                        <Section title="4. Prizes & Trophies">
                            <ul style={{ paddingLeft: 20 }}>
                                <li style={{ marginBottom: 8 }}>Trophies and physical prizes are awarded at the closing ceremony of the respective round.</li>
                                <li style={{ marginBottom: 8 }}>If a prize-winning participant is unable to attend the ceremony, arrangements must be made in advance by contacting <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a' }}>contact@wicebd.com</a>.</li>
                                <li style={{ marginBottom: 8 }}>Cash prizes (if any) are transferred via bKash to the registered mobile number within 14 business days of the event.</li>
                            </ul>
                        </Section>

                        <Section title="5. Delivery Issues">
                            <p>If you have not received your digital confirmation within 24 hours of payment, please:</p>
                            <ol style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>Check your spam/junk mail folder.</li>
                                <li style={{ marginBottom: 8 }}>Verify the email address used during registration in your account dashboard.</li>
                                <li style={{ marginBottom: 8 }}>Contact us at <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a' }}>contact@wicebd.com</a> with your full name and payment transaction ID.</li>
                            </ol>
                        </Section>

                        <Section title="6. Contact Us">
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
                            <Link to="/return-refund-policy" style={{ color: '#c0002a', fontSize: 14, textDecoration: 'none' }}>Return &amp; Refund Policy</Link>
                        </div>
                    </div>
                </div>
            </section>

            <FooterV2 />
        </div>
    );
}
