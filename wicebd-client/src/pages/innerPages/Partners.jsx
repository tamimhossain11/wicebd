import React from 'react';
import { motion } from 'framer-motion';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PARTNER_CATEGORIES = [
    {
        cat: 'Official Organizer',
        color: '#e94560',
        partners: [
            {
                name: 'Firm Fresh',
                icon: 'bi-building-fill',
                desc: 'The official organizing body of WICE Bangladesh, driving the vision of connecting Bangladeshi innovators to the world stage.',
                type: 'Prime Partner',
            },
            {
                name: 'Dhaka Imperial College',
                icon: 'bi-mortarboard-fill',
                desc: 'Host institution providing the venue and academic support for the national round of WICE Bangladesh.',
                type: 'Host Institution',
            },
        ],
    },
    {
        cat: 'International Bodies',
        color: '#0f3460',
        partners: [
            {
                name: 'IFIA',
                icon: 'bi-globe2',
                desc: "International Federation of Inventors' Associations \u2014 the global body that certifies and connects national invention competitions worldwide.",
                type: 'International Federation',
            },
            {
                name: 'SEGI University',
                icon: 'bi-award-fill',
                desc: 'Kuala Lumpur-based university that hosted WICE Bangladesh teams at the prestigious ITEX international invention expo.',
                type: 'Global Host',
            },
            {
                name: 'INPEX',
                icon: 'bi-stars',
                desc: 'One of the largest invention expositions in the USA, where WICE Bangladesh has been represented with distinction.',
                type: 'International Expo',
            },
            {
                name: 'iENA',
                icon: 'bi-trophy-fill',
                desc: 'International Trade Fair — Ideas, Inventions and New Products, held in Nuremberg, Germany — a key international platform for WICE teams.',
                type: 'European Expo',
            },
        ],
    },
    {
        cat: 'Government & Institutional',
        color: '#10b981',
        partners: [
            {
                name: 'Ministry of Education',
                icon: 'bi-bank',
                desc: 'Government of Bangladesh, Ministry of Education — providing strategic backing and recognition for student innovation competitions.',
                type: 'Government Body',
            },
            {
                name: 'Bangladesh Shishu Academy',
                icon: 'bi-people-fill',
                desc: 'National institution supporting youth development and creative talent across Bangladesh.',
                type: 'Youth Institution',
            },
        ],
    },
    {
        cat: 'Media Partners',
        color: '#f59e0b',
        partners: [
            {
                name: 'Channel i',
                icon: 'bi-camera-video-fill',
                desc: 'Leading Bangladeshi television channel providing exclusive broadcast coverage of WICE Bangladesh events and ceremonies.',
                type: 'TV Partner',
            },
            {
                name: 'Daily Prothom Alo',
                icon: 'bi-newspaper',
                desc: "Bangladesh's most-read national newspaper, covering WICE achievements and inspiring the next generation of innovators.",
                type: 'Print Media',
            },
            {
                name: 'The Daily Star',
                icon: 'bi-journal-text',
                desc: "English-language newspaper covering WICE Bangladesh's international achievements and competition results.",
                type: 'Print Media',
            },
            {
                name: 'BTV',
                icon: 'bi-display',
                desc: 'Bangladesh Television — national broadcaster providing coverage of WICE competitions and award ceremonies.',
                type: 'National TV',
            },
        ],
    },
];

const PartnerCard = ({ partner, color, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -8, boxShadow: `0 24px 56px ${color}20` }}
        style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${color}25`,
            borderTop: `3px solid ${color}`,
            borderRadius: '20px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            cursor: 'default',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        {/* Glow */}
        <div style={{
            position: 'absolute', top: -20, right: -20, width: 100, height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}20, transparent 70%)`,
            filter: 'blur(20px)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
                width: 56, height: 56, borderRadius: '14px', flexShrink: 0,
                background: `${color}18`, border: `1px solid ${color}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <i className={partner.icon} style={{ fontSize: '1.5rem', color: color }}></i>
            </div>
            <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '17px', marginBottom: '3px' }}>{partner.name}</div>
                <span style={{
                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.12em', color: color,
                    background: `${color}15`, border: `1px solid ${color}30`,
                    borderRadius: '50px', padding: '3px 10px',
                }}>
                    {partner.type}
                </span>
            </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.75, margin: 0 }}>
            {partner.desc}
        </p>
    </motion.div>
);

const Partners = () => (
    <>
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" parentMenu="partners" />

            {/* Hero */}
            <section style={{
                position: 'relative',
                background: 'linear-gradient(160deg, #04000a 0%, #0d0018 60%, #04000a 100%)',
                padding: '140px 0 90px',
                overflow: 'hidden',
            }}>
                {/* Grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: `
                        linear-gradient(rgba(128,0,32,0.07) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(128,0,32,0.07) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)',
                }} />
                <motion.div
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600, height: 600, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(128,0,32,0.14), transparent 70%)',
                        filter: 'blur(80px)', pointerEvents: 'none',
                    }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.22em',
                            fontWeight: 700, color: '#800020', marginBottom: '20px',
                        }}>
                            <span style={{ width: 28, height: 1, background: '#800020', display: 'inline-block' }} />
                            WICE Bangladesh
                            <span style={{ width: 28, height: 1, background: '#800020', display: 'inline-block' }} />
                        </span>
                        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(36px, 6vw, 64px)', margin: '0 0 20px', lineHeight: 1.1 }}>
                            Our Partners &<br /><span style={{ color: '#800020' }}>Sponsors</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
                            WICE Bangladesh is proudly supported by leading organisations, government institutions, international bodies, and media partners who share our vision of empowering Bangladeshi innovation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Partner categories */}
            <section style={{
                background: 'linear-gradient(180deg, #04000a 0%, #080010 100%)',
                padding: '80px 0 100px',
            }}>
                <div className="auto-container">
                    {PARTNER_CATEGORIES.map((cat, ci) => (
                        <div key={ci} style={{ marginBottom: '80px' }}>
                            {/* Category header */}
                            <motion.div
                                style={{ marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '16px' }}
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <div style={{ width: 4, height: 36, background: cat.color, borderRadius: '2px', flexShrink: 0 }} />
                                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '24px', margin: 0 }}>{cat.cat}</h3>
                                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${cat.color}30, transparent)` }} />
                            </motion.div>

                            {/* Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '20px',
                            }}>
                                {cat.partners.map((p, pi) => (
                                    <PartnerCard key={pi} partner={p} color={cat.color} index={pi} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Become a partner CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            textAlign: 'center',
                            background: 'rgba(128,0,32,0.1)',
                            border: '1px solid rgba(128,0,32,0.3)',
                            borderRadius: '24px',
                            padding: '60px 40px',
                        }}
                    >
                        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '28px', marginBottom: '12px' }}>
                            Become a Partner
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.75 }}>
                            Join the WICE Bangladesh family and support the next generation of Bangladeshi innovators. Partnership opportunities are open for organisations of all sizes.
                        </p>
                        <motion.a
                            href="/contact"
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                background: 'linear-gradient(135deg, #800020, #c0002a)',
                                color: '#fff', fontWeight: 700, fontSize: '15px',
                                padding: '16px 40px', borderRadius: '50px', textDecoration: 'none',
                                boxShadow: '0 8px 28px rgba(128,0,32,0.4)',
                            }}
                        >
                            Get in Touch →
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            <FooterV2 />
        </div>
    </>
);

export default Partners;
