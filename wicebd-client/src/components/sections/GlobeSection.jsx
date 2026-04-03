import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────
   Canvas globe — latitude/longitude rings
   rotating to simulate a spinning Earth
───────────────────────────────────────── */
const GlobeCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let angle = 0;

        const SIZE = 320;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const cx = SIZE / 2;
        const cy = SIZE / 2;
        const R = 140;

        // Hotspot cities (lon, lat in degrees)
        const CITIES = [
            { name: 'Dhaka', lon: 90.4, lat: 23.7 },
            { name: 'Kuala Lumpur', lon: 101.7, lat: 3.1 },
            { name: 'Jakarta', lon: 106.8, lat: -6.2 },
            { name: 'Bangkok', lon: 100.5, lat: 13.7 },
            { name: 'Mumbai', lon: 72.8, lat: 19.0 },
            { name: 'Mexico City', lon: -99.1, lat: 19.4 },
        ];

        const project = (lon, lat, rot) => {
            const phi = (lat * Math.PI) / 180;
            const theta = ((lon + rot) * Math.PI) / 180;
            const x = R * Math.cos(phi) * Math.sin(theta);
            const y = R * Math.sin(phi);
            const z = R * Math.cos(phi) * Math.cos(theta);
            return { x: cx + x, y: cy - y, z, visible: z > -20 };
        };

        const draw = () => {
            ctx.clearRect(0, 0, SIZE, SIZE);

            // Outer glow
            const grd = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.3);
            grd.addColorStop(0, 'rgba(128,0,32,0)');
            grd.addColorStop(1, 'rgba(128,0,32,0.18)');
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            // Sphere base
            const sphere = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, R);
            sphere.addColorStop(0, 'rgba(30,0,10,0.9)');
            sphere.addColorStop(1, 'rgba(8,0,4,0.95)');
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fillStyle = sphere;
            ctx.fill();

            // Latitude rings
            for (let lat = -75; lat <= 75; lat += 15) {
                const phi = (lat * Math.PI) / 180;
                const ry = R * Math.cos(phi);
                const yc = cy - R * Math.sin(phi);
                ctx.beginPath();
                ctx.ellipse(cx, yc, ry, ry * 0.18, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(128,0,32,0.25)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Longitude lines (animated rotation)
            const LONS = 12;
            for (let i = 0; i < LONS; i++) {
                const lon = (i * 180) / LONS + angle;
                const theta = (lon * Math.PI) / 180;
                const x1 = cx + R * Math.sin(theta);
                const x2 = cx - R * Math.sin(theta);
                const ry = R * Math.abs(Math.cos(theta));
                const visible = Math.cos(theta) > 0;
                ctx.beginPath();
                ctx.ellipse(cx, cy, Math.max(1, ry), R, theta > Math.PI ? Math.PI / 2 : -Math.PI / 2, 0, Math.PI * 2);
                ctx.strokeStyle = visible
                    ? 'rgba(200,0,40,0.22)'
                    : 'rgba(80,0,20,0.1)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Equator
            ctx.beginPath();
            ctx.ellipse(cx, cy, R, R * 0.18, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(200,0,40,0.45)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // City dots
            CITIES.forEach(city => {
                const p = project(city.lon, city.lat, angle);
                if (!p.visible) return;
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
                glow.addColorStop(0, 'rgba(233,69,96,0.9)');
                glow.addColorStop(1, 'rgba(233,69,96,0)');
                ctx.beginPath();
                ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#e94560';
                ctx.fill();

                // Label
                if (city.name === 'Dhaka') {
                    ctx.font = 'bold 10px Arial';
                    ctx.fillStyle = 'rgba(255,255,255,0.85)';
                    ctx.fillText('📍 ' + city.name, p.x + 8, p.y - 6);
                }
            });

            // Outer ring
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(128,0,32,0.4)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            angle += 0.25;
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 320, height: 320, display: 'block', margin: '0 auto' }}
        />
    );
};

/* ─────────────────────────────────────────
   Reach data
───────────────────────────────────────── */
const REACH = [
    { icon: '🇧🇩', country: 'Bangladesh', role: 'Representing Nation', medals: '14 Gold' },
    { icon: '🇲🇾', country: 'Malaysia', role: 'Host Nation — ITEX', medals: 'Gold + Special' },
    { icon: '🇮🇩', country: 'Indonesia', role: 'INNOPA — Jakarta', medals: 'Gold' },
    { icon: '🇹🇭', country: 'Thailand', role: 'IPITEX — Bangkok', medals: 'Silver' },
    { icon: '🇮🇳', country: 'India', role: 'IENA — Mumbai', medals: 'Bronze' },
    { icon: '🇲🇽', country: 'Mexico', role: 'CONACYT — Mexico City', medals: 'Participation' },
];

const GlobeSection = () => (
    <section style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #04000a 0%, #0a0018 60%, #04000a 100%)',
        padding: '110px 0 100px',
        overflow: 'hidden',
    }}>
        {/* Starfield dots */}
        {Array.from({ length: 60 }).map((_, i) => (
            <motion.div key={i}
                style={{
                    position: 'absolute',
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.6)',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    pointerEvents: 'none',
                }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
            />
        ))}

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
                    <span style={{ width: 28, height: 1, background: '#800020', display: 'inline-block' }} />
                    Global Reach
                    <span style={{ width: 28, height: 1, background: '#800020', display: 'inline-block' }} />
                </span>
                <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '42px', margin: 0, lineHeight: 1.2 }}>
                    Bangladesh on the <span style={{ color: '#e94560' }}>World Stage</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginTop: '14px', maxWidth: '500px', margin: '14px auto 0', lineHeight: 1.75 }}>
                    WICE Bangladesh teams have competed and won at international invention expos hosted across 6 countries, proudly representing Bangladesh on the world stage.
                </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

                {/* Left — Globe */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}
                >
                    {/* Glow ring around globe */}
                    <div style={{ position: 'relative' }}>
                        <motion.div
                            style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 380, height: 380, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(128,0,32,0.18), transparent 70%)',
                                filter: 'blur(30px)',
                            }}
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <GlobeCanvas />
                    </div>

                    {/* Globe legend */}
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { color: '#e94560', label: 'Competition venues' },
                            { color: 'rgba(200,0,40,0.45)', label: 'Globe rings' },
                        ].map((l, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right — reach cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {REACH.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.45 }}
                            whileHover={{ x: 6, boxShadow: '0 12px 36px rgba(128,0,32,0.2)' }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '18px',
                                background: 'rgba(255,255,255,0.04)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderLeft: '3px solid #800020',
                                borderRadius: '14px',
                                padding: '16px 20px',
                                cursor: 'default',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <span style={{ fontSize: '2rem', flexShrink: 0 }}>{r.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px', marginBottom: '2px' }}>{r.country}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{r.role}</div>
                            </div>
                            <div style={{
                                fontSize: '11px', fontWeight: 700, color: '#e94560',
                                background: 'rgba(233,69,96,0.12)',
                                border: '1px solid rgba(233,69,96,0.25)',
                                borderRadius: '50px', padding: '4px 12px',
                                flexShrink: 0,
                            }}>
                                {r.medals}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default GlobeSection;
