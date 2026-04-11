import React from 'react';
import { motion } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

/* ── Unsplash images ── */
const IMGS = {
    hero:       'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=75',
    mission:    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
    awards:     'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=900&q=80',
    science:    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80',
    students:   'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80',
    innovation: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80',
    team:       'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80',
};

/* ── Animation variants ── */
const fadeUp   = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const fadeLeft = { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.65 } } };
const fadeRight= { hidden: { opacity: 0, x:  40 }, show: { opacity: 1, x: 0, transition: { duration: 0.65 } } };

/* ── Shared glass card styles ── */
const glassCard = {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.11)',
    borderRadius: 20,
    boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
};

const lightCard = {
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.95)',
    borderRadius: 20,
    boxShadow: '0 10px 32px rgba(0,0,0,0.09)',
};

/* ── Sub-components ── */
const Kicker = ({ text, dark }) => (
    <span style={{
        display: 'inline-block', fontSize: 11, textTransform: 'uppercase',
        letterSpacing: '0.22em', fontWeight: 700,
        color: dark ? '#800020' : '#e87a96',
        marginBottom: 12,
    }}>{text}</span>
);

const Orb = ({ style }) => (
    <div style={{
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(128,0,32,0.22), transparent 70%)',
        filter: 'blur(55px)', ...style,
    }} />
);

/* ═══════════════════════════════════════════
   STATS DATA
═══════════════════════════════════════════ */
const STATS = [
    { num: '8th',  label: 'Edition',           icon: 'fa-calendar-star' },
    { num: '14',   label: 'Gold Medals',        icon: 'fa-medal' },
    { num: '3',    label: 'Silver Medals',      icon: 'fa-award' },
    { num: '5+',   label: 'Special Awards',     icon: 'fa-trophy' },
    { num: '4',    label: 'Level Categories',   icon: 'fa-layer-group' },
    { num: '100+', label: 'Teams Participated', icon: 'fa-users' },
];

/* ── MISSION PILLARS ── */
const PILLARS = [
    {
        icon: 'fa-lightbulb',
        title: 'Foster Innovation',
        text: 'Encouraging students from every level to think beyond textbooks and build solutions that matter.',
    },
    {
        icon: 'fa-globe-asia',
        title: 'Global Representation',
        text: 'Top teams earn the right to carry the Bangladeshi flag to the international WICE stage in Malaysia.',
    },
    {
        icon: 'fa-handshake',
        title: 'International Collaboration',
        text: 'Organised in partnership with the Indonesian Young Scientist Association (IYSA), bridging nations through science.',
    },
];

/* ── TIMELINE ── */
const TIMELINE = [
    { year: '2018', edition: '1st WICEBD', note: "Bangladesh's debut in the global invention stage." },
    { year: '2019', edition: '2nd WICEBD', note: 'Growing participation across school and college levels.' },
    { year: '2021', edition: '4th WICEBD', note: 'First Gold Medal win — a landmark achievement.' },
    { year: '2022', edition: '5th WICEBD', note: 'Best Country Representative Award earned by Bangladesh.' },
    { year: '2023', edition: '6th WICEBD', note: 'Record number of teams; consecutive Gold Medal wins.' },
    { year: '2025', edition: '7th WICEBD', note: '14 Gold, 3 Silver & 5+ Special Awards at SEGI University, Malaysia.' },
    { year: '2026', edition: '8th WICEBD', note: 'National Round by Dreams of Bangladesh; International Round at SEGI University, Malaysia.', current: true },
];

/* ── CATEGORIES ── */
const CATS = [
    { icon: 'fa-school',      label: 'Elementary',  sub: 'Class 1 – 5' },
    { icon: 'fa-book-open',   label: 'High School',  sub: 'Class 6 – 10' },
    { icon: 'fa-university',  label: 'College',      sub: 'Class 11 – 12' },
    { icon: 'fa-graduation-cap', label: 'University', sub: 'Undergraduate & above' },
];


/* ═══════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════ */
const AboutUs = () => (
    <div className="page-wrapper">
        <span className="header-span" />
        <HeaderV1 headerStyle="header-style-two" parentMenu="about" />

        {/* ══════════════════════════════════
            1. HERO
        ══════════════════════════════════ */}
        <section className="wice-inner-hero" style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            {/* BG image */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${IMGS.hero})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            {/* Dark overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(5,0,3,0.88) 0%,rgba(80,0,20,0.75) 55%,rgba(5,0,3,0.82) 100%)' }} />

            <Orb style={{ width: 500, height: 500, top: -100, left: -80 }} />
            <Orb style={{ width: 320, height: 320, bottom: -60, right: '12%' }} />

            <div className="auto-container wice-inner-hero-container" style={{ position: 'relative', zIndex: 2 }}>
                <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ maxWidth: 740 }}>
                    <Kicker text="Dreams of Bangladesh Presents" />
                    <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(38px,6vw,72px)', lineHeight: 1.1, margin: '0 0 24px' }}>
                        World Invention<br />
                        <span style={{ background: 'linear-gradient(135deg,#fff 0%,#ffb8c8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Competition &amp; Exhibition
                        </span><br />
                        Bangladesh
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.85, maxWidth: 580, marginBottom: 38 }}>
                        The 8th edition of WICEBD — empowering Bangladesh's brightest young innovators
                        to compete on the global stage, in partnership with the Indonesian Young Scientist Association.
                    </p>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        <Link to="/registration#">
                            <motion.span whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
                                display: 'inline-block', padding: '14px 36px', borderRadius: 50,
                                background: 'linear-gradient(135deg,#800020,#c0002a)',
                                color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                                boxShadow: '0 8px 24px rgba(128,0,32,0.5)',
                                letterSpacing: '0.04em', cursor: 'pointer',
                            }}>Register Now</motion.span>
                        </Link>
                        <Link to="/contact#">
                            <motion.span whileHover={{ y: -2 }} style={{
                                display: 'inline-block', padding: '14px 36px', borderRadius: 50,
                                border: '1px solid rgba(255,255,255,0.22)',
                                background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
                                color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
                                letterSpacing: '0.04em', cursor: 'pointer',
                            }}>Contact Us</motion.span>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{
                    position: 'absolute', bottom: 60, right: 80, zIndex: 2,
                    ...glassCard, padding: '20px 28px', textAlign: 'center',
                    borderTop: '3px solid #800020',
                }}
            >
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>8th</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>Edition · 2025</div>
            </motion.div>
        </section>

        {/* ══════════════════════════════════
            2. WHO WE ARE
        ══════════════════════════════════ */}
        <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 60%,#2a0010 100%)', padding: '110px 0', overflow: 'hidden', position: 'relative' }}>
            <Orb style={{ width: 400, height: 400, top: -80, right: -60 }} />

            <div className="auto-container">
                <div className="row align-items-center g-5">
                    {/* Left — images collage */}
                    <div className="col-lg-5 col-md-12">
                        <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={{ once: true }}
                            style={{ position: 'relative' }}>
                            <img src={IMGS.mission} alt="WICEBD students" style={{
                                width: '100%', height: 420, objectFit: 'cover', borderRadius: 20,
                                boxShadow: '0 20px 56px rgba(0,0,0,0.5)',
                            }} />
                            {/* Floating card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}
                                style={{
                                    position: 'absolute', bottom: -28, right: -28,
                                    ...glassCard, padding: '18px 24px',
                                    borderLeft: '3px solid #800020',
                                }}
                            >
                                <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>2018 –</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>Established in Bangladesh</div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right — text */}
                    <div className="col-lg-7 col-md-12">
                        <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={{ once: true }}>
                            <Kicker text="Who We Are" />
                            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 40, margin: '0 0 20px', lineHeight: 1.2 }}>
                                Dreams of Bangladesh —<br />
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, fontSize: 34 }}>Building Tomorrow's Innovators</span>
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.85, marginBottom: 20 }}>
                                <strong style={{ color: '#fff' }}>Dreams of Bangladesh (DOB)</strong> is the organizing body behind WICEBD —
                                the Bangladesh national round of the World Invention Competition & Exhibition. Founded on the belief
                                that every young mind deserves a stage, DOB brings together students from elementary school
                                to university to showcase their most innovative projects.
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.85, marginBottom: 32 }}>
                                In partnership with the <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Indonesian Young Scientist Association (IYSA)</strong>,
                                we run a rigorous national selection process — the top teams go on to represent Bangladesh
                                at the international WICE expo, where they compete against the best young inventors from around the world.
                            </p>

                            {/* Highlights */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    'Open to Elementary, High School, College & University students',
                                    'Projects in Science, Technology, Social Science & Engineering',
                                    'Winners represent Bangladesh at WICE International',
                                    'Best Country Representative Award — 2022',
                                ].map((pt, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }}
                                        style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                                    >
                                        <span style={{
                                            flexShrink: 0, width: 20, height: 20, borderRadius: '50%', marginTop: 2,
                                            background: 'linear-gradient(135deg,#800020,#c0002a)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 10, color: '#fff',
                                        }}>✓</span>
                                        <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.6 }}>{pt}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>

        {/* ══════════════════════════════════
            3. STATS STRIP
        ══════════════════════════════════ */}
        <section style={{ background: '#0a0006', padding: '72px 0', borderTop: '1px solid rgba(128,0,32,0.2)', borderBottom: '1px solid rgba(128,0,32,0.2)' }}>
            <div className="auto-container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 24 }}>
                    {STATS.map((s, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                            style={{ textAlign: 'center', padding: '28px 16px', ...glassCard, borderTop: '3px solid #800020' }}
                        >
                            <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6,
                                background: 'linear-gradient(135deg,#fff,#ffccd8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>{s.num}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* ══════════════════════════════════
            4. MISSION PILLARS
        ══════════════════════════════════ */}
        <section style={{ background: 'linear-gradient(160deg,#f7f4fa 0%,#fdf0f4 50%,#f7f4fa 100%)', padding: '110px 0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.07),transparent 70%)', top: -120, right: -80, filter: 'blur(50px)', pointerEvents: 'none' }} />

            <div className="auto-container">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 60 }}>
                    <Kicker text="Our Mission" dark />
                    <h2 style={{ color: '#111', fontWeight: 800, fontSize: 40, margin: 0 }}>What Drives Us</h2>
                    <p style={{ color: '#777', fontSize: 15, maxWidth: 480, margin: '14px auto 0', lineHeight: 1.8 }}>
                        Three core pillars that shape everything we do at WICEBD.
                    </p>
                </motion.div>

                <div className="row g-4">
                    {PILLARS.map((p, i) => (
                        <div key={i} className="col-lg-4 col-md-6">
                            <motion.div
                                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.55 }}
                                whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(128,0,32,0.16)' }}
                                style={{ ...lightCard, padding: '36px 32px', height: '100%', borderTop: '4px solid #800020', transition: 'box-shadow 0.3s ease, transform 0.3s ease', cursor: 'default' }}
                            >
                                <div style={{
                                    width: 56, height: 56, borderRadius: 16, marginBottom: 22,
                                    background: 'linear-gradient(135deg,#800020,#4f0014)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 6px 20px rgba(128,0,32,0.35)',
                                }}>
                                    <i className={`fa ${p.icon}`} style={{ color: '#fff', fontSize: 20 }} />
                                </div>
                                <h4 style={{ color: '#111', fontWeight: 700, fontSize: 19, marginBottom: 12 }}>{p.title}</h4>
                                <p style={{ color: '#666', fontSize: 15, lineHeight: 1.75, margin: 0 }}>{p.text}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ══════════════════════════════════
            5. ACHIEVEMENT IMAGE BANNER
        ══════════════════════════════════ */}
        <section style={{ position: 'relative', padding: '110px 0', overflow: 'hidden', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 60%,#2a0010 100%)' }}>
            <Orb style={{ width: 500, height: 500, bottom: -100, left: -80 }} />

            <div className="auto-container">
                <div className="row align-items-center g-5">
                    {/* Text left */}
                    <div className="col-lg-6 col-md-12">
                        <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={{ once: true }}>
                            <Kicker text="Our Achievements" />
                            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 40, margin: '0 0 20px', lineHeight: 1.2 }}>
                                Bringing Home Gold<br />
                                <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400, fontSize: 32 }}>From the International Stage</span>
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.85, marginBottom: 32 }}>
                                At the 7th WICE International held at SEGI University, Kuala Lumpur, Bangladesh's
                                teams delivered a historic performance — winning <strong style={{ color: '#fff' }}>14 Gold Medals</strong>,&nbsp;
                                <strong style={{ color: '#fff' }}>3 Silver Medals</strong>, and&nbsp;
                                <strong style={{ color: '#fff' }}>5+ Special Awards</strong>. Our teams also led the national anthem at
                                the prize ceremony — a proud moment for the whole nation.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { n: '14', l: 'Gold Medals' },
                                    { n: '3',  l: 'Silver Medals' },
                                    { n: '5+', l: 'Special Awards' },
                                    { n: '1',  l: 'Best Country Award' },
                                ].map((item, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
                                        style={{ ...glassCard, padding: '20px', borderLeft: '3px solid #800020', borderRadius: 14 }}
                                    >
                                        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{item.n}</div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginTop: 2 }}>{item.l}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Images right */}
                    <div className="col-lg-6 col-md-12">
                        <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={{ once: true }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
                        >
                            {[IMGS.awards, IMGS.science, IMGS.students, IMGS.team].map((src, i) => (
                                <motion.div key={i}
                                    whileHover={{ scale: 1.03 }}
                                    style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.4)', aspectRatio: '1/1' }}
                                >
                                    <img src={src} alt="WICEBD achievement" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>

        {/* ══════════════════════════════════
            6. TIMELINE
        ══════════════════════════════════ */}
        <section style={{ background: 'linear-gradient(160deg,#f7f4fa 0%,#fdf0f4 50%,#f7f4fa 100%)', padding: '110px 0', position: 'relative', overflow: 'hidden' }}>
            <div className="auto-container">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
                    <Kicker text="Our Journey" dark />
                    <h2 style={{ color: '#111', fontWeight: 800, fontSize: 40, margin: 0 }}>Edition by Edition</h2>
                    <p style={{ color: '#777', fontSize: 15, maxWidth: 440, margin: '14px auto 0', lineHeight: 1.8 }}>
                        From our debut to becoming a gold-medal powerhouse — the WICEBD story.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div style={{ position: 'relative', maxWidth: 780, margin: '0 auto' }}>
                    {/* Vertical line */}
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(128,0,32,0.15)', transform: 'translateX(-50%)' }} />

                    {TIMELINE.map((item, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <motion.div key={i}
                                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: isLeft ? 'flex-start' : 'flex-end',
                                    marginBottom: 28,
                                    position: 'relative',
                                }}
                            >
                                {/* Dot */}
                                <div style={{
                                    position: 'absolute', left: '50%', top: 22, transform: 'translate(-50%,-50%)',
                                    width: item.current ? 16 : 12, height: item.current ? 16 : 12, borderRadius: '50%',
                                    background: item.current ? '#800020' : '#c0002a',
                                    boxShadow: item.current ? '0 0 0 4px rgba(128,0,32,0.2)' : 'none',
                                    zIndex: 2,
                                }} />

                                <div style={{ width: '44%', ...lightCard, padding: '20px 24px', borderLeft: item.current ? '4px solid #800020' : '3px solid rgba(128,0,32,0.25)' }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#800020', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{item.year}</div>
                                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 6 }}>{item.edition}</div>
                                    <div style={{ fontSize: 13, color: '#777', lineHeight: 1.65 }}>{item.note}</div>
                                    {item.current && (
                                        <div style={{ marginTop: 10, display: 'inline-block', padding: '3px 12px', borderRadius: 50, background: '#800020', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                            Upcoming
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>

        {/* ══════════════════════════════════
            7. PARTICIPATION CATEGORIES
        ══════════════════════════════════ */}
        <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 60%,#2a0010 100%)', padding: '110px 0', position: 'relative', overflow: 'hidden' }}>
            <Orb style={{ width: 450, height: 450, top: -60, right: -60 }} />

            <div className="auto-container">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
                    <Kicker text="Who Can Join" />
                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 40, margin: 0 }}>Open to All Levels</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 440, margin: '14px auto 0', lineHeight: 1.8 }}>
                        WICEBD welcomes participants from every stage of education.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20 }}>
                    {CATS.map((c, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(128,0,32,0.3)' }}
                            style={{ ...glassCard, padding: '36px 24px', textAlign: 'center', borderTop: '3px solid #800020', transition: 'box-shadow 0.3s ease, transform 0.3s ease', cursor: 'default' }}
                        >
                            <div style={{
                                width: 60, height: 60, borderRadius: 16, margin: '0 auto 18px',
                                background: 'linear-gradient(135deg,#800020,#4f0014)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 6px 20px rgba(128,0,32,0.4)',
                            }}>
                                <i className={`fa ${c.icon}`} style={{ color: '#fff', fontSize: 22 }} />
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 6 }}>{c.label}</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{c.sub}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* ══════════════════════════════════
            8. IYSA PARTNERSHIP
        ══════════════════════════════════ */}
        <section style={{ background: 'linear-gradient(160deg,#f7f4fa 0%,#fdf0f4 50%,#f7f4fa 100%)', padding: '110px 0', position: 'relative', overflow: 'hidden' }}>
            <div className="auto-container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6 col-md-12">
                        <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={{ once: true }}>
                            <img src={IMGS.innovation} alt="IYSA Partnership" style={{
                                width: '100%', height: 420, objectFit: 'cover', borderRadius: 20,
                                boxShadow: '0 20px 52px rgba(0,0,0,0.14)',
                            }} />
                        </motion.div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={{ once: true }}>
                            <Kicker text="International Partner" dark />
                            <h2 style={{ color: '#111', fontWeight: 800, fontSize: 38, margin: '0 0 18px', lineHeight: 1.2 }}>
                                In Partnership with IYSA
                            </h2>
                            <p style={{ color: '#555', fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
                                The <strong>Indonesian Young Scientist Association (IYSA)</strong> is the global organizer of
                                the World Invention Competition & Exhibition (WICE). Founded to advance youth science
                                and innovation globally, IYSA brings together nations to compete and collaborate.
                            </p>
                            <p style={{ color: '#666', fontSize: 15, lineHeight: 1.85, marginBottom: 32 }}>
                                Dreams of Bangladesh serves as the official national partner for Bangladesh, selecting
                                and preparing teams to compete at the highest international level — and bring home the gold.
                            </p>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {['Global reach', 'Official certification', 'International exposure', 'STEM excellence'].map((tag, i) => (
                                    <span key={i} style={{
                                        padding: '7px 18px', borderRadius: 50, border: '1px solid rgba(128,0,32,0.25)',
                                        background: 'rgba(128,0,32,0.06)', color: '#800020', fontSize: 13, fontWeight: 600,
                                    }}>{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>

        {/* ══════════════════════════════════
            9. CTA
        ══════════════════════════════════ */}
        <section style={{ position: 'relative', padding: '110px 0', overflow: 'hidden', background: 'linear-gradient(135deg,#0d0006 0%,#2a0010 50%,#0d0006 100%)' }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${IMGS.hero})`,
                backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08,
            }} />
            <Orb style={{ width: 600, height: 600, top: -150, left: -100 }} />
            <Orb style={{ width: 400, height: 400, bottom: -80, right: -60 }} />

            <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <Kicker text="Join WICEBD 2025" />
                    <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(32px,5vw,56px)', margin: '0 0 20px', lineHeight: 1.15 }}>
                        Ready to Innovate?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.85 }}>
                        Register your project or join the Science Olympiad. Represent Bangladesh.
                        Make your mark on the global stage.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <Link to="/registration#">
                            <motion.span whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{
                                display: 'inline-block', padding: '16px 44px', borderRadius: 50,
                                background: 'linear-gradient(135deg,#800020,#c0002a)',
                                color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none',
                                boxShadow: '0 10px 32px rgba(128,0,32,0.55)', letterSpacing: '0.04em', cursor: 'pointer',
                            }}>Register Now →</motion.span>
                        </Link>
                        <Link to="/contact#">
                            <motion.span whileHover={{ y: -2 }} style={{
                                display: 'inline-block', padding: '16px 44px', borderRadius: 50,
                                border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(12px)', color: '#fff', fontWeight: 600, fontSize: 15,
                                textDecoration: 'none', cursor: 'pointer',
                            }}>Contact Us</motion.span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>

        <FooterV2 />
    </div>
);

export default AboutUs;
