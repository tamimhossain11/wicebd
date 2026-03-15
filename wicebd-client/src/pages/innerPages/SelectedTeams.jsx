import React from 'react';
import { motion } from 'framer-motion';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

const Orb = ({ style }) => (
    <div style={{
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,rgba(128,0,32,0.22),transparent 70%)',
        filter: 'blur(55px)', ...style,
    }} />
);

const SelectedTeams = () => (
    <div className="page-wrapper">
        <span className="header-span" />
        <HeaderV1 headerStyle="header-style-two" parentMenu="teams" />

        <section style={{
            position: 'relative', minHeight: '100vh', overflow: 'hidden',
            background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
            display: 'flex', alignItems: 'center',
        }}>
            <Orb style={{ width: 520, height: 520, top: -120, left: -80 }} />
            <Orb style={{ width: 380, height: 380, bottom: -80, right: -60 }} />

            {/* Subtle grid pattern */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            <div className="auto-container" style={{ position: 'relative', zIndex: 2, width: '100%', padding: '140px 0 80px' }}>
                <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
                    {/* Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55 }}
                        style={{
                            width: 100, height: 100, borderRadius: '28px', margin: '0 auto 32px',
                            background: 'linear-gradient(135deg,#800020,#4f0014)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 12px 40px rgba(128,0,32,0.5)',
                        }}
                    >
                        <i className="fa fa-users" style={{ color: '#fff', fontSize: 40 }} />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }}>
                        <span style={{
                            display: 'inline-block', fontSize: 11, textTransform: 'uppercase',
                            letterSpacing: '0.24em', fontWeight: 700, color: '#c0002a', marginBottom: 16,
                        }}>
                            8th WICEBD — National Round
                        </span>

                        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(32px,5.5vw,58px)', margin: '0 0 20px', lineHeight: 1.1 }}>
                            Selected Teams for the<br />
                            <span style={{
                                background: 'linear-gradient(135deg,#fff 0%,#ffb8c8 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>National Round</span>
                        </h1>

                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, lineHeight: 1.85, marginBottom: 44, maxWidth: 520, margin: '0 auto 44px' }}>
                            The selected teams for the 8th WICEBD National Round will be announced here
                            once the registration and selection process is complete. Stay tuned!
                        </p>

                        {/* Status badge */}
                        <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                background: 'rgba(128,0,32,0.18)',
                                border: '1px solid rgba(128,0,32,0.4)',
                                borderRadius: 50, padding: '12px 28px', marginBottom: 52,
                            }}
                        >
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c0002a', display: 'inline-block', boxShadow: '0 0 8px rgba(192,0,42,0.8)' }} />
                            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: 600, letterSpacing: '0.06em' }}>
                                Announcement Pending
                            </span>
                        </motion.div>

                        {/* Info cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, maxWidth: 600, margin: '0 auto' }}>
                            {[
                                { icon: 'fa-flag', label: 'Event', val: '8th WICEBD' },
                                { icon: 'fa-map-marker-alt', label: 'Round', val: 'National' },
                                { icon: 'fa-clock', label: 'Status', val: 'Coming Soon' },
                            ].map((item, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 0.45 }}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderTop: '3px solid #800020',
                                        borderRadius: 16, padding: '20px',
                                    }}
                                >
                                    <i className={`fa ${item.icon}`} style={{ color: '#800020', fontSize: 20, marginBottom: 10, display: 'block' }} />
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{item.val}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        <FooterV2 />
    </div>
);

export default SelectedTeams;
