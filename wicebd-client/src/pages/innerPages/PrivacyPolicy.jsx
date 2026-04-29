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

export default function PrivacyPolicy() {
    return (
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" />

            {/* Hero */}
            <section style={{ position: 'relative', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', padding: '160px 0 72px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.2),transparent 70%)', top: -100, left: -80, filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>Legal</span>
                    <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 44, margin: '10px 0 12px', lineHeight: 1.15 }}>Privacy Policy</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
                        Last updated: April 2026 — How WICEBD collects, uses, and protects your personal information.
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
                        <Section title="1. Introduction">
                            <p>World Invention Competition &amp; Exhibition Bangladesh (WICEBD), organised by Dreams of Bangladesh, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or register for our competitions.</p>
                            <p style={{ marginTop: 10 }}>By using our services, you consent to the data practices described in this policy.</p>
                        </Section>

                        <Section title="2. Information We Collect">
                            <p>We may collect the following types of personal information:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}><strong style={{ color: '#fff' }}>Personal Identification:</strong> Full name, email address, phone number, WhatsApp number, mailing address.</li>
                                <li style={{ marginBottom: 8 }}><strong style={{ color: '#fff' }}>Academic Information:</strong> Institution name, education level, team/project details.</li>
                                <li style={{ marginBottom: 8 }}><strong style={{ color: '#fff' }}>Payment Information:</strong> Payment transaction IDs processed via bKash (we do not store card or banking credentials).</li>
                                <li style={{ marginBottom: 8 }}><strong style={{ color: '#fff' }}>Usage Data:</strong> IP address, browser type, pages visited, and time spent on our website.</li>
                            </ul>
                        </Section>

                        <Section title="3. How We Use Your Information">
                            <p>We use your information to:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>Process registrations and verify eligibility for competitions.</li>
                                <li style={{ marginBottom: 8 }}>Communicate competition schedules, results, and announcements.</li>
                                <li style={{ marginBottom: 8 }}>Process payments and issue receipts or certificates.</li>
                                <li style={{ marginBottom: 8 }}>Improve our website, services, and competition management.</li>
                                <li style={{ marginBottom: 8 }}>Comply with legal obligations and resolve disputes.</li>
                            </ul>
                        </Section>

                        <Section title="4. Data Sharing & Disclosure">
                            <p>We do not sell, trade, or rent your personal information to third parties. We may share data with:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>International partner organisations (e.g. SEGI University, Malaysia) strictly for competition coordination.</li>
                                <li style={{ marginBottom: 8 }}>Payment processors (bKash) solely to complete transactions.</li>
                                <li style={{ marginBottom: 8 }}>Government authorities if required by law in Bangladesh.</li>
                            </ul>
                        </Section>

                        <Section title="5. Data Security">
                            <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
                        </Section>

                        <Section title="6. Data Retention">
                            <p>We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable laws and regulations of Bangladesh. Registration data may be retained for up to five (5) years for record-keeping purposes.</p>
                        </Section>

                        <Section title="7. Your Rights">
                            <p>You have the right to:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>Access the personal data we hold about you.</li>
                                <li style={{ marginBottom: 8 }}>Request correction of inaccurate data.</li>
                                <li style={{ marginBottom: 8 }}>Request deletion of your data (subject to legal obligations).</li>
                                <li style={{ marginBottom: 8 }}>Withdraw consent at any time (where processing is based on consent).</li>
                            </ul>
                            <p style={{ marginTop: 10 }}>To exercise these rights, contact us at <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a' }}>contact@wicebd.com</a>.</p>
                        </Section>

                        <Section title="8. Participant Data Change Policy">
                            <p>If a registered participant requires any changes to their registration data (including but not limited to name, institution, T-shirt size, or team member details) after a successful registration, the following conditions apply:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>A <strong style={{ color: '#fff' }}>data change fee of ৳100 (BDT)</strong> is applicable per request.</li>
                                <li style={{ marginBottom: 8 }}>An official request must be submitted by email to <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a' }}>contact@wicebd.com</a> with all necessary details including your registration ID, payment transaction ID, the specific data to be changed, and the corrected information.</li>
                                <li style={{ marginBottom: 8 }}>Requests are subject to review and will be processed at the discretion of the WICEBD organising team.</li>
                                <li style={{ marginBottom: 8 }}>Data changes are not guaranteed and may not be accommodated after certain deadlines set by the organisers.</li>
                            </ul>
                        </Section>

                        <Section title="9. Cookies">
                            <p>Our website may use cookies to enhance your browsing experience. You may choose to set your browser to refuse cookies, though this may affect the functionality of some parts of the website.</p>
                        </Section>

                        <Section title="10. Changes to This Policy">
                            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after any changes constitutes your acceptance of the new policy.</p>
                        </Section>

                        <Section title="11. Contact Us">
                            <p>For any questions regarding this Privacy Policy, please contact:</p>
                            <div style={{ marginTop: 12, padding: '20px 24px', background: 'rgba(128,0,32,0.1)', borderRadius: 12, border: '1px solid rgba(128,0,32,0.25)' }}>
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
                            <Link to="/return-refund-policy" style={{ color: '#c0002a', fontSize: 14, textDecoration: 'none' }}>Return &amp; Refund Policy</Link>
                            <Link to="/delivery-policy" style={{ color: '#c0002a', fontSize: 14, textDecoration: 'none' }}>Delivery Policy</Link>
                        </div>
                    </div>
                </div>
            </section>

            <FooterV2 />
        </div>
    );
}
