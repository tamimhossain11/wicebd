import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';
import featureV2Data from '../../jsonData/feature/featureV2Data.json';

/* ─── Icons (SVG, consistent crimson) ─────────────── */
const CategoryIcon = ({ id }) => {
    const icons = {
        1: ( // Robo Soccer
            <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
                <rect x="10" y="14" width="28" height="20" rx="5" stroke="#800020" strokeWidth="2.2" />
                <rect x="16" y="20" width="6" height="7" rx="2" fill="rgba(128,0,32,0.2)" stroke="#800020" strokeWidth="1.6" />
                <rect x="26" y="20" width="6" height="7" rx="2" fill="rgba(128,0,32,0.2)" stroke="#800020" strokeWidth="1.6" />
                <path d="M10 26h4M34 26h4" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="9" r="3" stroke="#800020" strokeWidth="2" />
                <path d="M24 12v2" stroke="#800020" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        2: ( // Science Olympiad
            <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
                <path d="M24 8l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" stroke="#800020" strokeWidth="2" strokeLinejoin="round" fill="rgba(128,0,32,0.1)" />
            </svg>
        ),
        3: ( // Wall Magazine
            <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
                <rect x="8" y="8" width="32" height="38" rx="4" stroke="#800020" strokeWidth="2.2" />
                <path d="M14 18h20M14 24h20M14 30h12" stroke="#800020" strokeWidth="1.8" strokeLinecap="round" />
                <rect x="14" y="10" width="20" height="5" rx="2" fill="rgba(128,0,32,0.2)" stroke="#800020" strokeWidth="1.4" />
            </svg>
        ),
        4: ( // Project Display
            <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
                <circle cx="24" cy="20" r="10" stroke="#800020" strokeWidth="2.2" />
                <path d="M20 31h8M22 35h4" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 10V7M34.2 13.8l2.1-2.1M13.8 13.8l-2.1-2.1" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="20" r="4" fill="rgba(128,0,32,0.25)" />
            </svg>
        ),
    };
    return icons[id] || null;
};

/* ─── Animated SVG Robot ───────────────────────────── */
const Robot = () => (
    <svg viewBox="0 0 120 178" width="104" height="155" fill="none">
        {/* Antenna */}
        <line x1="60" y1="17" x2="60" y2="4" stroke="#800020" strokeWidth="2.5" strokeLinecap="round" />
        <motion.circle
            cx="60" cy="4" r="4.5" fill="#800020"
            animate={{ opacity: [1, 0.2, 1], r: [4.5, 6.5, 4.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Head */}
        <rect x="28" y="17" width="64" height="46" rx="11" fill="#0c0c1a" stroke="#800020" strokeWidth="2" />

        {/* Eyes — blink */}
        <motion.rect x="38" y="28" width="14" height="10" rx="3" fill="#800020"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.05, 0.12] }}
            style={{ transformOrigin: '45px 33px' }}
        />
        <motion.rect x="68" y="28" width="14" height="10" rx="3" fill="#800020"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.05, 0.12], delay: 0.07 }}
            style={{ transformOrigin: '75px 33px' }}
        />

        {/* Mouth grill */}
        {[0, 7, 14].map(x => (
            <line key={x} x1={45 + x} y1="50" x2={45 + x} y2="57"
                stroke="#800020" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
        ))}

        {/* Neck */}
        <rect x="50" y="63" width="20" height="8" rx="3" fill="#800020" opacity="0.35" />

        {/* Body */}
        <rect x="18" y="71" width="84" height="58" rx="13" fill="#0c0c1a" stroke="#800020" strokeWidth="2" />

        {/* Chest panel */}
        <rect x="32" y="82" width="56" height="32" rx="7" fill="rgba(128,0,32,0.07)" stroke="rgba(128,0,32,0.35)" strokeWidth="1.4" />

        {/* Pulsing core */}
        <motion.circle cx="60" cy="98" r="9" fill="rgba(128,0,32,0.15)" stroke="#800020" strokeWidth="1.6"
            animate={{ r: [9, 12, 9], opacity: [0.9, 0.4, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="60" cy="98" r="4.5" fill="#800020" opacity="0.85" />

        {/* Side indicators */}
        {[-13, 13].map((dx, i) => (
            <motion.circle key={i} cx={60 + dx} cy="98" r="2.5" fill="#800020"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.45 }}
            />
        ))}

        {/* Arms */}
        <rect x="1" y="75" width="17" height="40" rx="7" fill="#0c0c1a" stroke="#800020" strokeWidth="1.8" />
        <motion.rect x="3" y="107" width="13" height="10" rx="4" fill="#800020" opacity="0.45"
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity }}
        />
        <rect x="102" y="75" width="17" height="40" rx="7" fill="#0c0c1a" stroke="#800020" strokeWidth="1.8" />
        <motion.rect x="104" y="107" width="13" height="10" rx="4" fill="#800020" opacity="0.45"
            animate={{ opacity: [0.85, 0.45, 0.85] }}
            transition={{ duration: 2.2, repeat: Infinity }}
        />

        {/* Legs */}
        <rect x="31" y="129" width="22" height="35" rx="8" fill="#0c0c1a" stroke="#800020" strokeWidth="1.8" />
        <rect x="67" y="129" width="22" height="35" rx="8" fill="#0c0c1a" stroke="#800020" strokeWidth="1.8" />

        {/* Feet */}
        <rect x="27" y="156" width="30" height="10" rx="5" fill="#800020" opacity="0.45" />
        <rect x="63" y="156" width="30" height="10" rx="5" fill="#800020" opacity="0.45" />
    </svg>
);

/* ─── Tree connector lines ─────────────────────────── */
const TreeLines = () => (
    <svg viewBox="0 0 1000 96" width="100%" height="96" preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}>
        {/* Stem */}
        <motion.line x1="500" y1="0" x2="500" y2="44"
            stroke="#800020" strokeWidth="1.8" strokeLinecap="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
        />
        {/* Horizontal bar */}
        <motion.line x1="120" y1="44" x2="880" y2="44"
            stroke="#800020" strokeWidth="1.8" strokeLinecap="round"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            style={{ transformOrigin: '500px 44px' }}
        />
        {/* Drops */}
        {[120, 373, 627, 880].map((x, i) => (
            <motion.line key={i} x1={x} y1="44" x2={x} y2="96"
                stroke="#800020" strokeWidth="1.8" strokeLinecap="round"
                initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.85 + i * 0.07 }}
                style={{ transformOrigin: `${x}px 44px` }}
            />
        ))}
        {/* Node dots */}
        {[120, 373, 627, 880].map((x, i) => (
            <motion.circle key={i} cx={x} cy="44" r="5" fill="#800020"
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ type: 'spring', delay: 1.0 + i * 0.07 }}
                style={{ transformOrigin: `${x}px 44px` }}
            />
        ))}
    </svg>
);

/* ─── Circuit canvas background ───────────────────── */
const CircuitBackground = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let w, h;
        const nodes = [];
        const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener('resize', resize);
        for (let i = 0; i < 26; i++) {
            nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.8 + 0.8, pulse: Math.random() * Math.PI * 2 });
        }
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            nodes.forEach(n => { n.x += n.vx; n.y += n.vy; n.pulse += 0.02; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; });
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 155) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(128,0,32,${(1 - dist / 155) * 0.15})`; ctx.lineWidth = 1; ctx.stroke(); }
                }
            }
            nodes.forEach(n => { const p = Math.sin(n.pulse) * 0.5 + 0.5; ctx.beginPath(); ctx.arc(n.x, n.y, n.r + p * 0.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,0,50,${0.25 + p * 0.25})`; ctx.fill(); });
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
};

/* ─── Main section ─────────────────────────────────── */
const FeatureV2 = () => {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-60px' });

    return (
        <section ref={sectionRef} style={{
            position: 'relative',
            background: 'linear-gradient(160deg, #06020e 0%, #0d000a 50%, #06020e 100%)',
            padding: '110px 0 100px',
            overflow: 'hidden',
        }}>
            <CircuitBackground />

            {/* Grid texture */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                backgroundImage: `linear-gradient(rgba(128,0,32,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(128,0,32,0.04) 1px,transparent 1px)`,
                backgroundSize: '52px 52px',
                maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 100%)',
            }} />

            {/* Ambient glow */}
            <div style={{
                position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
                width: '700px', height: '320px', pointerEvents: 'none', zIndex: 1,
                background: 'radial-gradient(ellipse, rgba(128,0,32,0.13) 0%, transparent 70%)',
            }} />

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>

                {/* Header */}
                <motion.div className="text-center" style={{ marginBottom: '52px' }}
                    initial={{ opacity: 0, y: -24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.24em',
                        fontWeight: 700, color: '#800020', marginBottom: '14px',
                    }}>
                        <motion.span style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.6, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                        What We Offer
                        <motion.span style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.6, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                    </span>
                    <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(30px, 5vw, 46px)', margin: 0, lineHeight: 1.15 }}>
                        Competition <span style={{ color: '#800020' }}>Categories</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '15px', maxWidth: '500px', margin: '16px auto 0', lineHeight: 1.85 }}>
                        Four distinct competitions designed to showcase innovation,
                        creativity, knowledge and engineering talent.
                    </p>
                </motion.div>

                {/* Robot */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.65 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <motion.div
                            animate={{ y: [0, -13, 0] }}
                            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ filter: 'drop-shadow(0 14px 36px rgba(128,0,32,0.45))' }}
                        >
                            <Robot />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Tree connectors */}
                <TreeLines />

                {/* Category cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                }}>
                    {featureV2Data.map((feature, i) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 36 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.05 + i * 0.09 }}
                            whileHover={{ y: -7 }}
                            style={{
                                position: 'relative',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(128,0,32,0.2)',
                                borderTop: '2px solid #800020',
                                borderRadius: '16px',
                                padding: '26px 20px',
                                overflow: 'hidden',
                                transition: 'box-shadow 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 18px 52px rgba(128,0,32,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            {/* Corner glow */}
                            <div style={{
                                position: 'absolute', top: -18, right: -18,
                                width: 90, height: 90, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(128,0,32,0.14), transparent 70%)',
                                pointerEvents: 'none',
                            }} />

                            {/* Badge + number row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.14em', color: '#800020',
                                    background: 'rgba(128,0,32,0.1)', border: '1px solid rgba(128,0,32,0.3)',
                                    borderRadius: '50px', padding: '3px 11px',
                                }}>
                                    {feature.badge}
                                </span>
                                <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(128,0,32,0.45)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                    0{feature.id}
                                </span>
                            </div>

                            {/* Icon */}
                            <motion.div
                                style={{ marginBottom: '16px' }}
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 5 + i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div style={{
                                    width: 58, height: 58, borderRadius: '14px',
                                    background: 'rgba(128,0,32,0.1)',
                                    border: '1px solid rgba(128,0,32,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 16px rgba(128,0,32,0.2)',
                                }}>
                                    <CategoryIcon id={feature.id} />
                                </div>
                            </motion.div>

                            {/* Title */}
                            <div style={{ fontWeight: 800, color: '#fff', fontSize: '16px', marginBottom: '10px', lineHeight: 1.25 }}>
                                {feature.name}
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'rgba(128,0,32,0.15)', marginBottom: '12px' }} />

                            {/* Description */}
                            <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '13px', lineHeight: 1.75, flex: 1, margin: '0 0 20px' }}>
                                {feature.text}
                            </p>

                            {/* CTA */}
                            <Link to={`${feature.to}#`} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '7px',
                                        color: '#800020', fontWeight: 600, fontSize: '13px', letterSpacing: '0.04em',
                                    }}
                                >
                                    Learn More
                                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="#800020" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.div>
                            </Link>

                            {/* Bottom shimmer on hover */}
                            <motion.div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                                background: 'linear-gradient(90deg, transparent, #800020, transparent)',
                                opacity: 0,
                            }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ textAlign: 'center', marginTop: '52px' }}
                >
                    <Link to="/registration#" style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                background: 'linear-gradient(135deg, #800020, #c0002a)',
                                color: '#fff', fontWeight: 700, fontSize: '14px',
                                padding: '14px 36px', borderRadius: '50px',
                                boxShadow: '0 8px 28px rgba(128,0,32,0.45)',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Register for Your Category →
                        </motion.div>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
};

export default FeatureV2;
