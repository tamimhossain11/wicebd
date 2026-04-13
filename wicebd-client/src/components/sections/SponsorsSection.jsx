import React from 'react';
import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────
   Running headline ticker (top band)
────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
    '🏆 WICE Bangladesh 2025',
    '⚡ Innovation · Technology · Science',
    '🎯 Surprise Segment',
    '📐 Science Olympiad',
    '💡 Project Display',
    '📰 Wall Magazine',
    '🌏 Dreams of Bangladesh',
    '🥇 14 Gold Medals Internationally',
];

const TextTicker = () => {
    const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
    return (
        <div style={{ overflow: 'hidden', width: '100%' }}>
            <motion.div
                style={{ display: 'flex', gap: '60px', whiteSpace: 'nowrap', willChange: 'transform' }}
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            >
                {items.map((item, i) => (
                    <span key={i} style={{
                        fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.55)',
                        textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0,
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
   Partner data
   logo: path in /public — null means text-only fallback
   comingSoon: logo exists but not yet available
────────────────────────────────────────────────────── */
const PARTNERS = [
    {
        name: 'Dreams of Bangladesh',
        logo: '/images/partners/Dob logo.png',
        cat: 'Event Organizer',
    },
    {
        name: 'Northern University Bangladesh',
        logo: '/images/partners/nub.webp',
        cat: 'Hosting partner',
    },  
    {
        name: 'NUB Computer Club',
        logo: '/images/partners/nubcc.jpeg',
        cat: 'Event partner',
    },  
    {
        name: 'SEGI University',
        logo: '/images/partners/SEGi_University_Logo1.jpg',
        cat: 'Global Host',
    },
    {
        name: 'Ministry of Education',
        logo: '/images/partners/ministry_of_education.webp',
        cat: 'Government Body',
    },
    {
        name: 'ICT Division',
        logo: '/images/partners/Information_and_Communication_Technology_Division.svg.png',
        cat: 'Govt. Partner',
    },
    {
        name: 'IYSA',
        logo: '/images/partners/iysa.png',
        cat: 'International Partner',
    },
     {
        name: 'Dhaka Imperial College',
        logo: '/images/partners/Dhaka_Imperial_College.jpg',
        cat: 'Partner Institution',
    },
    {
        name: 'Jagoron',
        logo: '/images/partners/jagoron.png',
        cat: 'Media Partner',
    },
    {
        name: 'Nagorik TV',
        logo: '/images/partners/nagorik-tv.png',
        cat: 'Media Partner',
    },
];

/* logos that have an actual image file — used in scroll strip */
const LOGO_STRIP = PARTNERS.filter(p => p.logo !== null);

/* ──────────────────────────────────────────────────────
   Single partner card
────────────────────────────────────────────────────── */
const PartnerCard = ({ partner, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07, duration: 0.45 }}
        whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(128,0,32,0.18)' }}
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
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        {partner.comingSoon && (
            <div style={{
                position: 'absolute', top: 8, right: 8,
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: '#800020',
                background: 'rgba(128,0,32,0.12)', border: '1px solid rgba(128,0,32,0.25)',
                borderRadius: 50, padding: '2px 7px',
            }}>
                Soon
            </div>
        )}

        {/* Logo box */}
        <div style={{
            width: 90, height: 64,
            background: partner.logo ? 'rgba(255,255,255,0.92)' : 'linear-gradient(135deg,rgba(128,0,32,0.25),rgba(128,0,32,0.1))',
            border: partner.logo ? 'none' : '1px solid rgba(128,0,32,0.3)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            padding: partner.logo ? '8px 10px' : 0,
            overflow: 'hidden',
        }}>
            {partner.logo ? (
                <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{
                        maxWidth: '100%', maxHeight: '100%',
                        width: 'auto', height: 'auto',
                        objectFit: 'contain', display: 'block',
                    }}
                />
            ) : (
                <span style={{
                    fontWeight: 900, fontSize: partner.initials?.length > 3 ? 13 : 18,
                    color: '#c0002a', letterSpacing: '0.05em',
                }}>
                    {partner.initials}
                </span>
            )}
        </div>

        <div style={{ fontWeight: 700, color: '#fff', fontSize: '13px', marginBottom: '4px' }}>
            {partner.name}
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {partner.cat}
        </div>
    </motion.div>
);

/* ──────────────────────────────────────────────────────
   Logo scroll strip — uniform 64 px height, white card
────────────────────────────────────────────────────── */
const LogoScrollStrip = ({ reverse = false }) => {
    const doubled = [...LOGO_STRIP, ...LOGO_STRIP];
    return (
        <div style={{ overflow: 'hidden', position: 'relative' }}>
            {/* Fade edges */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
                background: 'linear-gradient(90deg, #08040c 0%, transparent 100%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
                background: 'linear-gradient(-90deg, #08040c 0%, transparent 100%)',
                pointerEvents: 'none',
            }} />
            <motion.div
                style={{
                    display: 'flex', gap: 16,
                    alignItems: 'center', width: 'max-content',
                }}
                animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
                transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
            >
                {doubled.map((p, i) => (
                    <div key={i} style={{
                        flexShrink: 0,
                        width: 140, height: 64,
                        background: 'rgba(255,255,255,0.92)',
                        borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '8px 14px',
                        overflow: 'hidden',
                    }}>
                        <img
                            src={p.logo}
                            alt={p.name}
                            style={{
                                maxWidth: '100%', maxHeight: '100%',
                                width: 'auto', height: 'auto',
                                objectFit: 'contain', display: 'block',
                            }}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

/* ──────────────────────────────────────────────────────
   Main section
────────────────────────────────────────────────────── */
const SponsorsSection = () => (
    <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0610 0%, #08040c 100%)',
        padding: '0 0 90px',
        overflow: 'hidden',
    }}>
        {/* Top text ticker band */}
        <div style={{
            background: 'rgba(128,0,32,0.12)',
            borderTop: '1px solid rgba(128,0,32,0.25)',
            borderBottom: '1px solid rgba(128,0,32,0.25)',
            padding: '14px 0',
            marginBottom: '80px',
        }}>
            <TextTicker />
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '16px',
            }}>
                {PARTNERS.map((p, i) => <PartnerCard key={i} partner={p} index={i} />)}
            </div>

            {/* Logo scroll strips */}
            <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <LogoScrollStrip />
                <LogoScrollStrip reverse />
            </div>
        </div>
    </section>
);

export default SponsorsSection;
