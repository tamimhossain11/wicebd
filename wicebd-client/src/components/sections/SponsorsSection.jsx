import React from 'react';
import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

/* ──────────────────────────────────────────────────────
   Running headline ticker
────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
    '🏆 WICE Bangladesh 2025',
    '⚡ Innovation · Technology · Science',
    '🤖 Robo Soccer',
    '📐 Science Olympiad',
    '💡 Project Display',
    '📰 Wall Magazine',
    '🌏 Dreams of Bangladesh',
    '🥇 14 Gold Medals Internationally',
];

const TickerBand = ({ reverse = false }) => {
    const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
    return (
        <div style={{ overflow: 'hidden', width: '100%' }}>
            <motion.div
                style={{
                    display: 'flex', gap: '60px', whiteSpace: 'nowrap',
                    willChange: 'transform',
                }}
                animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
                transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            >
                {items.map((item, i) => (
                    <span key={i} style={{
                        fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.55)',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        flexShrink: 0,
                    }}>
                        {item}
                        <span style={{ color: '#800020', margin: '0 30px', fontSize: '8px' }}>◆</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

/* ──────────────────────────────────────────────────────
   Partner logo cards — text-based (no external images)
────────────────────────────────────────────────────── */
const PARTNERS = [
    { name: 'Firm Fresh', icon: 'bi-building-fill', cat: 'Event Organizer' },
    { name: 'Dhaka Imperial College', icon: 'bi-mortarboard-fill', cat: 'Host Institution' },
    { name: 'IFIA', icon: 'bi-globe', cat: 'International Partner' },
    { name: 'Ministry of Education', icon: 'bi-bank', cat: 'Government Body' },
    { name: 'Channel i', icon: 'bi-camera-video-fill', cat: 'Media Partner' },
    { name: 'Daily Prothom Alo', icon: 'bi-newspaper', cat: 'Media Partner' },
    { name: 'SEGI University', icon: 'bi-award-fill', cat: 'Global Host' },
    { name: 'INPEX', icon: 'bi-stars', cat: 'Innovation Expo' },
];

const PartnerCard = ({ partner, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07, duration: 0.45 }}
        whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(128,0,32,0.2)' }}
        style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px 20px',
            textAlign: 'center',
            cursor: 'default',
            transition: 'all 0.3s ease',
        }}
    >
        <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(128,0,32,0.3), rgba(128,0,32,0.1))',
            border: '1px solid rgba(128,0,32,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
        }}>
            <i className={partner.icon} style={{ fontSize: '1.4rem', color: '#800020' }}></i>
        </div>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{partner.name}</div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{partner.cat}</div>
    </motion.div>
);

/* ──────────────────────────────────────────────────────
   Main section
────────────────────────────────────────────────────── */
const SponsorsSection = () => {
    return (
        <section style={{
            position: 'relative',
            background: 'linear-gradient(180deg, #0a0610 0%, #08040c 100%)',
            padding: '0 0 90px',
            overflow: 'hidden',
        }}>
            {/* Top ticker band */}
            <div style={{
                background: 'rgba(128,0,32,0.12)',
                borderTop: '1px solid rgba(128,0,32,0.25)',
                borderBottom: '1px solid rgba(128,0,32,0.25)',
                padding: '14px 0',
                marginBottom: '80px',
            }}>
                <TickerBand />
            </div>

            {/* Ambient blob */}
            <motion.div
                style={{
                    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                    width: 600, height: 600, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(128,0,32,0.1), transparent 70%)',
                    filter: 'blur(80px)', pointerEvents: 'none',
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>
                {/* Section header */}
                <motion.div
                    className="text-center"
                    style={{ marginBottom: '56px' }}
                    initial={{ opacity: 0, y: -24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.22em',
                        fontWeight: 700, color: '#800020', marginBottom: '14px',
                    }}>
                        <span style={{ width: 28, height: 1, background: '#800020', display: 'inline-block' }} />
                        Backed By
                        <span style={{ width: 28, height: 1, background: '#800020', display: 'inline-block' }} />
                    </span>
                    <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '40px', margin: 0, lineHeight: 1.2 }}>
                        Our Partners
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginTop: '14px', maxWidth: '480px', margin: '14px auto 0', lineHeight: 1.75 }}>
                        Proudly supported by leading institutions, government bodies, and media organisations.
                    </p>
                </motion.div>

                {/* Partners grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                    gap: '18px',
                }}>
                    {PARTNERS.map((p, i) => <PartnerCard key={i} partner={p} index={i} />)}
                </div>

                {/* Bottom second ticker (reverse) */}
                <div style={{
                    marginTop: '64px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '28px',
                }}>
                    <TickerBand reverse />
                </div>
            </div>
        </section>
    );
};

export default SponsorsSection;
