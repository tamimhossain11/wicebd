import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';

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
            className="wice-highlight-section"
            style={{
                position: 'relative',
                backgroundImage: 'url(/images/coverage.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                padding: '130px 0 120px',
                overflow: 'hidden',
            }}
        >
            {/* Dark overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(170deg, rgba(4,1,8,0.88) 0%, rgba(12,0,4,0.82) 40%, rgba(4,1,8,0.88) 100%)',
                zIndex: 0,
            }} />
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
                <div className="wice-highlight-cards">
                    <StatCard number={14} suffix="" label="Gold Medals" color="#D4AF37" icon="🥇" delay={0.1} />
                    <StatCard number={3} suffix="" label="Silver Medals" color="#C0C0C0" icon="🥈" delay={0.22} />
                    <StatCard number={5} suffix="+" label="Special International Awards" color="#800020" icon="⭐" delay={0.34} />
                </div>

            </div>
        </section>
    );
};

export default HighlightMoments;
