import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

const Particle = ({ style }) => (
    <motion.div
        style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', ...style }}
        animate={{ y: [0, -14, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
    />
);

const PARTICLES = [
    { width: 5, height: 5, background: '#fbbf24', top: '22%', left: '11%' },
    { width: 4, height: 4, background: '#f59e0b', top: '45%', left: '7%' },
    { width: 7, height: 7, background: '#800020', top: '60%', left: '13%' },
    { width: 5, height: 5, background: '#fbbf24', top: '28%', right: '10%' },
    { width: 4, height: 4, background: '#f59e0b', top: '55%', right: '8%' },
    { width: 6, height: 6, background: '#c0002a', top: '38%', right: '15%' },
];

export default function PaymentCancelled() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" parentMenu="register" />

            <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', minHeight: '100vh' }}>

                {/* Decorative blobs */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)', top: '5%', left: '-10%' }} />
                    <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(128,0,32,0.09) 0%, transparent 70%)', bottom: '8%', right: '-8%' }} />
                    <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)', top: '52%', left: '44%' }} />
                </div>

                {/* Floating particles */}
                {PARTICLES.map((p, i) => <Particle key={i} style={p} />)}

                {/* Hero */}
                <section style={{ padding: '160px 0 40px', position: 'relative' }}>
                    <div className="auto-container" style={{ textAlign: 'center' }}>
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>
                                Payment Status
                            </span>
                            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(32px,5vw,50px)', margin: '12px 0 14px', lineHeight: 1.15 }}>
                                Payment Cancelled
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
                                You left before completing the payment. Your registration slot is still available — come back anytime.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Body */}
                <section style={{ padding: '20px 0 120px', position: 'relative' }}>
                    <div className="auto-container">
                        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Main card */}
                            <motion.div
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(251,191,36,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                    border: '1px solid rgba(251,191,36,0.2)',
                                    borderRadius: 24, padding: '52px 32px 40px',
                                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                                }}
                            >
                                {/* Card glow */}
                                <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                                {/* Animated icon ring */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.45, delay: 0.25, type: 'spring', stiffness: 200, damping: 14 }}
                                    style={{
                                        width: 88, height: 88, borderRadius: '50%', margin: '0 auto 28px',
                                        background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(180,120,0,0.08))',
                                        border: '2px solid rgba(251,191,36,0.35)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 0 0 12px rgba(251,191,36,0.04), 0 12px 40px rgba(251,191,36,0.12)',
                                    }}
                                >
                                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 8 12 12 14 14" />
                                    </svg>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 24, margin: '0 0 10px' }}>
                                        Payment Not Completed
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.8, maxWidth: 380, margin: '0 auto 18px' }}>
                                        It looks like the payment session was cancelled. This can happen if you navigated away or the session timed out.
                                    </p>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                                        borderRadius: 50, padding: '7px 20px',
                                    }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fbbf24' }} />
                                        <span style={{ color: '#fbbf24', fontSize: 13, fontWeight: 700 }}>No charge was made to your account</span>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Info panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.25 }}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 20, padding: '28px 32px',
                                    display: 'flex', flexDirection: 'column', gap: 16,
                                }}
                            >
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <div style={{ width: 3, height: 16, borderRadius: 2, background: '#800020' }} />
                                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>
                                        Good to know
                                    </span>
                                </div>
                                {[
                                    { icon: '🔒', text: 'Your data is safe — nothing was submitted or charged during this session.' },
                                    { icon: '🔁', text: 'You can retry registration anytime. All your form details will need to be re-entered.' },
                                    { icon: '📩', text: 'Need help completing registration? Contact us at contact@wicebd.com.' },
                                ].map(({ icon, text }, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.35, delay: 0.35 + i * 0.1 }}
                                        style={{
                                            display: 'flex', gap: 14, alignItems: 'flex-start',
                                            padding: '12px 16px', borderRadius: 12,
                                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.65 }}>{text}</span>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
                            >
                                <motion.button
                                    type="button"
                                    onClick={() => navigate('/registration')}
                                    whileHover={{ scale: 1.04, y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        padding: '15px 40px', borderRadius: 50, border: 'none',
                                        background: 'linear-gradient(135deg,#800020,#c0002a)',
                                        color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '0.04em',
                                        boxShadow: '0 10px 30px rgba(128,0,32,0.45)', cursor: 'pointer',
                                    }}
                                >
                                    Register Again →
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        padding: '15px 40px', borderRadius: 50,
                                        border: '1px solid rgba(255,255,255,0.14)',
                                        background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
                                        fontSize: 15, fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    Back to Home
                                </motion.button>
                            </motion.div>

                            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: 12, marginTop: -4 }}>
                                Need support?{' '}
                                <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a', textDecoration: 'none' }}>contact@wicebd.com</a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <FooterV2 />
        </div>
    );
}
