import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Competition data ─────────────────────────────── */
const CATEGORIES = [
    {
        id: '01',
        title: 'Invention & Innovation',
        subtitle: 'Create · Patent · Impact',
        description:
            'Present original inventions that solve real-world problems. Projects are judged on novelty, feasibility, and societal impact.',
        eligibility: 'All age groups',
        prize: 'Prize Pool: ৳2,00,000',
        fee: '৳999 Early Bird · ৳1,200 Default',
        icon: (
            <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
                <circle cx="24" cy="20" r="11" stroke="#800020" strokeWidth="2.2" />
                <path d="M19 31h10M21 35h6" stroke="#800020" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M24 9V6M34.2 13.8l2.1-2.1M13.8 13.8l-2.1-2.1" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="20" r="4" fill="rgba(128,0,32,0.25)" />
            </svg>
        ),
    },
    {
        id: '02',
        title: 'Surprise Segment',
        subtitle: 'Stay · Tuned · Soon',
        description:
            'Something exciting is coming. A brand-new competition segment will be revealed soon — stay tuned for the big announcement.',
        eligibility: 'To be announced',
        prize: 'To be announced',
        fee: 'To be announced',
        icon: (
            <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
                <circle cx="24" cy="24" r="16" stroke="#800020" strokeWidth="2.2" strokeDasharray="4 3" />
                <path d="M24 14v2M24 32v2M14 24h2M32 24h2" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="24" r="5" fill="rgba(128,0,32,0.25)" stroke="#800020" strokeWidth="1.8" />
                <path d="M24 21v3l2 2" stroke="#800020" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: '03',
        title: 'Science & Technology',
        subtitle: 'Research · Discover · Present',
        description:
            'Research-driven projects covering physics, chemistry, biology, and engineering. Demonstrate experiments and findings to expert judges.',
        eligibility: 'School · College · University',
        prize: 'Prize Pool: ৳30,000',
        fee: '৳399',
        icon: (
            <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
                <path d="M18 10v16l-8 12h20L22 26V10" stroke="#800020" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 10h4" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="33" r="2" fill="#800020" />
                <circle cx="26" cy="36" r="1.5" fill="rgba(128,0,32,0.6)" />
                <path d="M30 18a6 6 0 1 1 0-.01" stroke="#800020" strokeWidth="1.8" strokeDasharray="3 2" />
            </svg>
        ),
    },
    {
        id: '04',
        title: 'Creative Computing',
        subtitle: 'Design · Code · Launch',
        description:
            'Software applications, mobile apps, websites, and digital solutions that address community challenges or push creative boundaries.',
        eligibility: 'Open to all',
        prize: 'Prize Pool: ৳10,000',
        fee: '৳50',
        icon: (
            <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
                <rect x="6" y="10" width="36" height="24" rx="4" stroke="#800020" strokeWidth="2.2" />
                <path d="M16 22l-4 3 4 3M32 22l4 3-4 3" stroke="#800020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 28l4-10" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 38h12M24 34v4" stroke="#800020" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
];

/* ─── Animated SVG Robot ───────────────────────────── */
const Robot = () => (
    <svg viewBox="0 0 120 180" width="110" height="165" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line x1="60" y1="18" x2="60" y2="4" stroke="#800020" strokeWidth="2.5" strokeLinecap="round" />
        <motion.circle
            cx="60" cy="4" r="5"
            fill="#800020"
            animate={{ opacity: [1, 0.2, 1], r: [5, 7, 5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Head */}
        <rect x="30" y="18" width="60" height="46" rx="10" fill="#0f0f1a" stroke="#800020" strokeWidth="2" />

        {/* Eyes */}
        <motion.rect
            x="40" y="30" width="14" height="10" rx="3"
            fill="#800020"
            animate={{ scaleY: [1, 0.15, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.05, 0.1] }}
            style={{ originX: '47px', originY: '35px' }}
        />
        <motion.rect
            x="66" y="30" width="14" height="10" rx="3"
            fill="#800020"
            animate={{ scaleY: [1, 0.15, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.05, 0.1], delay: 0.08 }}
            style={{ originX: '73px', originY: '35px' }}
        />

        {/* Mouth / speaker grill */}
        {[0, 6, 12].map(x => (
            <line key={x} x1={48 + x} y1="52" x2={48 + x} y2="58"
                stroke="#800020" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        ))}

        {/* Neck */}
        <rect x="52" y="64" width="16" height="8" rx="3" fill="#800020" opacity="0.4" />

        {/* Body */}
        <rect x="20" y="72" width="80" height="58" rx="12" fill="#0f0f1a" stroke="#800020" strokeWidth="2" />

        {/* Chest panel */}
        <rect x="34" y="84" width="52" height="32" rx="7" fill="rgba(128,0,32,0.08)" stroke="rgba(128,0,32,0.4)" strokeWidth="1.4" />

        {/* Center circle pulse */}
        <motion.circle
            cx="60" cy="100" r="10"
            fill="rgba(128,0,32,0.15)"
            stroke="#800020"
            strokeWidth="1.6"
            animate={{ r: [10, 13, 10], opacity: [0.9, 0.4, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="60" cy="100" r="5" fill="#800020" opacity="0.8" />

        {/* Side dots */}
        {[-14, 14].map((dx, i) => (
            <motion.circle
                key={i} cx={60 + dx} cy="100" r="3"
                fill="#800020"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
            />
        ))}

        {/* Left arm */}
        <rect x="2" y="76" width="18" height="42" rx="8" fill="#0f0f1a" stroke="#800020" strokeWidth="1.8" />
        <motion.rect
            x="4" y="110" width="14" height="12" rx="5"
            fill="#800020" opacity="0.5"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity }}
        />

        {/* Right arm */}
        <rect x="100" y="76" width="18" height="42" rx="8" fill="#0f0f1a" stroke="#800020" strokeWidth="1.8" />
        <motion.rect
            x="102" y="110" width="14" height="12" rx="5"
            fill="#800020" opacity="0.5"
            animate={{ opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity }}
        />

        {/* Legs */}
        <rect x="33" y="130" width="22" height="36" rx="8" fill="#0f0f1a" stroke="#800020" strokeWidth="1.8" />
        <rect x="65" y="130" width="22" height="36" rx="8" fill="#0f0f1a" stroke="#800020" strokeWidth="1.8" />

        {/* Feet */}
        <rect x="29" y="158" width="30" height="10" rx="5" fill="#800020" opacity="0.5" />
        <rect x="61" y="158" width="30" height="10" rx="5" fill="#800020" opacity="0.5" />
    </svg>
);

/* ─── Tree connector SVG ───────────────────────────── */
const TreeConnectors = () => (
    <svg
        viewBox="0 0 900 120"
        width="100%"
        height="120"
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
    >
        {/* Vertical stem */}
        <motion.line
            x1="450" y1="0" x2="450" y2="50"
            stroke="#800020" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* Horizontal bar */}
        <motion.line
            x1="113" y1="50" x2="788" y2="50"
            stroke="#800020" strokeWidth="2" strokeLinecap="round"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.55 }}
            style={{ transformOrigin: '450px 50px' }}
        />
        {/* Drops to each card */}
        {[113, 338, 563, 788].map((x, i) => (
            <motion.line
                key={i}
                x1={x} y1="50" x2={x} y2="120"
                stroke="#800020" strokeWidth="2" strokeLinecap="round"
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.9 + i * 0.08 }}
                style={{ transformOrigin: `${x}px 50px` }}
            />
        ))}
        {/* Node circles on horizontal bar */}
        {[113, 338, 563, 788].map((x, i) => (
            <motion.circle
                key={i} cx={x} cy="50" r="5"
                fill="#800020"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1.1 + i * 0.08 }}
                style={{ transformOrigin: `${x}px 50px` }}
            />
        ))}
    </svg>
);

/* ─── Main section ─────────────────────────────────── */
const CompetitionCategories = () => {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: '-80px' });

    return (
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                background: 'linear-gradient(160deg, #06020e 0%, #0d000a 50%, #06020e 100%)',
                padding: '110px 0 100px',
                overflow: 'hidden',
            }}
        >
            {/* Grid texture */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(128,0,32,0.045) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(128,0,32,0.045) 1px, transparent 1px)
                `,
                backgroundSize: '52px 52px',
                maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 100%)',
            }} />

            {/* Ambient glow */}
            <div style={{
                position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
                width: '600px', height: '300px',
                background: 'radial-gradient(ellipse, rgba(128,0,32,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>

                {/* ── Section header ── */}
                <motion.div
                    className="text-center"
                    style={{ marginBottom: '56px' }}
                    initial={{ opacity: 0, y: -24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.24em',
                        fontWeight: 700, color: '#800020', marginBottom: '14px',
                    }}>
                        <motion.span
                            style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.6, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        Competition Categories
                        <motion.span
                            style={{ width: 32, height: 1, background: '#800020', display: 'inline-block' }}
                            animate={{ scaleX: [1, 1.6, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                    </span>
                    <h2 style={{
                        color: '#fff', fontWeight: 900,
                        fontSize: 'clamp(30px, 5vw, 46px)',
                        margin: 0, lineHeight: 1.15,
                    }}>
                        Four Arenas of<br />
                        <span style={{ color: '#800020' }}>Excellence</span>
                    </h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.42)', fontSize: '15px',
                        maxWidth: '520px', margin: '16px auto 0', lineHeight: 1.85,
                    }}>
                        WICE Bangladesh invites innovators across four distinct disciplines.
                        Find your battleground and compete for international recognition.
                    </p>
                </motion.div>

                {/* ── Robot ── */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <motion.div
                            animate={{ y: [0, -14, 0] }}
                            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ filter: 'drop-shadow(0 16px 40px rgba(128,0,32,0.4))' }}
                        >
                            <Robot />
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Tree connectors ── */}
                <TreeConnectors />

                {/* ── Category cards ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '18px',
                }}>
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
                            whileHover={{ y: -8 }}
                            style={{
                                position: 'relative',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(128,0,32,0.22)',
                                borderTop: '2px solid #800020',
                                borderRadius: '16px',
                                padding: '28px 22px',
                                cursor: 'default',
                                overflow: 'hidden',
                                transition: 'box-shadow 0.3s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 20px 56px rgba(128,0,32,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            {/* Corner glow */}
                            <div style={{
                                position: 'absolute', top: -20, right: -20,
                                width: 100, height: 100, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(128,0,32,0.12), transparent 70%)',
                                pointerEvents: 'none',
                            }} />

                            {/* ID badge */}
                            <div style={{
                                position: 'absolute', top: '18px', right: '18px',
                                fontSize: '11px', fontWeight: 800, color: 'rgba(128,0,32,0.5)',
                                letterSpacing: '0.12em', fontFamily: 'monospace',
                            }}>
                                {cat.id}
                            </div>

                            {/* Icon */}
                            <motion.div
                                style={{ marginBottom: '18px' }}
                                animate={{ rotate: [0, 4, -4, 0] }}
                                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                {cat.icon}
                            </motion.div>

                            {/* Title */}
                            <div style={{
                                fontWeight: 800, color: '#fff',
                                fontSize: '16px', lineHeight: 1.25,
                                marginBottom: '4px',
                            }}>
                                {cat.title}
                            </div>

                            {/* Subtitle */}
                            <div style={{
                                fontSize: '11px', fontWeight: 600, color: '#800020',
                                letterSpacing: '0.14em', textTransform: 'uppercase',
                                marginBottom: '14px',
                            }}>
                                {cat.subtitle}
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'rgba(128,0,32,0.18)', marginBottom: '14px' }} />

                            {/* Description */}
                            <p style={{
                                color: 'rgba(255,255,255,0.5)', fontSize: '13px',
                                lineHeight: 1.75, margin: '0 0 16px',
                            }}>
                                {cat.description}
                            </p>

                            {/* Meta rows */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                    { key: 'Who', val: cat.eligibility },
                                    { key: 'Win',  val: cat.prize },
                                    { key: 'Fee',  val: cat.fee },
                                ].map(({ key, val }) => val && (
                                    <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <span style={{ flexShrink: 0, fontSize: '10px', fontWeight: 700, color: '#800020', letterSpacing: '0.1em', textTransform: 'uppercase', paddingTop: '2px' }}>
                                            {key}
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: 1.5 }}>
                                            {val}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Bottom CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ textAlign: 'center', marginTop: '56px' }}
                >
                    <motion.a
                        href="/registration"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            background: 'linear-gradient(135deg, #800020, #c0002a)',
                            color: '#fff', fontWeight: 700, fontSize: '14px',
                            padding: '15px 38px', borderRadius: '50px',
                            boxShadow: '0 8px 28px rgba(128,0,32,0.45)',
                            textDecoration: 'none', letterSpacing: '0.05em',
                        }}
                    >
                        Register for Your Category →
                    </motion.a>
                </motion.div>

            </div>
        </section>
    );
};

export default CompetitionCategories;
