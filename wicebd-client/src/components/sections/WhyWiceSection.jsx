import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';

/* Animated floating tech rings */
const TechRings = () => {
    const rings = [
        { size: 500, border: 'rgba(128,0,32,0.12)', duration: 30 },
        { size: 360, border: 'rgba(128,0,32,0.18)', duration: 20 },
        { size: 220, border: 'rgba(200,0,40,0.25)', duration: 14 },
    ];
    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
            {rings.map((r, i) => (
                <motion.div key={i}
                    style={{
                        position: 'absolute',
                        width: r.size, height: r.size,
                        borderRadius: '50%',
                        border: `1px solid ${r.border}`,
                        top: '50%', left: '50%',
                        marginTop: -r.size / 2, marginLeft: -r.size / 2,
                    }}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: r.duration, repeat: Infinity, ease: 'linear' }}
                >
                    {/* Dot on ring */}
                    <div style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) translateY(-50%)',
                        width: i === 0 ? 6 : i === 1 ? 8 : 10,
                        height: i === 0 ? 6 : i === 1 ? 8 : 10,
                        borderRadius: '50%',
                        background: '#800020',
                        boxShadow: '0 0 12px #800020',
                    }} />
                </motion.div>
            ))}
        </div>
    );
};

const PILLARS = [
    {
        icon: '🚀',
        title: 'Launch Your Innovation',
        body: 'Take your idea from concept to competition stage. WICE provides mentorship, platform exposure, and a path to international invention expos.',
        color: '#e94560',
    },
    {
        icon: '🌍',
        title: 'Go Global',
        body: 'Top teams represent Bangladesh at international invention competitions in Malaysia, South Korea, Japan, Switzerland, and more.',
        color: '#f59e0b',
    },
    {
        icon: '🏅',
        title: 'Win Recognition',
        body: '14 Gold medals and counting. WICE alumni carry certified international awards, certificates, and lifelong networks.',
        color: '#10b981',
    },
    {
        icon: '🤝',
        title: 'Build Community',
        body: "Join a growing ecosystem of 800+ innovators, mentors, organizers, and industry leaders who believe in Bangladesh's potential.",
        color: '#0f3460',
    },
    {
        icon: '📐',
        title: 'Multi-Discipline',
        body: 'Whether you excel in technology, science, art, or robotics — WICE has a competition designed for your strengths.',
        color: '#8b5cf6',
    },
    {
        icon: '🎓',
        title: 'Open to All',
        body: 'From school students to college graduates — WICE welcomes all age groups and academic backgrounds into its competitions.',
        color: '#800020',
    },
];

const WhyWiceSection = () => (
    <section style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #06020e 0%, #0a0014 50%, #06020e 100%)',
        padding: '110px 0 100px',
        overflow: 'hidden',
    }}>
        {/* Animated rings bg */}
        <TechRings />

        {/* Grid texture */}
        <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
                linear-gradient(rgba(128,0,32,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(128,0,32,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 100%)',
        }} />

        <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>
            {/* Header */}
            <motion.div
                className="text-center"
                style={{ marginBottom: '72px' }}
                initial={{ opacity: 0, y: -28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.22em',
                    fontWeight: 700, color: '#800020', marginBottom: '14px',
                }}>
                    <motion.span style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                        animate={{ scaleX: [1, 1.6, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                    Why WICE?
                    <motion.span style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                        animate={{ scaleX: [1, 1.6, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                </span>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 48px)', margin: 0, lineHeight: 1.15 }}>
                    Where Bangladeshi<br />
                    <span style={{ color: '#800020' }}>Innovation Begins</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginTop: '16px', maxWidth: '540px', margin: '16px auto 0', lineHeight: 1.8 }}>
                    WICE Bangladesh isn't just a competition — it's a launchpad. Here's why thousands of students choose to compete every year.
                </p>
            </motion.div>

            {/* Pillars grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '22px',
                marginBottom: '72px',
            }}>
                {PILLARS.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.09, duration: 0.5 }}
                        whileHover={{ y: -8, boxShadow: `0 20px 50px ${p.color}20` }}
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                            border: `1px solid ${p.color}22`,
                            borderLeft: `3px solid ${p.color}`,
                            borderRadius: '18px',
                            padding: '28px 26px',
                            display: 'flex', gap: '20px', alignItems: 'flex-start',
                            cursor: 'default',
                            transition: 'all 0.35s ease',
                            position: 'relative', overflow: 'hidden',
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: -10, right: -10, width: 80, height: 80,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${p.color}15, transparent 70%)`,
                            filter: 'blur(16px)', pointerEvents: 'none',
                        }} />
                        <motion.div
                            style={{ fontSize: '2rem', flexShrink: 0, lineHeight: 1 }}
                            animate={{ rotate: [0, 6, -6, 0] }}
                            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {p.icon}
                        </motion.div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '17px', marginBottom: '8px' }}>{p.title}</div>
                            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.75 }}>{p.body}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CTA band */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '24px',
                    background: 'rgba(128,0,32,0.1)',
                    border: '1px solid rgba(128,0,32,0.25)',
                    borderRadius: '22px',
                    padding: '36px 44px',
                }}
            >
                <div>
                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '24px', margin: '0 0 6px' }}>Ready to compete?</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                        Create your account and register for WICE Bangladesh 2025 today.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <Link to="/sign-up#" style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'linear-gradient(135deg, #800020, #c0002a)',
                                color: '#fff', fontWeight: 700, fontSize: '14px',
                                padding: '14px 32px', borderRadius: '50px',
                                boxShadow: '0 6px 22px rgba(128,0,32,0.4)',
                                letterSpacing: '0.04em',
                            }}
                        >
                            Register Now →
                        </motion.div>
                    </Link>
                    <Link to="/about-us#" style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ scale: 1.04, y: -2 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.07)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                color: '#fff', fontWeight: 600, fontSize: '14px',
                                padding: '14px 32px', borderRadius: '50px',
                            }}
                        >
                            Learn More
                        </motion.div>
                    </Link>
                </div>
            </motion.div>
        </div>
    </section>
);

export default WhyWiceSection;
