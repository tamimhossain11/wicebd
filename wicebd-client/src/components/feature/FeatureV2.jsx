import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import featureV2Data from '../../jsonData/feature/featureV2Data.json';
import SingleFeatureV2 from './SingleFeatureV2';

// Animated circuit/particle canvas background
const CircuitBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animId;
        let w, h;

        const nodes = [];
        const NODE_COUNT = 28;

        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1,
                pulse: Math.random() * Math.PI * 2,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            // Update positions
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                n.pulse += 0.02;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
            });

            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 160) {
                        const alpha = (1 - dist / 160) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(128, 0, 32, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            nodes.forEach(n => {
                const pulse = Math.sin(n.pulse) * 0.5 + 0.5;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r + pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 0, 50, ${0.3 + pulse * 0.3})`;
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 1,
            }}
        />
    );
};

const FeatureV2 = () => {
    return (
        <section style={{
            position: 'relative',
            background: 'linear-gradient(160deg, #0a0610 0%, #120410 50%, #0a0610 100%)',
            padding: '110px 0 90px',
            overflow: 'hidden',
        }}>
            {/* Animated circuit canvas */}
            <CircuitBackground />

            {/* Ambient glow */}
            {[
                { left: '-100px', top: '30%', color: 'rgba(128,0,32,0.2)', w: 500 },
                { left: '70%', top: '-80px', color: 'rgba(233,69,96,0.1)', w: 400 },
                { left: '40%', top: '70%', color: 'rgba(15,52,96,0.18)', w: 360 },
            ].map((orb, i) => (
                <motion.div key={i}
                    style={{
                        position: 'absolute', borderRadius: '50%',
                        width: orb.w, height: orb.w,
                        left: orb.left, top: orb.top,
                        background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
                        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
                    }}
                    animate={{ y: [0, 24, 0], x: [0, 12, 0] }}
                    transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>
                {/* Header */}
                <motion.div
                    className="text-center"
                    style={{ marginBottom: '68px' }}
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
                        <motion.span
                            style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        What We Offer
                        <motion.span
                            style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </span>
                    <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '42px', margin: 0, lineHeight: 1.2 }}>
                        Competition Categories
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginTop: '14px', maxWidth: '500px', margin: '14px auto 0', lineHeight: 1.75 }}>
                        Four distinct competitions designed to showcase innovation, creativity, knowledge and engineering talent.
                    </p>
                </motion.div>

                <div className="row g-4 justify-content-center">
                    {featureV2Data.map((feature, i) => (
                        <SingleFeatureV2 feature={feature} key={feature.id} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureV2;
