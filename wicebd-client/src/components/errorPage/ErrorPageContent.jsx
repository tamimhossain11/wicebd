import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ErrorPageContent = () => (
    <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)',
        minHeight: '100vh', display: 'flex', alignItems: 'center',
    }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.12) 0%,transparent 70%)', top: '-10%', left: '-14%' }} />
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.10) 0%,transparent 70%)', bottom: '-8%', right: '-10%' }} />
            <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,0,42,0.06) 0%,transparent 70%)', top: '50%', left: '45%' }} />
            {/* Top glow line */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '55%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(192,0,42,0.5),transparent)' }} />
        </div>

        <div className="auto-container" style={{ position: 'relative', zIndex: 2, width: '100%', padding: '160px 0 100px' }}>
            <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>

                {/* 404 number */}
                <motion.div
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                >
                    <div style={{
                        fontSize: 'clamp(100px, 18vw, 160px)',
                        fontWeight: 900,
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, rgba(128,0,32,0.8) 0%, rgba(192,0,42,0.4) 50%, rgba(128,0,32,0.15) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.04em',
                        marginBottom: 8,
                        userSelect: 'none',
                    }}>
                        404
                    </div>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>
                        Page Not Found
                    </span>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 24, padding: '40px 36px',
                        marginTop: 36, marginBottom: 32,
                    }}
                >
                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(20px,4vw,26px)', margin: '0 0 14px' }}>
                        Oops! This page doesn't exist.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.8, margin: '0 auto', maxWidth: 420 }}>
                        The page you're looking for may have been moved, renamed, or no longer exists.
                        Let's get you back on track.
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
                >
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ scale: 1.04, y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '14px 40px', borderRadius: 50, border: 'none',
                                background: 'linear-gradient(135deg,#800020,#c0002a)',
                                color: '#fff', fontSize: 15, fontWeight: 700,
                                letterSpacing: '0.04em', cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(128,0,32,0.4)',
                                display: 'inline-block',
                            }}
                        >
                            Go to Home
                        </motion.div>
                    </Link>
                    <Link to="/contact" style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '14px 40px', borderRadius: 50,
                                border: '1px solid rgba(255,255,255,0.14)',
                                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
                                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                                display: 'inline-block',
                            }}
                        >
                            Contact Us
                        </motion.div>
                    </Link>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12, marginTop: 28 }}
                >
                    Need help?{' '}
                    <a href="mailto:contact@wicebd.com" style={{ color: '#c0002a', textDecoration: 'none' }}>contact@wicebd.com</a>
                </motion.p>
            </div>
        </div>
    </div>
);

export default ErrorPageContent;
