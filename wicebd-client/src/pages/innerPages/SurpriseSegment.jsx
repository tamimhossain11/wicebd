import React from 'react';
import { motion } from 'framer-motion';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

export default function SurpriseSegment() {
    return (
        <>
            <HeaderV1 headerStyle="header-style-two" parentMenu="register" />
            <div className="page-wrapper">
                <span className="header-span" />

                {/* Hero */}
                <section style={{
                    position: 'relative',
                    background: 'linear-gradient(160deg, #0d0006 0%, #1a000a 50%, #2a0010 100%)',
                    padding: '160px 0 100px',
                    overflow: 'hidden',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    {/* Ambient blobs */}
                    <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.18),transparent 70%)', top: '10%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.12),transparent 70%)', bottom: '10%', left: '10%', filter: 'blur(60px)', pointerEvents: 'none' }} />

                    <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>

                        {/* Pulsing question mark */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                            style={{ marginBottom: 40 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
                                    background: 'linear-gradient(135deg, rgba(128,0,32,0.25), rgba(128,0,32,0.08))',
                                    border: '2px solid rgba(128,0,32,0.4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 64, color: '#800020',
                                    boxShadow: '0 0 60px rgba(128,0,32,0.3)',
                                }}
                            >
                                ?
                            </motion.div>
                        </motion.div>

                        {/* Label */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                            <span style={{
                                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.28em',
                                fontWeight: 700, color: '#800020', display: 'block', marginBottom: 16,
                            }}>
                                WICEBD 2025 · Coming Soon
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(36px,7vw,72px)', lineHeight: 1.1, margin: '0 0 24px' }}
                        >
                            Surprise<br />
                            <span style={{ color: '#800020' }}>Segment</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.55 }}
                            style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.9 }}
                        >
                            Something extraordinary is being prepared for WICE Bangladesh 2025.
                            A brand-new competition segment will be revealed at the event.
                            Stay tuned for the big announcement.
                        </motion.p>

                        {/* Teaser cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65, duration: 0.55 }}
                            style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}
                        >
                            {[
                                { icon: '🎯', label: 'All Levels' },
                                { icon: '🏆', label: 'Prizes Await' },
                                { icon: '⚡', label: 'On-Site Reveal' },
                            ].map(({ icon, label }) => (
                                <div key={label} style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(128,0,32,0.3)',
                                    borderRadius: 12,
                                    padding: '16px 28px',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    backdropFilter: 'blur(12px)',
                                }}>
                                    <span style={{ fontSize: 22 }}>{icon}</span>
                                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{label}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <motion.a
                                href="/registration"
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 10,
                                    background: 'linear-gradient(135deg, #800020, #c0002a)',
                                    color: '#fff', fontWeight: 700, fontSize: 14,
                                    padding: '15px 40px', borderRadius: 50,
                                    boxShadow: '0 8px 28px rgba(128,0,32,0.45)',
                                    textDecoration: 'none', letterSpacing: '0.05em',
                                }}
                            >
                                Register for WICE 2025 →
                            </motion.a>
                        </motion.div>

                        {/* Animated dots row */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 52 }}>
                            {[0, 1, 2, 3, 4].map(i => (
                                <motion.div
                                    key={i}
                                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#800020' }}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <FooterV2 />
            </div>
        </>
    );
}
