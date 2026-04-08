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

export default function TermsAndConditions() {
    return (
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" />

            {/* Hero */}
            <section style={{ position: 'relative', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', padding: '160px 0 72px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.2),transparent 70%)', top: -100, left: -80, filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>Legal</span>
                    <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 44, margin: '10px 0 12px', lineHeight: 1.15 }}>Terms &amp; Conditions</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
                        Last updated: April 2026 — Please read these terms carefully before registering for WICEBD.
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
                        <Section title="1. Acceptance of Terms">
                            <p>By accessing our website or registering for the World Invention Competition &amp; Exhibition Bangladesh (WICEBD), you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, you may not use our services.</p>
                            <p style={{ marginTop: 10 }}>WICEBD is organised by Dreams of Bangladesh, a registered organisation in Bangladesh (Trade License No: <strong style={{ color: '#fff' }}>TRAD/DNCC/049995/2024</strong>).</p>
                        </Section>

                        <Section title="2. Eligibility">
                            <ul style={{ paddingLeft: 20 }}>
                                <li style={{ marginBottom: 8 }}>Participants must be students currently enrolled in a recognised educational institution in Bangladesh (or internationally for the international round).</li>
                                <li style={{ marginBottom: 8 }}>Teams must have a minimum of one (1) and a maximum of three (3) members for project categories.</li>
                                <li style={{ marginBottom: 8 }}>Participants must be within the education level specified for their chosen category.</li>
                                <li style={{ marginBottom: 8 }}>Organisers reserve the right to verify eligibility and disqualify any participant found ineligible.</li>
                            </ul>
                        </Section>

                        <Section title="3. Registration">
                            <ul style={{ paddingLeft: 20 }}>
                                <li style={{ marginBottom: 8 }}>Registration is only confirmed upon receipt of the full registration fee payment via bKash.</li>
                                <li style={{ marginBottom: 8 }}>Each team/individual may only register once per competition category.</li>
                                <li style={{ marginBottom: 8 }}>Providing false or inaccurate information during registration may result in immediate disqualification without refund.</li>
                                <li style={{ marginBottom: 8 }}>CR (Campus Representative) reference is required for institutional participants.</li>
                            </ul>
                        </Section>

                        <Section title="4. Payment">
                            <ul style={{ paddingLeft: 20 }}>
                                <li style={{ marginBottom: 8 }}>All fees are quoted and payable in Bangladeshi Taka (BDT ৳).</li>
                                <li style={{ marginBottom: 8 }}>Payments are processed securely via bKash. WICEBD does not store any financial credentials.</li>
                                <li style={{ marginBottom: 8 }}>Registration fees are non-refundable except as stated in our Return &amp; Refund Policy.</li>
                                <li style={{ marginBottom: 8 }}>Failure to complete payment within the stipulated time will result in automatic cancellation of the registration.</li>
                            </ul>
                        </Section>

                        <Section title="5. Intellectual Property">
                            <ul style={{ paddingLeft: 20 }}>
                                <li style={{ marginBottom: 8 }}>Participants retain ownership of their original projects and innovations.</li>
                                <li style={{ marginBottom: 8 }}>By registering, participants grant WICEBD a non-exclusive, royalty-free licence to use project descriptions, photographs, and videos for promotional and educational purposes.</li>
                                <li style={{ marginBottom: 8 }}>Participants must ensure their projects do not infringe any third-party intellectual property rights.</li>
                            </ul>
                        </Section>

                        <Section title="6. Code of Conduct">
                            <ul style={{ paddingLeft: 20 }}>
                                <li style={{ marginBottom: 8 }}>Participants must behave respectfully towards organisers, judges, mentors, and fellow participants.</li>
                                <li style={{ marginBottom: 8 }}>Any form of plagiarism, cheating, or misconduct will result in immediate disqualification.</li>
                                <li style={{ marginBottom: 8 }}>Participants are responsible for their own conduct and the conduct of their team members.</li>
                            </ul>
                        </Section>

                        <Section title="7. Liability Disclaimer">
                            <p>WICEBD and Dreams of Bangladesh shall not be liable for:</p>
                            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                <li style={{ marginBottom: 8 }}>Any loss, damage, injury, or expense incurred in connection with participation in the competition.</li>
                                <li style={{ marginBottom: 8 }}>Any technical issues, website downtime, or payment gateway failures beyond our reasonable control.</li>
                                <li style={{ marginBottom: 8 }}>Cancellation or postponement of the event due to circumstances beyond our control (force majeure), including but not limited to natural disasters, pandemic, or government directives.</li>
                            </ul>
                        </Section>

                        <Section title="8. Event Changes">
                            <p>Organisers reserve the right to modify competition rules, dates, venues, or prize structures at any time. Participants will be notified of material changes via email and official announcements on the website.</p>
                        </Section>

                        <Section title="9. Photography & Media">
                            <p>By participating, you consent to being photographed, filmed, or recorded during the competition. Such media may be used by WICEBD for promotional purposes across all channels without additional compensation.</p>
                        </Section>

                        <Section title="10. Governing Law">
                            <p>These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.</p>
                        </Section>

                        <Section title="11. Contact Us">
                            <p>For queries regarding these Terms &amp; Conditions, please contact:</p>
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
                            <Link to="/privacy-policy" style={{ color: '#c0002a', fontSize: 14, textDecoration: 'none' }}>Privacy Policy</Link>
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
