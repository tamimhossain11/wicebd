import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';

const CARDS = [
    {
        id: 0,
        title: 'What is WICE?',
        short: 'World Invention Competition & Exhibition',
        icon: '🌏',
        color: '#e94560',
        content: 'WICE Bangladesh is the national chapter of the World Invention Competition & Exhibition — a prestigious platform connecting Bangladeshi student innovators with the international science community.',
        stats: [{ label: 'Edition', val: '8th' }, { label: 'Founded', val: '2016' }, { label: 'Country', val: 'Bangladesh' }],
    },
    {
        id: 1,
        title: 'Project Competition',
        short: 'Innovation meets real-world impact',
        icon: '💡',
        color: '#f59e0b',
        content: 'Teams of up to 3 members design and present invention projects. Judged on novelty, feasibility, and societal impact. Top teams represent Bangladesh internationally.',
        stats: [{ label: 'Team Size', val: 'Up to 3' }, { label: 'Fee', val: '620 BDT' }, { label: 'Award', val: 'Gold/Silver' }],
    },
    {
        id: 2,
        title: 'Science Olympiad',
        short: 'Test your knowledge and logic',
        icon: '🏆',
        color: '#0f3460',
        content: 'Individual competition testing science, mathematics, and engineering knowledge. Multiple rounds with increasing difficulty — from MCQ to open-ended problems.',
        stats: [{ label: 'Format', val: 'Individual' }, { label: 'Rounds', val: '3 Stages' }, { label: 'Levels', val: 'School & College' }],
    },
    {
        id: 3,
        title: 'Robo Soccer',
        short: 'Engineer, program, and compete',
        icon: '🤖',
        color: '#10b981',
        content: 'Teams build autonomous soccer-playing robots from scratch. Competing in a tournament bracket, teams must master electronics, coding, and mechanical design simultaneously.',
        stats: [{ label: 'Team', val: 'Up to 4' }, { label: 'Format', val: 'Tournament' }, { label: 'Skills', val: 'Code + Build' }],
    },
];

/* Floating 3D card */
const InfoCard = ({ card, isActive, onClick, index }) => (
    <motion.div
        onClick={onClick}
        initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, rotateY: -15 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -8, rotateY: 4, scale: 1.02 }}
        style={{
            perspective: 800,
            cursor: 'pointer',
            background: isActive
                ? `linear-gradient(135deg, ${card.color}28, ${card.color}10)`
                : 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${isActive ? card.color + '60' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '22px',
            padding: '28px 24px',
            transition: 'all 0.35s ease',
            boxShadow: isActive ? `0 20px 60px ${card.color}25` : '0 8px 30px rgba(0,0,0,0.3)',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div
                animate={isActive ? { rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    fontSize: '2.2rem', width: 60, height: 60,
                    borderRadius: '16px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: `${card.color}20`,
                    border: `1px solid ${card.color}40`,
                    flexShrink: 0,
                }}
            >
                {card.icon}
            </motion.div>
            <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '16px', marginBottom: '2px' }}>{card.title}</div>
                <div style={{ fontSize: '12px', color: isActive ? card.color : 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{card.short}</div>
            </div>
        </div>
    </motion.div>
);

const WiceInfoSection = () => {
    const [active, setActive] = useState(0);
    const card = CARDS[active];

    return (
        <section style={{
            position: 'relative',
            background: 'linear-gradient(160deg, #06020e 0%, #0d0018 50%, #06020e 100%)',
            padding: '110px 0 100px',
            overflow: 'hidden',
        }}>
            {/* Grid overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(128,0,32,0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(128,0,32,0.06) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
            }} />

            {/* Rotating halo */}
            <motion.div
                style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700, height: 700, borderRadius: '50%',
                    border: '1px solid rgba(128,0,32,0.1)',
                    pointerEvents: 'none',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
                {[0, 90, 180, 270].map(deg => (
                    <div key={deg} style={{
                        position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                        background: '#800020', top: '50%', left: '50%',
                        transform: `rotate(${deg}deg) translateX(350px) translate(-50%, -50%)`,
                        boxShadow: '0 0 12px #800020',
                    }} />
                ))}
            </motion.div>

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>
                {/* Section header */}
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
                        Discover WICE
                        <span style={{ width: 28, height: 1, background: '#800020', display: 'inline-block' }} />
                    </span>
                    <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '42px', margin: 0, lineHeight: 1.2 }}>
                        Everything About <span style={{ color: '#800020' }}>WICE Bangladesh</span>
                    </h2>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>

                    {/* Left — card list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {CARDS.map((c, i) => (
                            <InfoCard key={c.id} card={c} isActive={active === i} onClick={() => setActive(i)} index={i} />
                        ))}
                    </div>

                    {/* Right — detail panel */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, x: 40, rotateY: -12 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                perspective: 1000,
                                background: `linear-gradient(135deg, ${card.color}15, rgba(255,255,255,0.03))`,
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                border: `1px solid ${card.color}40`,
                                borderRadius: '28px',
                                padding: '48px 44px',
                                boxShadow: `0 32px 80px ${card.color}20, 0 0 0 1px rgba(255,255,255,0.04)`,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Corner decoration */}
                            <svg style={{ position: 'absolute', top: 20, right: 20, opacity: 0.15 }} width="80" height="80" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="38" stroke={card.color} strokeWidth="1" fill="none" strokeDasharray="8 5" />
                                <circle cx="40" cy="40" r="24" stroke={card.color} strokeWidth="1" fill="none" />
                            </svg>

                            <motion.div
                                style={{ fontSize: '3.5rem', marginBottom: '20px', display: 'inline-block' }}
                                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                {card.icon}
                            </motion.div>

                            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '26px', marginBottom: '8px' }}>
                                {card.title}
                            </h3>
                            <div style={{ fontSize: '13px', color: card.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
                                {card.short}
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
                                {card.content}
                            </p>

                            {/* Stats row */}
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '36px', flexWrap: 'wrap' }}>
                                {card.stats.map((s, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            background: `${card.color}18`,
                                            border: `1px solid ${card.color}30`,
                                            borderRadius: '12px',
                                            padding: '12px 20px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div style={{ fontWeight: 800, color: card.color, fontSize: '20px' }}>{s.val}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <Link to="/registration#" style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                                        background: `linear-gradient(135deg, ${card.color}, ${card.color}bb)`,
                                        color: '#fff', fontWeight: 700, fontSize: '14px',
                                        padding: '14px 32px', borderRadius: '50px',
                                        boxShadow: `0 8px 24px ${card.color}40`,
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
        </section>
    );
};

export default WiceInfoSection;
