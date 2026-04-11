import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

/* tiny floating particle */
const Particle = ({ style }) => (
    <motion.div
        style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', ...style }}
        animate={{ y: [0, -18, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
    />
);

const PARTICLES = [
    { width: 6, height: 6, background: '#10b981', top: '18%', left: '12%' },
    { width: 4, height: 4, background: '#34d399', top: '35%', left: '7%' },
    { width: 8, height: 8, background: '#800020', top: '55%', left: '15%' },
    { width: 5, height: 5, background: '#10b981', top: '22%', right: '10%' },
    { width: 7, height: 7, background: '#34d399', top: '65%', right: '8%' },
    { width: 4, height: 4, background: '#c0002a', top: '42%', right: '14%' },
];

const Step = ({ num, text, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay }}
        style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
        <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#10b981',
        }}>{num}</div>
        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7, paddingTop: 5 }}>{text}</span>
    </motion.div>
);

export default function ThankYou() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" parentMenu="register" />

            <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#060010 0%,#0d0006 40%,#0a1a00 70%,#0d0006 100%)', minHeight: '100vh' }}>

                {/* Decorative blobs */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', top: '10%', left: '-10%' }} />
                    <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(128,0,32,0.1) 0%, transparent 70%)', bottom: '10%', right: '-8%' }} />
                    <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', top: '55%', left: '40%' }} />
                </div>

                {/* Floating particles */}
                {PARTICLES.map((p, i) => <Particle key={i} style={p} />)}

                {/* Hero */}
                <section style={{ padding: '160px 0 40px', position: 'relative' }}>
                    <div className="auto-container" style={{ textAlign: 'center' }}>
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#10b981' }}>
                                Registration Complete
                            </span>
                            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(32px,5vw,50px)', margin: '12px 0 14px', lineHeight: 1.15 }}>
                                You're In! 🎉
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
                                Your payment was successful and your spot at <strong style={{ color: 'rgba(255,255,255,0.7)' }}>WICEBD 2025</strong> is confirmed.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Body */}
                <section style={{ padding: '20px 0 120px', position: 'relative' }}>
                    <div className="auto-container">
                        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Main success card */}
                            <motion.div
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                                    border: '1px solid rgba(16,185,129,0.25)',
                                    borderRadius: 24, padding: '52px 32px 40px',
                                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                                }}
                            >
                                {/* Card glow */}
                                <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                                {/* Animated checkmark ring */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.5, delay: 0.25, type: 'spring', stiffness: 220, damping: 14 }}
                                    style={{
                                        width: 88, height: 88, borderRadius: '50%', margin: '0 auto 28px',
                                        background: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(5,100,60,0.12))',
                                        border: '2px solid rgba(16,185,129,0.45)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 0 0 12px rgba(16,185,129,0.06), 0 12px 40px rgba(16,185,129,0.2)',
                                        position: 'relative',
                                    }}
                                >
                                    <motion.svg
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        width="40" height="40" viewBox="0 0 24 24" fill="none"
                                        stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                        transition={{ duration: 0.5, delay: 0.55 }}
                                    >
                                        <motion.polyline
                                            points="20 6 9 17 4 12"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5, delay: 0.55 }}
                                        />
                                    </motion.svg>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 24, margin: '0 0 10px' }}>
                                        Payment Confirmed
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.8, maxWidth: 380, margin: '0 auto 16px' }}>
                                        A confirmation email has been dispatched to your inbox with full registration details.
                                    </p>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                                        borderRadius: 50, padding: '7px 20px',
                                    }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                                        <span style={{ color: '#10b981', fontSize: 13, fontWeight: 700 }}>Welcome to WICEBD 2025</span>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* What's next */}
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.25 }}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 20, padding: '28px 32px',
                                }}
                            >
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                                    <div style={{ width: 3, height: 16, borderRadius: 2, background: '#800020' }} />
                                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>
                                        What happens next
                                    </span>
                                </div>
                                <Step num="1" text="Check your email inbox — a confirmation with your registration ID has been sent." delay={0.35} />
                                <Step num="2" text="Join our official participants' group. The invite link will be sent to your email." delay={0.45} />
                                <Step num="3" text="Follow us on social media and keep an eye on wicebd.com for the event schedule." delay={0.55} />
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
                                    onClick={() => navigate('/dashboard')}
                                    whileHover={{ scale: 1.04, y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        padding: '15px 40px', borderRadius: 50, border: 'none',
                                        background: 'linear-gradient(135deg,#800020,#c0002a)',
                                        color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '0.04em',
                                        boxShadow: '0 10px 30px rgba(128,0,32,0.45)', cursor: 'pointer',
                                    }}
                                >
                                    Go to Dashboard →
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
                                Questions? Reach us at{' '}
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
