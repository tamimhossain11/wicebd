import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';

/* ─────────────────────────────────────────────
   Animated scan beam (top → bottom of section)
───────────────────────────────────────────── */
const ScanBeam = () => (
    <motion.div
        style={{
            position: 'absolute', left: 0, right: 0, height: 2, zIndex: 6,
            pointerEvents: 'none',
            background: 'linear-gradient(90deg, transparent 0%, rgba(192,0,42,0.4) 15%, rgba(255,60,80,0.95) 50%, rgba(192,0,42,0.4) 85%, transparent 100%)',
            boxShadow: '0 0 28px 6px rgba(128,0,32,0.45), 0 0 60px 2px rgba(200,0,40,0.15)',
        }}
        animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 5.5, ease: 'linear' }}
    />
);

/* ─────────────────────────────────────────────
   HUD corner brackets on each card
───────────────────────────────────────────── */
const HudCorners = ({ color, size = 13, thickness = 2, offset = 8 }) => {
    const s = { position: 'absolute', width: size, height: size };
    const b = `${thickness}px solid ${color}`;
    return (
        <>
            <div style={{ ...s, top: offset, left: offset, borderTop: b, borderLeft: b, opacity: 0.8 }} />
            <div style={{ ...s, top: offset, right: offset, borderTop: b, borderRight: b, opacity: 0.8 }} />
            <div style={{ ...s, bottom: offset, left: offset, borderBottom: b, borderLeft: b, opacity: 0.8 }} />
            <div style={{ ...s, bottom: offset, right: offset, borderBottom: b, borderRight: b, opacity: 0.8 }} />
        </>
    );
};

/* ─────────────────────────────────────────────
   3D icon box using Font Awesome
───────────────────────────────────────────── */
const Icon3D = ({ faClass, color }) => (
    <motion.div
        animate={{ rotateY: [0, 8, 0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
            width: 66, height: 66, borderRadius: 16, flexShrink: 0,
            position: 'relative',
            background: `linear-gradient(145deg, ${color}50 0%, ${color}18 55%, rgba(0,0,0,0.35) 100%)`,
            border: `1px solid ${color}55`,
            boxShadow: `
                0 6px 24px ${color}35,
                inset 0 1px 0 ${color}55,
                inset 0 -2px 4px rgba(0,0,0,0.55),
                inset 1px 0 0 ${color}22
            `,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: '200px',
        }}
    >
        {/* Top-left shine */}
        <div style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            background: `radial-gradient(ellipse at 28% 22%, ${color}45 0%, transparent 60%)`,
            pointerEvents: 'none',
        }} />
        {/* Bottom shade */}
        <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
            borderRadius: '0 0 16px 16px',
            background: 'rgba(0,0,0,0.28)', pointerEvents: 'none',
        }} />
        {/* Pulsing ring */}
        <motion.div
            style={{
                position: 'absolute', inset: -3, borderRadius: 20,
                border: `1px solid ${color}`,
                opacity: 0,
            }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <i className={faClass} style={{
            fontSize: 27, color,
            position: 'relative', zIndex: 1,
            filter: `drop-shadow(0 2px 8px ${color}80)`,
        }} />
    </motion.div>
);

/* ─────────────────────────────────────────────
   Glitch text — textShadow RGB-split approach
   (no clone spans, no duplicate text in DOM)
───────────────────────────────────────────── */
const GlitchText = ({ children }) => (
    <motion.span
        style={{ display: 'inline-block', color: '#800020' }}
        animate={{
            textShadow: [
                'none',
                '3px 0 0 rgba(6,182,212,0.75), -3px 0 0 rgba(255,48,80,0.75)',
                '-2px 0 0 rgba(6,182,212,0.5), 2px 0 0 rgba(255,48,80,0.5)',
                'none',
            ],
            x: [0, -2, 3, -1, 0],
        }}
        transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
    >
        {children}
    </motion.span>
);

/* ─────────────────────────────────────────────
   Animated stat counter
───────────────────────────────────────────── */
const StatCounter = ({ value, suffix, label, inView }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const duration = 2000;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, value]);

    return (
        <div style={{ textAlign: 'center', position: 'relative' }}>
            <motion.div
                style={{
                    fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 900, color: '#fff',
                    lineHeight: 1, fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace',
                    letterSpacing: '-0.02em',
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
            >
                <span style={{ color: '#c0002a' }}>{display}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7em' }}>{suffix}</span>
            </motion.div>
            <motion.div
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.16em', marginTop: 7, fontWeight: 700 }}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
            >
                {label}
            </motion.div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Decorative circuit-line SVG
───────────────────────────────────────────── */
const CircuitDecor = ({ style, flip }) => {
    const strokeColor = 'rgba(128,0,32,0.22)';
    const dotColor = 'rgba(192,0,42,0.5)';
    return (
        <svg
            style={{ position: 'absolute', pointerEvents: 'none', ...style }}
            width="160" height="110" viewBox="0 0 160 110" fill="none"
            transform={flip ? 'scale(-1,1)' : undefined}
        >
            <motion.path
                d="M0 55 H40 V20 H85 V55 H120 V80 H160"
                stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray="280"
                animate={{ strokeDashoffset: [280, 0, -280] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
            />
            {[{ cx: 40, cy: 55 }, { cx: 85, cy: 20 }, { cx: 85, cy: 55 }, { cx: 120, cy: 80 }].map((d, i) => (
                <motion.circle key={i} cx={d.cx} cy={d.cy} r={3} fill={dotColor}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
            ))}
        </svg>
    );
};

/* ─────────────────────────────────────────────
   Rotating tech rings (background)
───────────────────────────────────────────── */
const TechRings = () => (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
        {[
            { size: 560, border: 'rgba(128,0,32,0.08)', duration: 38, dots: 1 },
            { size: 380, border: 'rgba(128,0,32,0.14)', duration: 24, dots: 2 },
            { size: 210, border: 'rgba(200,0,40,0.22)', duration: 15, dots: 3 },
        ].map((r, i) => (
            <motion.div key={i} style={{
                position: 'absolute', width: r.size, height: r.size, borderRadius: '50%',
                border: `1px solid ${r.border}`,
                top: '50%', left: '50%', marginTop: -r.size / 2, marginLeft: -r.size / 2,
            }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: r.duration, repeat: Infinity, ease: 'linear' }}
            >
                {Array.from({ length: r.dots }).map((_, d) => (
                    <motion.div key={d} style={{
                        position: 'absolute',
                        top: d === 0 ? 0 : d === 1 ? '50%' : '25%',
                        left: d === 0 ? '50%' : d === 1 ? 0 : '75%',
                        transform: 'translate(-50%,-50%)',
                        width: i === 0 ? 5 : i === 1 ? 7 : 9,
                        height: i === 0 ? 5 : i === 1 ? 7 : 9,
                        borderRadius: '50%', background: '#800020',
                        boxShadow: '0 0 10px #800020, 0 0 20px rgba(128,0,32,0.5)',
                    }}
                        animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, delay: d * 0.7 }}
                    />
                ))}
            </motion.div>
        ))}
    </div>
);

/* ─────────────────────────────────────────────
   Data pillars config
───────────────────────────────────────────── */
const THEME = '#c0002a';

const PILLARS = [
    {
        fa: 'fa fa-rocket',
        title: 'Launch Your Innovation',
        body: 'Take your idea from concept to competition stage. WICE provides mentorship, platform exposure, and a path to international invention expos.',
        color: THEME,
    },
    {
        fa: 'fa fa-globe',
        title: 'Go Global',
        body: 'Top teams represent Bangladesh at international invention competitions in Malaysia, South Korea, Japan, Switzerland, and more.',
        color: THEME,
    },
    {
        fa: 'fa fa-trophy',
        title: 'Win Recognition',
        body: '14 Gold medals in WICEBD 2024 alone. WICE alumni carry certified international awards, certificates, and lifelong networks.',
        color: THEME,
    },
    {
        fa: 'fa fa-users',
        title: 'Build Community',
        body: "Join a growing ecosystem of 800+ innovators, mentors, organizers, and industry leaders who believe in Bangladesh's potential.",
        color: THEME,
    },
    {
        fa: 'fa fa-microchip',
        title: 'Multi-Discipline',
        body: 'Whether you excel in technology, science, art, or robotics — WICE has a competition designed for your strengths.',
        color: THEME,
    },
    {
        fa: 'fa fa-graduation-cap',
        title: 'Open to All',
        body: 'From school students to college graduates — WICE welcomes all age groups and academic backgrounds into its competitions.',
        color: THEME,
    },
];

const STATS = [
    { value: 8,   suffix: '+', label: 'Years Running' },
    { value: 800, suffix: '+', label: 'Innovators' },
    { value: 14,  suffix: '',  label: 'Gold Medals' },
    { value: 10,  suffix: '+', label: 'Countries' },
];

/* ─────────────────────────────────────────────
   Card boot-up animation variant
───────────────────────────────────────────── */
const cardVariant = {
    hidden: { opacity: 0, y: 40, filter: 'brightness(2) blur(2px)' },
    visible: (i) => ({
        opacity: 1, y: 0, filter: 'brightness(1) blur(0px)',
        transition: { delay: i * 0.10, duration: 0.55, ease: [0.23, 1, 0.32, 1] },
    }),
};

/* ─────────────────────────────────────────────
   Main section
───────────────────────────────────────────── */
const WhyWiceSection = () => {
    const statsRef = useRef(null);
    const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

    return (
        <section style={{
            position: 'relative',
            background: 'linear-gradient(160deg, #05010c 0%, #090013 45%, #0d0005 100%)',
            padding: '110px 0 100px',
            overflow: 'hidden',
        }}>
            {/* Scan beam */}
            <ScanBeam />

            {/* Rotating rings */}
            <TechRings />

            {/* Hex-dot grid */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    radial-gradient(rgba(128,0,32,0.18) 1px, transparent 1px)
                `,
                backgroundSize: '36px 36px',
                maskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 100%)',
            }} />

            {/* Scanline texture */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 3px)',
                zIndex: 1,
            }} />

            {/* Circuit decorations */}
            <CircuitDecor style={{ top: 60, left: 20, opacity: 0.8 }} />
            <CircuitDecor style={{ bottom: 120, right: 20, opacity: 0.8 }} flip />

            {/* Ambient glow blobs */}
            <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.12),transparent 70%)', top: -160, right: '10%', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(60,0,100,0.1),transparent 70%)', bottom: -80, left: '5%', filter: 'blur(50px)', pointerEvents: 'none' }} />

            <div className="auto-container" style={{ position: 'relative', zIndex: 3 }}>

                {/* ── Header ── */}
                <motion.div className="text-center" style={{ marginBottom: '64px' }}
                    initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.65 }}
                >
                    {/* Label */}
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em',
                        fontWeight: 700, color: '#800020', marginBottom: 18,
                    }}>
                        <motion.span style={{ width: 36, height: 1, background: 'linear-gradient(90deg, transparent, #800020)', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.7, 1] }} transition={{ duration: 2.8, repeat: Infinity }} />
                        Why WICE?
                        <motion.span style={{ width: 36, height: 1, background: 'linear-gradient(90deg, #800020, transparent)', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.7, 1] }} transition={{ duration: 2.8, repeat: Infinity }} />
                    </span>

                    <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(30px, 5vw, 50px)', margin: 0, lineHeight: 1.12 }}>
                        Where Bangladeshi<br />
                        <GlitchText>Innovation Begins</GlitchText>
                    </h2>

                    <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 15, marginTop: 18, maxWidth: 520, margin: '18px auto 0', lineHeight: 1.85 }}>
                        WICE Bangladesh isn't just a competition — it's a launchpad. Here's why
                        thousands of students choose to compete every year.
                    </p>
                </motion.div>

                {/* ── Animated Stats Strip ── */}
                <motion.div
                    ref={statsRef}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
                    style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))',
                        gap: '8px', marginBottom: 60,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(128,0,32,0.22)',
                        borderRadius: 18, padding: '30px 28px',
                        backdropFilter: 'blur(20px)',
                        position: 'relative', overflow: 'hidden',
                    }}
                >
                    {/* inner scan glow line */}
                    <motion.div style={{
                        position: 'absolute', left: 0, right: 0, height: 1, top: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(128,0,32,0.6), transparent)',
                        pointerEvents: 'none',
                    }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <HudCorners color="rgba(128,0,32,0.55)" size={10} offset={6} />
                    {STATS.map(s => (
                        <StatCounter key={s.label} {...s} inView={statsInView} />
                    ))}
                </motion.div>

                {/* ── Pillars Grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 20, marginBottom: 72,
                }}>
                    {PILLARS.map((p, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={cardVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-40px' }}
                            whileHover={{
                                y: -10,
                                boxShadow: `0 24px 60px ${p.color}22, 0 4px 20px rgba(0,0,0,0.6)`,
                            }}
                            style={{
                                background: 'rgba(255,255,255,0.038)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: `1px solid ${p.color}20`,
                                borderLeft: `3px solid ${p.color}`,
                                borderRadius: 18,
                                padding: '26px 24px',
                                display: 'flex', gap: 20, alignItems: 'flex-start',
                                cursor: 'default',
                                transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                                position: 'relative', overflow: 'hidden',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}55`; e.currentTarget.style.borderLeftColor = p.color; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = `${p.color}20`; e.currentTarget.style.borderLeftColor = p.color; }}
                        >
                            {/* HUD corners */}
                            <HudCorners color={p.color} size={11} offset={7} />

                            {/* Ambient corner glow */}
                            <div style={{
                                position: 'absolute', top: -15, right: -15, width: 100, height: 100,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${p.color}18, transparent 70%)`,
                                filter: 'blur(18px)', pointerEvents: 'none',
                            }} />

                            {/* Subtle scanline on card */}
                            <motion.div style={{
                                position: 'absolute', left: 0, right: 0, height: 1,
                                background: `linear-gradient(90deg, transparent, ${p.color}60, transparent)`,
                                pointerEvents: 'none',
                            }}
                                animate={{ top: ['-5%', '110%'], opacity: [0, 0.8, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 4 + i * 0.8, ease: 'linear' }}
                            />

                            {/* 3D icon */}
                            <Icon3D faClass={p.fa} color={p.color} />

                            <div style={{ flex: 1 }}>
                                {/* Card index badge */}
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    fontSize: 10, color: p.color, fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.14em',
                                    marginBottom: 7, opacity: 0.7,
                                }}>
                                    <span style={{ width: 12, height: 1, background: p.color, display: 'inline-block' }} />
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <div style={{ fontWeight: 700, color: '#fff', fontSize: 17, marginBottom: 8, lineHeight: 1.3 }}>
                                    {p.title}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.52)', fontSize: 14, lineHeight: 1.78 }}>
                                    {p.body}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── CTA Band ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 24,
                        background: 'rgba(128,0,32,0.09)',
                        border: '1px solid rgba(128,0,32,0.28)',
                        borderRadius: 22, padding: '34px 44px',
                        position: 'relative', overflow: 'hidden',
                    }}
                >
                    <HudCorners color="rgba(128,0,32,0.45)" size={14} offset={10} />
                    {/* Animated top border */}
                    <motion.div style={{
                        position: 'absolute', top: 0, left: 0, height: 2, background: 'linear-gradient(90deg, #800020, #c0002a, transparent)',
                        pointerEvents: 'none',
                    }}
                        animate={{ width: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                    />
                    <div>
                        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 24, margin: '0 0 6px' }}>Ready to compete?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: 0, lineHeight: 1.65 }}>
                            Create your account and register for WICE Bangladesh 2025 today.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        <Link to="/sign-up#" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.06, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    background: 'linear-gradient(135deg, #800020, #c0002a)',
                                    color: '#fff', fontWeight: 700, fontSize: 14,
                                    padding: '14px 32px', borderRadius: 50,
                                    boxShadow: '0 6px 24px rgba(128,0,32,0.45)',
                                    letterSpacing: '0.04em',
                                }}
                            >
                                Register Now <i className="fa fa-arrow-right" style={{ fontSize: 12 }} />
                            </motion.div>
                        </Link>
                        <Link to="/about-us#" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.04, y: -2 }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(255,255,255,0.06)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#fff', fontWeight: 600, fontSize: 14,
                                    padding: '14px 32px', borderRadius: 50,
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
};

export default WhyWiceSection;
