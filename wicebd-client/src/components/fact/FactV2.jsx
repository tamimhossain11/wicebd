import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

/* ─── Animated Canvas Globe ─────────────────────────── */
const GlobeBg = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let angle = 0;

        const SIZE = 560;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const cx = SIZE / 2;
        const cy = SIZE / 2;
        const R = 240;

        const DOTS = Array.from({ length: 18 }, () => ({
            lon: Math.random() * 360 - 180,
            lat: Math.random() * 140 - 70,
        }));

        const project = (lon, lat, rot) => {
            const phi = (lat * Math.PI) / 180;
            const theta = ((lon + rot) * Math.PI) / 180;
            const x = R * Math.cos(phi) * Math.sin(theta);
            const y = R * Math.sin(phi);
            const z = R * Math.cos(phi) * Math.cos(theta);
            return { x: cx + x, y: cy - y, z };
        };

        const draw = () => {
            ctx.clearRect(0, 0, SIZE, SIZE);

            /* Sphere base */
            const sphere = ctx.createRadialGradient(cx - 40, cy - 40, 30, cx, cy, R);
            sphere.addColorStop(0, 'rgba(30,0,10,0.55)');
            sphere.addColorStop(1, 'rgba(6,0,4,0.7)');
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fillStyle = sphere;
            ctx.fill();

            /* Latitude rings */
            for (let lat = -75; lat <= 75; lat += 15) {
                const phi = (lat * Math.PI) / 180;
                const ry = R * Math.cos(phi);
                const yc = cy - R * Math.sin(phi);
                ctx.beginPath();
                ctx.ellipse(cx, yc, ry, ry * 0.18, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(128,0,32,0.22)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            /* Longitude lines */
            for (let i = 0; i < 12; i++) {
                const lon = (i * 180) / 12 + angle;
                const theta = (lon * Math.PI) / 180;
                const ry = R * Math.abs(Math.cos(theta));
                const visible = Math.cos(theta) > 0;
                ctx.beginPath();
                ctx.ellipse(cx, cy, Math.max(1, ry), R, theta > Math.PI ? Math.PI / 2 : -Math.PI / 2, 0, Math.PI * 2);
                ctx.strokeStyle = visible ? 'rgba(180,0,40,0.18)' : 'rgba(80,0,20,0.08)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            /* Equator accent */
            ctx.beginPath();
            ctx.ellipse(cx, cy, R, R * 0.18, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(200,0,40,0.35)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            /* Random city dots */
            DOTS.forEach(dot => {
                const p = project(dot.lon, dot.lat, angle);
                if (p.z < -10) return;
                const alpha = Math.min(1, (p.z + R) / R) * 0.7;
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9);
                glow.addColorStop(0, `rgba(220,0,50,${alpha})`);
                glow.addColorStop(1, 'rgba(220,0,50,0)');
                ctx.beginPath();
                ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,80,80,${alpha})`;
                ctx.fill();
            });

            /* Outer glow ring */
            const grd = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.25);
            grd.addColorStop(0, 'rgba(128,0,32,0)');
            grd.addColorStop(1, 'rgba(128,0,32,0.14)');
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            /* Outer border */
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(128,0,32,0.35)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            angle += 0.18;
            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 560, height: 560,
                opacity: 0.28,
                pointerEvents: 'none',
            }}
        />
    );
};

/* ─── Stat data ─────────────────────────────────────── */
const STATS = [
    {
        end: 3000,
        suffix: '+',
        label: 'Participants',
        icon: (
            <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
                <circle cx="14" cy="12" r="6" stroke="#800020" strokeWidth="2" />
                <circle cx="26" cy="12" r="6" stroke="#800020" strokeWidth="2" />
                <path d="M2 34c0-7 5-11 12-11M26 23c7 0 12 4 12 11" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 23c3.5 0 6 1.5 8 4" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        end: 50,
        suffix: '+',
        label: 'Executives & Organizers',
        icon: (
            <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
                <polygon points="20,4 24,14 36,14 26,22 30,34 20,26 10,34 14,22 4,14 16,14" stroke="#800020" strokeWidth="2" strokeLinejoin="round" fill="rgba(128,0,32,0.15)" />
            </svg>
        ),
    },
    {
        end: 4,
        suffix: '',
        label: 'Competition Categories',
        icon: (
            <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
                <path d="M12 6h16l4 10-12 18L8 16z" stroke="#800020" strokeWidth="2" strokeLinejoin="round" fill="rgba(128,0,32,0.15)" />
                <path d="M8 16h24" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        end: 200,
        suffix: '+',
        label: 'Institutes Represented',
        icon: (
            <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
                <rect x="6" y="18" width="28" height="18" rx="2" stroke="#800020" strokeWidth="2" />
                <path d="M2 18L20 6l18 12" stroke="#800020" strokeWidth="2" strokeLinejoin="round" />
                <rect x="15" y="26" width="10" height="10" rx="1" stroke="#800020" strokeWidth="1.8" />
            </svg>
        ),
    },
    {
        end: 40,
        suffix: '+',
        label: 'Media Coverage',
        icon: (
            <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
                <rect x="4" y="10" width="26" height="18" rx="3" stroke="#800020" strokeWidth="2" />
                <path d="M30 16l6-4v16l-6-4" stroke="#800020" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="17" cy="19" r="4" stroke="#800020" strokeWidth="1.8" />
            </svg>
        ),
    },
];

/* ─── Single stat card ──────────────────────────────── */
const StatCard = ({ stat, index }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.34, 1.2, 0.64, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                flex: 1,
                position: 'relative',
                background: hovered
                    ? 'rgba(128,0,32,0.1)'
                    : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${hovered ? 'rgba(128,0,32,0.45)' : 'rgba(128,0,32,0.18)'}`,
                borderRadius: 24,
                padding: '48px 28px 40px',
                textAlign: 'center',
                cursor: 'default',
                overflow: 'hidden',
                transition: 'all 0.35s ease',
                boxShadow: hovered
                    ? '0 24px 64px rgba(128,0,32,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
        >
            {/* Top shimmer */}
            <div style={{
                position: 'absolute', top: 0, left: '15%', right: '15%', height: 2,
                background: 'linear-gradient(90deg, transparent, #800020, transparent)',
                opacity: hovered ? 0.9 : 0.35,
                transition: 'opacity 0.35s',
            }} />

            {/* Glow */}
            <motion.div style={{
                position: 'absolute', top: -30, left: '50%',
                transform: 'translateX(-50%)',
                width: 160, height: 160, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(128,0,32,0.16) 0%, transparent 65%)',
                filter: 'blur(20px)', pointerEvents: 'none',
            }}
                animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.3 : 1 }}
                transition={{ duration: 0.4 }}
            />

            {/* Icon box */}
            <motion.div
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 64, height: 64, borderRadius: 18,
                    background: 'rgba(128,0,32,0.12)',
                    border: '1px solid rgba(128,0,32,0.3)',
                    marginBottom: 24,
                    boxShadow: '0 4px 16px rgba(128,0,32,0.18)',
                }}
                animate={hovered ? { rotate: [0, -6, 6, 0], scale: 1.08 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {stat.icon}
            </motion.div>

            {/* Number */}
            <div style={{
                fontSize: 'clamp(44px, 5vw, 64px)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                marginBottom: 12,
                textShadow: '0 0 30px rgba(128,0,32,0.4)',
            }}>
                <CountUp end={stat.end} enableScrollSpy duration={2.5} suffix={stat.suffix} />
            </div>

            {/* Label */}
            <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                lineHeight: 1.55,
            }}>
                {stat.label}
            </div>

            {/* Bottom accent */}
            <motion.div style={{
                position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 2,
                background: 'linear-gradient(90deg, transparent, #800020, transparent)',
                borderRadius: 2,
            }}
                animate={{ opacity: [0.15, 0.6, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
            />
        </motion.div>
    );
};

/* ─── Main section ───────────────────────────────────── */
const FactV2 = () => {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-60px' });

    return (
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                background: 'linear-gradient(160deg, #06020e 0%, #0a0004 50%, #06020e 100%)',
                padding: '120px 0 110px',
                overflow: 'hidden',
            }}
        >
            {/* Animated globe background */}
            <GlobeBg />

            {/* Dark radial overlay so cards are legible */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 70% 80% at 50% 50%, transparent 20%, rgba(6,2,14,0.7) 70%)',
            }} />

            {/* Grid texture */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(128,0,32,0.045) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(128,0,32,0.045) 1px, transparent 1px)
                `,
                backgroundSize: '56px 56px',
                maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 100%)',
            }} />

            {/* Starfield */}
            {Array.from({ length: 40 }).map((_, i) => (
                <motion.div key={i}
                    style={{
                        position: 'absolute', borderRadius: '50%', background: 'white',
                        width: Math.random() * 1.8 + 0.4,
                        height: Math.random() * 1.8 + 0.4,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        pointerEvents: 'none',
                    }}
                    animate={{ opacity: [0.1, 0.7, 0.1] }}
                    transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }}
                />
            ))}

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>

                {/* Header */}
                <motion.div
                    className="text-center"
                    style={{ marginBottom: 72 }}
                    initial={{ opacity: 0, y: -24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 9,
                            fontSize: 11, fontWeight: 700, color: '#800020',
                            letterSpacing: '0.26em', textTransform: 'uppercase',
                            marginBottom: 16,
                        }}
                    >
                        <motion.span
                            style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.6, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        By The Numbers
                        <motion.span
                            style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.6, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        style={{
                            color: '#fff', fontWeight: 900,
                            fontSize: 'clamp(30px, 4.5vw, 48px)',
                            margin: '0 0 16px', lineHeight: 1.15,
                        }}
                    >
                        WICEBD in{' '}
                        <span style={{ color: '#800020' }}>Numbers</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.28 }}
                        style={{
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: 15, lineHeight: 1.8,
                            maxWidth: 480, margin: '0 auto',
                        }}
                    >
                        A growing movement of innovators, engineers, and creators
                        competing on Bangladesh's largest invention stage.
                    </motion.p>
                </motion.div>

                {/* Stat cards — row 1: 3 cards */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                    {STATS.slice(0, 3).map((stat, i) => (
                        <StatCard key={i} stat={stat} index={i} />
                    ))}
                </div>

                {/* Stat cards — row 2: 2 cards centered */}
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                    {STATS.slice(3).map((stat, i) => (
                        <div key={i} style={{ flex: '0 0 calc(33.333% - 14px)', maxWidth: 'calc(33.333% - 14px)' }}>
                            <StatCard stat={stat} index={i + 3} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FactV2;
