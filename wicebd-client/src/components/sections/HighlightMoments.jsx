import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';

/* ─── Animated number counter ──────────────────────── */
const Counter = ({ target, suffix = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const mv = useMotionValue(0);
    const [display, setDisplay] = useState('0');

    useEffect(() => {
        if (!inView) return;
        const ctrl = animate(mv, parseInt(target), {
            duration: 2.2,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: v => setDisplay(Math.round(v).toString()),
        });
        return ctrl.stop;
    }, [inView]);

    return <span ref={ref}>{display}{suffix}</span>;
};

/* ─── Word-by-word reveal ───────────────────────────── */
const RevealText = ({ text, style, delay = 0 }) => (
    <span style={{ ...style, display: 'inline' }}>
        {text.split(' ').map((word, i) => (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.28em' }}>
                <motion.span
                    style={{ display: 'inline-block' }}
                    initial={{ y: '110%', opacity: 0 }}
                    whileInView={{ y: '0%', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                    {word}
                </motion.span>
            </span>
        ))}
    </span>
);

/* ─── Participating nations (left side) ─────────────── */
const NATIONS = [
    { flag: '🇧🇩', name: 'Bangladesh', label: 'Our Team', home: true },
    { flag: '🇮🇩', name: 'Indonesia', label: 'Competing Nation' },
    { flag: '🇹🇭', name: 'Thailand', label: 'Competing Nation' },
    { flag: '🇲🇽', name: 'Mexico', label: 'Competing Nation' },
    { flag: '🇰🇷', name: 'South Korea', label: 'Competing Nation' },
];

/* ─── Animated beam line ────────────────────────────── */
const BeamLine = ({ delay }) => {
    /* Each row has a beam that travels from left → right (toward Malaysia) */
    return (
        <div style={{
            position: 'absolute', left: 0, right: 0,
            height: 1,
            top: '50%', transform: 'translateY(-50%)',
        }}>
            {/* Dashed track */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(90deg, rgba(128,0,32,0.28) 0px, rgba(128,0,32,0.28) 6px, transparent 6px, transparent 13px)',
            }} />
            {/* Travelling glow dot */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '50%', transform: 'translateY(-50%)',
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#800020',
                    boxShadow: '0 0 10px #800020, 0 0 22px rgba(128,0,32,0.5)',
                }}
                animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay }}
            />
        </div>
    );
};

/* ─── Nation row ─────────────────────────────────────── */
const NationRow = ({ nation, index }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 + index * 0.09, ease: [0.34, 1.2, 0.64, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative', height: 64 }}
        >
            {/* Nation card */}
            <motion.div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                animate={hovered ? { scale: 1.06 } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: hovered
                        ? 'rgba(128,0,32,0.14)'
                        : nation.home ? 'rgba(0,106,78,0.1)' : 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(14px)',
                    border: nation.home
                        ? '1px solid rgba(0,106,78,0.45)'
                        : `1px solid ${hovered ? 'rgba(128,0,32,0.45)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 14, padding: '10px 16px',
                    cursor: 'default', flexShrink: 0,
                    transition: 'all 0.25s ease',
                    zIndex: 2, position: 'relative',
                    boxShadow: nation.home ? '0 0 20px rgba(0,106,78,0.15)' : 'none',
                }}
            >
                <span style={{ fontSize: 26 }}>{nation.flag}</span>
                <div>
                    <div style={{
                        fontSize: 13, fontWeight: nation.home ? 800 : 600,
                        color: nation.home ? '#fff' : 'rgba(255,255,255,0.8)',
                        lineHeight: 1.2,
                    }}>
                        {nation.name}
                    </div>
                    <div style={{
                        fontSize: 10, fontWeight: 600,
                        color: nation.home ? 'rgba(0,200,120,0.8)' : 'rgba(128,0,32,0.7)',
                        textTransform: 'uppercase', letterSpacing: '0.12em',
                    }}>
                        {nation.label}
                    </div>
                </div>
            </motion.div>

            {/* Beam connector spanning to the host side */}
            <div style={{ flex: 1, position: 'relative', height: '100%', marginLeft: 8 }}>
                <BeamLine delay={index * 0.42} />
            </div>
        </motion.div>
    );
};

/* ─── Stat card ─────────────────────────────────────── */
const StatCard = ({ number, suffix, label, color, icon, delay }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay, ease: [0.34, 1.26, 0.64, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                flex: 1,
                position: 'relative',
                background: hovered
                    ? `linear-gradient(145deg, ${color}14, rgba(255,255,255,0.05))`
                    : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: `1px solid ${hovered ? color + '55' : color + '22'}`,
                borderRadius: 28,
                padding: '44px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                cursor: 'default',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                boxShadow: hovered
                    ? `0 32px 80px ${color}25, inset 0 1px 0 rgba(255,255,255,0.1)`
                    : `0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
        >
            {/* Top shimmer */}
            <div style={{
                position: 'absolute', top: 0, left: '8%', right: '8%', height: 2,
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                opacity: hovered ? 0.85 : 0.3, borderRadius: '0 0 2px 2px',
                transition: 'opacity 0.4s',
            }} />

            {/* Glow blob */}
            <motion.div style={{
                position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                width: 200, height: 200, borderRadius: '50%',
                background: `radial-gradient(circle, ${color}18 0%, transparent 65%)`,
                pointerEvents: 'none', filter: 'blur(24px)',
            }}
                animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.4 : 1 }}
                transition={{ duration: 0.45 }}
            />

            <motion.div
                style={{ fontSize: 44, lineHeight: 1, zIndex: 1 }}
                animate={hovered ? { y: [-2, 2, -2], rotate: [0, 6, -6, 0] } : {}}
                transition={{ duration: 2, repeat: hovered ? Infinity : 0, ease: 'easeInOut' }}
            >
                {icon}
            </motion.div>

            <div style={{
                fontSize: 'clamp(52px, 7vw, 76px)', fontWeight: 900,
                color, lineHeight: 1, letterSpacing: '-0.04em', zIndex: 1,
                textShadow: `0 0 40px ${color}60`,
            }}>
                <Counter target={number} suffix={suffix} />
            </div>

            <div style={{
                fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase', letterSpacing: '0.14em',
                textAlign: 'center', lineHeight: 1.5, zIndex: 1,
            }}>
                {label}
            </div>

            <motion.div style={{
                position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2,
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                borderRadius: 2,
            }}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay }}
            />
        </motion.div>
    );
};

/* ─── Main section ───────────────────────────────────── */
const HighlightMoments = () => {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-60px' });

    return (
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                background: 'linear-gradient(170deg, #040108 0%, #0c0004 40%, #040108 100%)',
                padding: '130px 0 120px',
                overflow: 'hidden',
            }}
        >
            {/* Starfield */}
            {Array.from({ length: 70 }).map((_, i) => (
                <motion.div key={i}
                    style={{
                        position: 'absolute', borderRadius: '50%', background: 'white',
                        width: Math.random() * 2 + 0.5, height: Math.random() * 2 + 0.5,
                        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                        pointerEvents: 'none',
                    }}
                    animate={{ opacity: [0.1, 0.8, 0.1] }}
                    transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                />
            ))}

            {/* Grid */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `linear-gradient(rgba(128,0,32,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(128,0,32,0.05) 1px,transparent 1px)`,
                backgroundSize: '60px 60px',
                maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 20%, transparent 100%)',
            }} />

            {/* Central glow */}
            <motion.div style={{
                position: 'absolute', top: '35%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 900, height: 500, borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(128,0,32,0.12) 0%, transparent 65%)',
                pointerEvents: 'none',
            }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Trophy watermark */}
            <motion.div style={{
                position: 'absolute', right: '-60px', top: '10%',
                fontSize: 320, lineHeight: 1, opacity: 0.025,
                pointerEvents: 'none', userSelect: 'none', filter: 'blur(2px)',
            }}
                animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
                🏆
            </motion.div>

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>

                {/* Headline */}
                <div style={{ textAlign: 'center', marginBottom: 72 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
                    >
                        <motion.span style={{ width: 40, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.7, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#800020', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                            Dreams of Bangladesh
                        </span>
                        <motion.span style={{ width: 40, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.7, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                    </motion.div>

                    <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.1, margin: '0 0 20px', overflow: 'hidden' }}>
                        <RevealText text="Historic Achievements" delay={0.1} />
                        <br />
                        <RevealText text="on the Global Stage" delay={0.35} style={{ color: '#800020' }} />
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.65 }}
                        style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.85, maxWidth: 560, margin: '0 auto' }}
                    >
                        Our teams earned <strong style={{ color: '#D4AF37' }}>14 Gold medals</strong>,{' '}
                        <strong style={{ color: 'rgba(210,210,210,0.9)' }}>3 Silver medals</strong>, and multiple
                        special awards at international invention competitions — carrying
                        the pride of Bangladesh to the world stage.
                    </motion.p>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 80 }}>
                    <StatCard number={14} suffix="" label="Gold Medals" color="#D4AF37" icon="🥇" delay={0.1} />
                    <StatCard number={3} suffix="" label="Silver Medals" color="#C0C0C0" icon="🥈" delay={0.22} />
                    <StatCard number={5} suffix="+" label="Special International Awards" color="#800020" icon="⭐" delay={0.34} />
                </div>

                {/* ── Journey: convergence to Malaysia ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.2 }}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(128,0,32,0.2)',
                        borderRadius: 28,
                        padding: '36px 40px',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                >
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <motion.div
                                style={{ width: 8, height: 8, borderRadius: '50%', background: '#800020' }}
                                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                                transition={{ duration: 1.6, repeat: Infinity }}
                            />
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(128,0,32,0.8)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                                All Teams Converge · ITEX Malaysia
                            </span>
                        </div>
                        <Link to="/about-us#" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.97 }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    background: 'linear-gradient(135deg, #800020, #c0002a)',
                                    color: '#fff', fontWeight: 700, fontSize: 13,
                                    padding: '10px 24px', borderRadius: 50,
                                    boxShadow: '0 6px 22px rgba(128,0,32,0.4)',
                                    letterSpacing: '0.04em',
                                }}
                            >
                                View Journey →
                            </motion.div>
                        </Link>
                    </div>

                    {/* Convergence layout */}
                    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>

                        {/* Left — participating nations */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {NATIONS.map((nation, i) => (
                                <NationRow key={nation.name} nation={nation} index={i} />
                            ))}
                        </div>

                        {/* Right — Malaysia host node */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.5, ease: [0.34, 1.26, 0.64, 1] }}
                            style={{
                                flexShrink: 0, width: 200,
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                gap: 14, paddingLeft: 24, position: 'relative',
                            }}
                        >
                            {/* Vertical connector line on left edge */}
                            <div style={{
                                position: 'absolute', left: 0, top: '10%', bottom: '10%',
                                width: 1,
                                background: 'linear-gradient(to bottom, transparent, rgba(128,0,32,0.5) 30%, rgba(128,0,32,0.5) 70%, transparent)',
                            }} />

                            {/* Glow halo */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    width: 180, height: 180, borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(128,0,32,0.18) 0%, transparent 70%)',
                                    filter: 'blur(20px)', pointerEvents: 'none',
                                }}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            />

                            {/* Host badge */}
                            <motion.div
                                style={{
                                    fontSize: '10px', fontWeight: 800,
                                    color: '#800020', letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    background: 'rgba(128,0,32,0.12)',
                                    border: '1px solid rgba(128,0,32,0.35)',
                                    borderRadius: 50, padding: '4px 14px',
                                    zIndex: 1,
                                }}
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            >
                                🏆 International Host
                            </motion.div>

                            {/* Flag */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 0 0 rgba(128,0,32,0)',
                                        '0 0 0 14px rgba(128,0,32,0.12)',
                                        '0 0 0 28px rgba(128,0,32,0)',
                                    ],
                                }}
                                transition={{ duration: 2.4, repeat: Infinity }}
                                style={{
                                    width: 90, height: 90, borderRadius: '50%',
                                    background: 'rgba(128,0,32,0.1)',
                                    backdropFilter: 'blur(16px)',
                                    border: '2px solid rgba(128,0,32,0.55)',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: 48,
                                    zIndex: 1,
                                    boxShadow: '0 0 32px rgba(128,0,32,0.3)',
                                }}
                            >
                                🇲🇾
                            </motion.div>

                            {/* Label */}
                            <div style={{ zIndex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Malaysia</div>
                                <div style={{ fontSize: 11, color: 'rgba(128,0,32,0.8)', fontWeight: 600, letterSpacing: '0.08em' }}>ITEX · Kuala Lumpur</div>
                            </div>

                            {/* Arrival pulse ring */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    width: 130, height: 130, borderRadius: '50%',
                                    border: '1px solid rgba(128,0,32,0.3)',
                                    pointerEvents: 'none', zIndex: 0,
                                }}
                                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                            />
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default HighlightMoments;
