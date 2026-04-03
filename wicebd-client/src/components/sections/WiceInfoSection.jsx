import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';

/* ─── 3D SVG Icons ──────────────────────────────────── */
const Icon3D = ({ type }) => {
    const defs = {
        globe: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                <defs>
                    <radialGradient id="globeBase" cx="38%" cy="32%" r="65%">
                        <stop offset="0%" stopColor="#3a0010" />
                        <stop offset="100%" stopColor="#0a0003" />
                    </radialGradient>
                    <radialGradient id="globeSheen" cx="30%" cy="25%" r="50%">
                        <stop offset="0%" stopColor="rgba(255,120,120,0.35)" />
                        <stop offset="100%" stopColor="rgba(128,0,32,0)" />
                    </radialGradient>
                    <filter id="globeShadow">
                        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#800020" floodOpacity="0.5" />
                    </filter>
                </defs>
                <circle cx="32" cy="32" r="28" fill="url(#globeBase)" filter="url(#globeShadow)" />
                <circle cx="32" cy="32" r="28" fill="url(#globeSheen)" />
                {/* Latitude lines */}
                <ellipse cx="32" cy="32" rx="28" ry="8" stroke="rgba(200,0,40,0.4)" strokeWidth="0.8" fill="none" />
                <ellipse cx="32" cy="22" rx="22" ry="6" stroke="rgba(200,0,40,0.25)" strokeWidth="0.7" fill="none" />
                <ellipse cx="32" cy="42" rx="22" ry="6" stroke="rgba(200,0,40,0.25)" strokeWidth="0.7" fill="none" />
                {/* Longitude lines */}
                <path d="M32 4 Q48 32 32 60" stroke="rgba(200,0,40,0.35)" strokeWidth="0.8" fill="none" />
                <path d="M32 4 Q16 32 32 60" stroke="rgba(200,0,40,0.35)" strokeWidth="0.8" fill="none" />
                <line x1="4" y1="32" x2="60" y2="32" stroke="rgba(200,0,40,0.4)" strokeWidth="0.8" />
                <line x1="32" y1="4" x2="32" y2="60" stroke="rgba(200,0,40,0.3)" strokeWidth="0.8" />
                {/* Highlight */}
                <ellipse cx="22" cy="20" rx="8" ry="5" fill="rgba(255,200,200,0.12)" />
                {/* Rim */}
                <circle cx="32" cy="32" r="28" stroke="rgba(200,0,40,0.5)" strokeWidth="1.2" fill="none" />
            </svg>
        ),
        bulb: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                <defs>
                    <radialGradient id="bulbGlow" cx="42%" cy="30%" r="65%">
                        <stop offset="0%" stopColor="#5a1a00" />
                        <stop offset="100%" stopColor="#1a0500" />
                    </radialGradient>
                    <radialGradient id="bulbInner" cx="40%" cy="28%" r="55%">
                        <stop offset="0%" stopColor="rgba(255,160,60,0.5)" />
                        <stop offset="100%" stopColor="rgba(128,0,32,0)" />
                    </radialGradient>
                    <filter id="bulbShadow">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#c04000" floodOpacity="0.4" />
                    </filter>
                </defs>
                <path d="M32 8C20 8 12 16 12 26c0 7 4 13 10 17v6h20v-6c6-4 10-10 10-17C52 16 44 8 32 8z"
                    fill="url(#bulbGlow)" filter="url(#bulbShadow)" />
                <path d="M32 8C20 8 12 16 12 26c0 7 4 13 10 17v6h20v-6c6-4 10-10 10-17C52 16 44 8 32 8z"
                    fill="url(#bulbInner)" />
                <rect x="24" y="49" width="16" height="3" rx="1.5" fill="rgba(200,0,40,0.6)" />
                <rect x="26" y="53" width="12" height="3" rx="1.5" fill="rgba(200,0,40,0.5)" />
                {/* Filament */}
                <path d="M32 20 L28 30 L36 30 L32 40" stroke="rgba(255,180,80,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Shine */}
                <ellipse cx="24" cy="18" rx="5" ry="3" fill="rgba(255,255,255,0.1)" />
                <circle cx="32" cy="32" r="28" stroke="none" fill="none" />
            </svg>
        ),
        trophy: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                <defs>
                    <linearGradient id="trophyBody" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4a1020" />
                        <stop offset="50%" stopColor="#800020" />
                        <stop offset="100%" stopColor="#200008" />
                    </linearGradient>
                    <linearGradient id="trophyShine" x1="0%" y1="0%" x2="60%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,180,180,0.3)" />
                        <stop offset="100%" stopColor="rgba(128,0,32,0)" />
                    </linearGradient>
                    <filter id="trophyShadow">
                        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#800020" floodOpacity="0.5" />
                    </filter>
                </defs>
                {/* Cup body */}
                <path d="M18 10h28v18c0 10-6 16-14 18-8-2-14-8-14-18V10z"
                    fill="url(#trophyBody)" filter="url(#trophyShadow)" />
                <path d="M18 10h28v18c0 10-6 16-14 18-8-2-14-8-14-18V10z"
                    fill="url(#trophyShine)" />
                {/* Handles */}
                <path d="M18 14 Q8 14 8 24 Q8 32 18 32" stroke="rgba(200,0,40,0.7)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M46 14 Q56 14 56 24 Q56 32 46 32" stroke="rgba(200,0,40,0.7)" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Stem */}
                <rect x="28" y="46" width="8" height="8" fill="rgba(128,0,32,0.8)" />
                {/* Base */}
                <rect x="20" y="54" width="24" height="5" rx="2" fill="url(#trophyBody)" />
                {/* Star in cup */}
                <path d="M32 18 l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" fill="rgba(255,220,100,0.6)" />
                {/* Shine */}
                <ellipse cx="24" cy="16" rx="4" ry="3" fill="rgba(255,255,255,0.12)" />
            </svg>
        ),
        robot: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                <defs>
                    <linearGradient id="robotBody" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2a0010" />
                        <stop offset="100%" stopColor="#0a0003" />
                    </linearGradient>
                    <radialGradient id="robotEye" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ff4444" />
                        <stop offset="100%" stopColor="#800020" />
                    </radialGradient>
                    <filter id="robotShadow">
                        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#800020" floodOpacity="0.45" />
                    </filter>
                </defs>
                {/* Antenna */}
                <line x1="32" y1="4" x2="32" y2="12" stroke="rgba(200,0,40,0.7)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="32" cy="4" r="2.5" fill="#800020" />
                {/* Head */}
                <rect x="16" y="12" width="32" height="22" rx="6"
                    fill="url(#robotBody)" filter="url(#robotShadow)" />
                {/* Eyes */}
                <circle cx="24" cy="22" r="5" fill="url(#robotEye)" />
                <circle cx="40" cy="22" r="5" fill="url(#robotEye)" />
                <circle cx="25" cy="21" r="1.5" fill="rgba(255,255,255,0.6)" />
                <circle cx="41" cy="21" r="1.5" fill="rgba(255,255,255,0.6)" />
                {/* Mouth */}
                <rect x="22" y="29" width="20" height="3" rx="1.5" fill="rgba(200,0,40,0.5)" />
                {/* Body */}
                <rect x="18" y="36" width="28" height="20" rx="5"
                    fill="url(#robotBody)" />
                {/* Chest light */}
                <circle cx="32" cy="46" r="5" fill="rgba(200,0,40,0.2)" stroke="rgba(200,0,40,0.6)" strokeWidth="1" />
                <circle cx="32" cy="46" r="2.5" fill="rgba(200,0,40,0.8)" />
                {/* Arms */}
                <rect x="6" y="37" width="10" height="16" rx="4" fill="url(#robotBody)" />
                <rect x="48" y="37" width="10" height="16" rx="4" fill="url(#robotBody)" />
                {/* Shine on head */}
                <ellipse cx="24" cy="16" rx="6" ry="3" fill="rgba(255,200,200,0.1)" />
            </svg>
        ),
    };
    return defs[type] || null;
};

/* ─── Tab data ─────────────────────────────────────── */
const TABS = [
    {
        id: 0, type: 'globe',
        title: 'What is WICE?',
        short: 'World Invention Competition & Exhibition',
        content: 'WICE Bangladesh is the national chapter of the World Invention Competition & Exhibition — a prestigious platform connecting Bangladeshi student innovators with the international science community.',
        stats: [{ label: 'Edition', val: '8th' }, { label: 'Founded', val: '2016' }, { label: 'Country', val: 'BD' }],
        to: '/about-us',
    },
    {
        id: 1, type: 'bulb',
        title: 'Project Competition',
        short: 'Innovation meets real-world impact',
        content: 'Teams of up to 3 members design and present invention projects. Judged on novelty, feasibility, and societal impact. Top teams earn the right to represent Bangladesh internationally.',
        stats: [{ label: 'Team Size', val: '≤3' }, { label: 'Fee', val: '620৳' }, { label: 'Award', val: 'Gold' }],
        to: '/registration',
    },
    {
        id: 2, type: 'trophy',
        title: 'Science Olympiad',
        short: 'Test your knowledge and logic',
        content: 'Individual competition testing science, mathematics, and engineering knowledge. Multiple rounds with increasing difficulty — from MCQ to open-ended problems.',
        stats: [{ label: 'Format', val: 'Solo' }, { label: 'Rounds', val: '3' }, { label: 'Level', val: 'All' }],
        to: '/registration',
    },
    {
        id: 3, type: 'robot',
        title: 'Robo Soccer',
        short: 'Engineer, program, and compete',
        content: 'Teams build autonomous soccer-playing robots from scratch. Competing in a tournament bracket, teams must master electronics, coding, and mechanical design simultaneously.',
        stats: [{ label: 'Team', val: '≤4' }, { label: 'Format', val: 'Tour.' }, { label: 'Skills', val: 'All' }],
        to: '/robo-soccer',
    },
];

/* ─── 3D Particle Sphere (canvas) ──────────────────── */
/* ── helper: simple Y-axis 3-D rotate ────────────────── */
const rot3D = (x, y, z, ay, ax) => {
    const cy = Math.cos(ay), sy = Math.sin(ay);
    const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
    const cx2 = Math.cos(ax), sx2 = Math.sin(ax);
    return { x: x1, y: y * cx2 - z1 * sx2, z: y * sx2 + z1 * cx2 };
};

/* ── 1. Globe — rotating earth with BD→MY arc ─────────── */
const GlobeScene = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
        const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.37;
        let ay = 0, id;

        // BD lon=90 lat=23, MY lon=102 lat=3 (normalised to sphere surface)
        const geoToXYZ = (lon, lat) => {
            const phi = (lat * Math.PI) / 180, theta = (lon * Math.PI) / 180;
            return { x: Math.cos(phi) * Math.sin(theta), y: -Math.sin(phi), z: Math.cos(phi) * Math.cos(theta) };
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // Sphere
            const sg = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.1, cx, cy, R);
            sg.addColorStop(0, '#2a0008'); sg.addColorStop(1, '#080002');
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fillStyle = sg; ctx.fill();

            // Lat lines
            for (let lat = -75; lat <= 75; lat += 15) {
                const phi = (lat * Math.PI) / 180;
                const ry = R * Math.cos(phi), yc = cy + R * Math.sin(phi);
                ctx.beginPath(); ctx.ellipse(cx, yc, ry, ry * 0.18, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(180,0,32,0.2)'; ctx.lineWidth = 0.7; ctx.stroke();
            }
            // Lon lines
            for (let i = 0; i < 12; i++) {
                const theta = (i * 180 / 12 + ay * 180 / Math.PI) * Math.PI / 180;
                const ry = R * Math.abs(Math.cos(theta));
                ctx.beginPath();
                ctx.ellipse(cx, cy, Math.max(1, ry), R, theta > Math.PI ? Math.PI / 2 : -Math.PI / 2, 0, Math.PI * 2);
                ctx.strokeStyle = Math.cos(theta) > 0 ? 'rgba(180,0,40,0.18)' : 'rgba(80,0,20,0.07)';
                ctx.lineWidth = 0.7; ctx.stroke();
            }

            // Cities
            [{ lon: 90, lat: 23, label: '🇧🇩' }, { lon: 102, lat: 3, label: '🇲🇾' }].forEach(c => {
                const p3 = geoToXYZ(c.lon, c.lat);
                const r = rot3D(p3.x, p3.y, p3.z, ay, 0.3);
                if (r.z < 0) return;
                const sx = cx + r.x * R, sy = cy + r.y * R;
                const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 12);
                g.addColorStop(0, 'rgba(255,60,80,0.9)'); g.addColorStop(1, 'rgba(255,60,80,0)');
                ctx.beginPath(); ctx.arc(sx, sy, 12, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
                ctx.beginPath(); ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = '#ff3050'; ctx.fill();
                ctx.font = 'bold 11px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fillText(c.label, sx + 7, sy - 4);
            });

            // Connection arc BD→MY (simple curve on visible side)
            const bd3 = rot3D(...Object.values(geoToXYZ(90, 23)), ay, 0.3);
            const my3 = rot3D(...Object.values(geoToXYZ(102, 3)), ay, 0.3);
            if (bd3.z > 0 && my3.z > 0) {
                const x1 = cx + bd3.x * R, y1 = cy + bd3.y * R;
                const x2 = cx + my3.x * R, y2 = cy + my3.y * R;
                const cpx = (x1 + x2) / 2, cpy = Math.min(y1, y2) - 30;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cpx, cpy, x2, y2);
                ctx.strokeStyle = 'rgba(255,100,120,0.55)'; ctx.lineWidth = 1.5;
                ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
            }

            // Outer ring
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(128,0,32,0.45)'; ctx.lineWidth = 1.5; ctx.stroke();

            ay += 0.005; id = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(id);
    }, []);
    return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

/* ── 2. Neural network — innovation / ideas ───────────── */
const InnovationScene = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
        const W = canvas.width, H = canvas.height;
        let id, t = 0;
        const NODES = Array.from({ length: 22 }, () => ({
            x: 60 + Math.random() * (W - 120), y: 60 + Math.random() * (H - 120),
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
            r: 3 + Math.random() * 3, phase: Math.random() * Math.PI * 2,
        }));
        // Particles travelling along edges
        const PARTICLES = Array.from({ length: 14 }, () => ({ progress: Math.random(), edgeIdx: 0, speed: 0.003 + Math.random() * 0.004 }));

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            t += 0.016;
            NODES.forEach(n => {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 40 || n.x > W - 40) n.vx *= -1;
                if (n.y < 40 || n.y > H - 40) n.vy *= -1;
            });

            const edges = [];
            for (let i = 0; i < NODES.length; i++)
                for (let j = i + 1; j < NODES.length; j++) {
                    const dx = NODES[i].x - NODES[j].x, dy = NODES[i].y - NODES[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 130) { edges.push([i, j, d]); }
                }

            // Lines
            edges.forEach(([i, j, d]) => {
                ctx.beginPath(); ctx.moveTo(NODES[i].x, NODES[i].y); ctx.lineTo(NODES[j].x, NODES[j].y);
                ctx.strokeStyle = `rgba(180,0,40,${0.35 * (1 - d / 130)})`; ctx.lineWidth = 0.9; ctx.stroke();
            });

            // Travelling particles
            PARTICLES.forEach(p => {
                if (!edges.length) return;
                p.progress += p.speed;
                if (p.progress >= 1) { p.progress = 0; p.edgeIdx = Math.floor(Math.random() * edges.length); }
                const [i, j] = edges[p.edgeIdx] || edges[0];
                const px = NODES[i].x + (NODES[j].x - NODES[i].x) * p.progress;
                const py = NODES[i].y + (NODES[j].y - NODES[i].y) * p.progress;
                const g = ctx.createRadialGradient(px, py, 0, px, py, 8);
                g.addColorStop(0, 'rgba(255,60,80,0.9)'); g.addColorStop(1, 'rgba(255,60,80,0)');
                ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
                ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fillStyle = '#ff3050'; ctx.fill();
            });

            // Nodes
            NODES.forEach(n => {
                const pulse = Math.sin(t * 2 + n.phase) * 0.5 + 0.5;
                const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * (3 + pulse * 2));
                g.addColorStop(0, 'rgba(200,0,40,0.5)'); g.addColorStop(1, 'rgba(200,0,40,0)');
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (3 + pulse * 2), 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220,30,60,${0.7 + pulse * 0.3})`; ctx.fill();
            });
            id = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(id);
    }, []);
    return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

/* ── 3. Atom — science / olympiad ────────────────────── */
const AtomScene = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
        const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
        const Rx = Math.min(W, H) * 0.34, Ry = Rx * 0.28;
        let id, t = 0;

        const ORBITS = [
            { tilt: 0, speed: 1, phase: 0 },
            { tilt: Math.PI / 3, speed: 0.8, phase: 2 },
            { tilt: -Math.PI / 3, speed: 1.2, phase: 4 },
        ];

        const draw = () => {
            ctx.clearRect(0, 0, W, H); t += 0.018;

            // Nucleus glow
            [40, 24, 14, 7].forEach((r, i) => {
                const alpha = [0.06, 0.12, 0.25, 0.9][i];
                const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                g.addColorStop(0, `rgba(220,30,60,${alpha})`);
                g.addColorStop(1, 'rgba(180,0,32,0)');
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            });
            ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#ff3050'; ctx.fill();

            ORBITS.forEach(orb => {
                // Draw orbit ellipse (tilted)
                ctx.save();
                ctx.translate(cx, cy); ctx.rotate(orb.tilt);
                ctx.beginPath(); ctx.ellipse(0, 0, Rx, Ry, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(180,0,40,0.3)'; ctx.lineWidth = 1; ctx.stroke();
                ctx.restore();

                // Electron position on orbit
                const angle = t * orb.speed + orb.phase;
                const ex0 = Rx * Math.cos(angle), ey0 = Ry * Math.sin(angle);
                // Apply tilt rotation
                const ex = cx + ex0 * Math.cos(orb.tilt) - ey0 * Math.sin(orb.tilt);
                const ey = cy + ex0 * Math.sin(orb.tilt) + ey0 * Math.cos(orb.tilt);

                const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 14);
                g.addColorStop(0, 'rgba(255,60,80,0.8)'); g.addColorStop(1, 'rgba(255,60,80,0)');
                ctx.beginPath(); ctx.arc(ex, ey, 14, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
                ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fillStyle = '#ff3050'; ctx.fill();
            });

            // Label
            ctx.font = '11px monospace'; ctx.fillStyle = 'rgba(200,0,40,0.5)';
            ctx.textAlign = 'center'; ctx.fillText('SCIENCE OLYMPIAD', cx, H - 18);

            id = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(id);
    }, []);
    return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

/* ── 4. Wireframe robot head — robo soccer ───────────── */
const RobotScene = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
        const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
        const S = Math.min(W, H) * 0.28;
        let ay = 0, ax = 0.18, id;

        // Box vertices (head)
        const vHead = [
            [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
            [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1],
        ].map(([x,y,z])=>({x:x*S*0.9,y:y*S*0.7,z:z*S*0.55}));
        const eHead = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

        // Eye boxes
        const eye = (ox) => [
            [ox-0.28,-0.18,-1],[ox+0.28,-0.18,-1],[ox+0.28,0.18,-1],[ox-0.28,0.18,-1],
        ].map(([x,y,z])=>({x:x*S*0.9,y:y*S*0.7,z:z*S*0.55}));
        const eyeEdges = [[0,1],[1,2],[2,3],[3,0]];

        // Antenna
        const ant = [{x:0,y:-S*0.7,z:0},{x:0,y:-S*1.2,z:0}];

        const project = (p) => {
            const r = rot3D(p.x, p.y, p.z, ay, ax);
            const fov = 600;
            const scale = fov / (fov + r.z + S * 1.5);
            return { sx: cx + r.x * scale, sy: cy + r.y * scale, z: r.z, scale };
        };

        const drawEdges = (verts, edges, color, lw = 1.2) => {
            edges.forEach(([i, j]) => {
                const a = project(verts[i]), b = project(verts[j]);
                const alpha = Math.max(0.1, Math.min(0.9, 0.5 + (a.z + b.z) / (S * 4)));
                ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
                ctx.strokeStyle = color.replace('{a}', alpha.toFixed(2));
                ctx.lineWidth = lw; ctx.stroke();
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            // Glow behind
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 1.8);
            g.addColorStop(0, 'rgba(128,0,32,0.1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

            drawEdges(vHead, eHead, 'rgba(180,0,40,{a})', 1.4);
            drawEdges(eye(-0.55), eyeEdges, 'rgba(255,60,80,{a})', 1.2);
            drawEdges(eye(0.55), eyeEdges, 'rgba(255,60,80,{a})', 1.2);

            // Eye inner glow
            [-0.55, 0.55].forEach(ox => {
                const ep = project({ x: ox * S * 0.9, y: -0.02 * S * 0.7, z: -S * 0.55 });
                const eg = ctx.createRadialGradient(ep.sx, ep.sy, 0, ep.sx, ep.sy, 18);
                eg.addColorStop(0, 'rgba(255,40,60,0.45)'); eg.addColorStop(1, 'rgba(255,40,60,0)');
                ctx.beginPath(); ctx.arc(ep.sx, ep.sy, 18, 0, Math.PI * 2); ctx.fillStyle = eg; ctx.fill();
            });

            // Antenna line + tip
            const [a1, a2] = ant.map(project);
            ctx.beginPath(); ctx.moveTo(a1.sx, a1.sy); ctx.lineTo(a2.sx, a2.sy);
            ctx.strokeStyle = 'rgba(180,0,40,0.6)'; ctx.lineWidth = 1.2; ctx.stroke();
            const tipG = ctx.createRadialGradient(a2.sx, a2.sy, 0, a2.sx, a2.sy, 8);
            tipG.addColorStop(0, 'rgba(255,40,60,1)'); tipG.addColorStop(1, 'rgba(255,40,60,0)');
            ctx.beginPath(); ctx.arc(a2.sx, a2.sy, 8, 0, Math.PI * 2); ctx.fillStyle = tipG; ctx.fill();
            ctx.beginPath(); ctx.arc(a2.sx, a2.sy, 3, 0, Math.PI * 2); ctx.fillStyle = '#ff3050'; ctx.fill();

            // Vertices
            vHead.forEach(v => {
                const p = project(v);
                ctx.beginPath(); ctx.arc(p.sx, p.sy, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220,30,60,${Math.max(0.2, 0.5 + p.z / (S * 2))})`;
                ctx.fill();
            });

            ay += 0.007;
            id = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(id);
    }, []);
    return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

/* ── Scene switcher ──────────────────────────────────── */
const Scene3D = ({ type }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={type}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ width: '100%', height: '100%' }}
        >
            {type === 'globe'  && <GlobeScene />}
            {type === 'bulb'   && <InnovationScene />}
            {type === 'trophy' && <AtomScene />}
            {type === 'robot'  && <RobotScene />}
        </motion.div>
    </AnimatePresence>
);

/* ─── Main section ─────────────────────────────────── */
const WiceInfoSection = () => {
    const [active, setActive] = useState(0);
    const tab = TABS[active];

    return (
        <section style={{
            position: 'relative',
            background: 'linear-gradient(160deg, #06020e 0%, #0d0018 50%, #06020e 100%)',
            padding: '110px 0 100px',
            overflow: 'hidden',
        }}>
            {/* Rotating halo */}
            <motion.div
                style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 750, height: 750, borderRadius: '50%',
                    border: '1px solid rgba(128,0,32,0.08)',
                    pointerEvents: 'none',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
            >
                {[0, 90, 180, 270].map(deg => (
                    <div key={deg} style={{
                        position: 'absolute', width: 7, height: 7, borderRadius: '50%',
                        background: '#800020', boxShadow: '0 0 10px #800020',
                        top: '50%', left: '50%',
                        transform: `rotate(${deg}deg) translateX(375px) translate(-50%,-50%)`,
                    }} />
                ))}
            </motion.div>

            {/* Grid */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `linear-gradient(rgba(128,0,32,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(128,0,32,0.05) 1px,transparent 1px)`,
                backgroundSize: '60px 60px',
                maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
            }} />

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>

                {/* Header */}
                <motion.div className="text-center" style={{ marginBottom: 64 }}
                    initial={{ opacity: 0, y: -24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 9,
                        fontSize: 11, fontWeight: 700, color: '#800020',
                        letterSpacing: '0.26em', textTransform: 'uppercase', marginBottom: 16,
                    }}>
                        <motion.span style={{ width: 30, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.6, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                        Discover WICE
                        <motion.span style={{ width: 30, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.6, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                    </span>
                    <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(30px,5vw,48px)', margin: 0, lineHeight: 1.15 }}>
                        Everything About{' '}
                        <span style={{ color: '#800020' }}>WICE Bangladesh</span>
                    </h2>
                </motion.div>

                {/* Two-column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>

                    {/* ── LEFT: Tab list ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {TABS.map((t, i) => (
                            <motion.div
                                key={t.id}
                                onClick={() => setActive(i)}
                                initial={{ opacity: 0, x: -32 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                whileHover={{ x: 6 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 20,
                                    padding: '20px 24px',
                                    borderRadius: 20,
                                    cursor: 'pointer',
                                    background: active === i
                                        ? 'rgba(128,0,32,0.14)'
                                        : 'rgba(255,255,255,0.03)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: `1px solid ${active === i ? 'rgba(128,0,32,0.5)' : 'rgba(255,255,255,0.07)'}`,
                                    boxShadow: active === i ? '0 16px 48px rgba(128,0,32,0.18)' : 'none',
                                    transition: 'all 0.3s ease',
                                    position: 'relative', overflow: 'hidden',
                                }}
                            >
                                {/* Active left bar */}
                                {active === i && (
                                    <motion.div
                                        layoutId="activeBar"
                                        style={{
                                            position: 'absolute', left: 0, top: '15%', bottom: '15%',
                                            width: 3, borderRadius: 3,
                                            background: 'linear-gradient(to bottom, #800020, #c0002a)',
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* 3D Icon container */}
                                <div style={{
                                    width: 72, height: 72, borderRadius: 18, flexShrink: 0,
                                    background: active === i ? 'rgba(128,0,32,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${active === i ? 'rgba(128,0,32,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: active === i ? '0 8px 24px rgba(128,0,32,0.25)' : 'none',
                                }}>
                                    <motion.div
                                        animate={active === i ? { rotate: [0, 5, -5, 0] } : {}}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <Icon3D type={t.type} />
                                    </motion.div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: 800, fontSize: 16,
                                        color: active === i ? '#fff' : 'rgba(255,255,255,0.7)',
                                        marginBottom: 4, transition: 'color 0.3s',
                                    }}>
                                        {t.title}
                                    </div>
                                    <div style={{
                                        fontSize: 12, fontWeight: 500,
                                        color: active === i ? 'rgba(200,0,40,0.85)' : 'rgba(255,255,255,0.35)',
                                        transition: 'color 0.3s',
                                    }}>
                                        {t.short}
                                    </div>
                                </div>

                                {/* Chevron */}
                                <motion.div
                                    animate={{ x: active === i ? 0 : -4, opacity: active === i ? 1 : 0 }}
                                    transition={{ duration: 0.25 }}
                                    style={{ color: '#800020', fontSize: 18, fontWeight: 700, flexShrink: 0 }}
                                >
                                    ›
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── RIGHT: 3D orb + detail ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* 3D Particle Sphere */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            style={{
                                height: 280,
                                borderRadius: 24,
                                overflow: 'hidden',
                                background: 'radial-gradient(ellipse at 50% 50%, rgba(30,0,12,0.95) 0%, rgba(6,0,4,1) 100%)',
                                border: '1px solid rgba(128,0,32,0.25)',
                                boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                                position: 'relative',
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                                background: 'linear-gradient(90deg, transparent, #800020, transparent)',
                                opacity: 0.6, zIndex: 2,
                            }} />
                            <Scene3D type={tab.type} />
                        </motion.div>

                        {/* Detail card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                style={{
                                    background: 'rgba(128,0,32,0.08)',
                                    backdropFilter: 'blur(24px)',
                                    WebkitBackdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(128,0,32,0.28)',
                                    borderRadius: 24,
                                    padding: '36px 36px 32px',
                                    position: 'relative', overflow: 'hidden',
                                    boxShadow: '0 16px 56px rgba(128,0,32,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
                                }}
                            >
                                {/* Corner SVG */}
                                <svg style={{ position: 'absolute', top: 16, right: 16, opacity: 0.12 }} width="64" height="64" viewBox="0 0 64 64">
                                    <circle cx="32" cy="32" r="30" stroke="#800020" strokeWidth="1" fill="none" strokeDasharray="6 4" />
                                    <circle cx="32" cy="32" r="18" stroke="#800020" strokeWidth="1" fill="none" />
                                </svg>

                                {/* Icon */}
                                <motion.div
                                    style={{ marginBottom: 20, display: 'inline-block' }}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Icon3D type={tab.type} />
                                </motion.div>

                                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 6 }}>
                                    {tab.title}
                                </h3>
                                <div style={{
                                    fontSize: 11, fontWeight: 700, color: '#800020',
                                    textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 18,
                                }}>
                                    {tab.short}
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>
                                    {tab.content}
                                </p>

                                {/* Stats */}
                                <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
                                    {tab.stats.map((s, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.08 }}
                                            style={{
                                                background: 'rgba(128,0,32,0.15)',
                                                border: '1px solid rgba(128,0,32,0.3)',
                                                borderRadius: 12, padding: '12px 18px',
                                                textAlign: 'center', minWidth: 80,
                                            }}
                                        >
                                            <div style={{ fontWeight: 900, color: '#fff', fontSize: 20, lineHeight: 1 }}>{s.val}</div>
                                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{s.label}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                <Link to={`${tab.to}#`} style={{ textDecoration: 'none' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 10,
                                            background: 'linear-gradient(135deg, #800020, #c0002a)',
                                            color: '#fff', fontWeight: 700, fontSize: 13,
                                            padding: '12px 28px', borderRadius: 50,
                                            boxShadow: '0 6px 22px rgba(128,0,32,0.4)',
                                            letterSpacing: '0.04em',
                                        }}
                                    >
                                        Register Now →
                                    </motion.div>
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WiceInfoSection;
