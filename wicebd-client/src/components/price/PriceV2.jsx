import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import PriceV2Data from '../../jsonData/price/PriceV2Data.json';
import SinglePriceV2 from './SinglePriceV2';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PERKS = [
    { icon: 'bi-door-open-fill',      label: 'Free Entry',           desc: 'Open to all visitors at no cost' },
    { icon: 'bi-trophy-fill',          label: 'Live Award Ceremony',   desc: 'Watch winners crowned in real time' },
    { icon: 'bi-lightbulb-fill',       label: 'Innovation Showcase',   desc: 'See 50+ live invention displays' },
    { icon: 'bi-camera-video-fill',    label: 'Cultural Program',      desc: 'Performances & cultural highlights' },
    { icon: 'bi-people-fill',          label: 'Networking',            desc: 'Meet innovators & fellow attendees' },
    { icon: 'bi-calendar-event-fill',  label: 'Date TBA',              desc: 'Venue will be announced soon' },
];

const PriceV2 = ({ pricingClass }) => {
    return (
        <motion.section
            className={`position-relative overflow-hidden ${pricingClass}`}
            style={{
                background: 'linear-gradient(160deg, #0d0006 0%, #1a000a 50%, #2a0010 100%)',
                padding: '110px 0 90px',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            {/* Photo overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=60')",
                backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06,
            }} />

            {/* Ambient orbs */}
            {[
                { w: 420, left: '-60px',  top: '10%',   color: 'rgba(128,0,32,0.2)' },
                { w: 320, left: '75%',    top: '-80px',  color: 'rgba(128,0,32,0.14)' },
                { w: 260, left: '45%',    top: '65%',    color: 'rgba(255,255,255,0.04)' },
            ].map((orb, i) => (
                <motion.div key={i} style={{
                    position: 'absolute', borderRadius: '50%',
                    width: orb.w, height: orb.w, left: orb.left, top: orb.top,
                    background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
                    filter: 'blur(55px)', pointerEvents: 'none',
                }}
                    animate={{ y: [0, 18, 0], x: [0, 10, 0] }}
                    transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}

            <Container style={{ position: 'relative', zIndex: 2 }}>
                {/* Header */}
                <motion.div className="text-center" style={{ marginBottom: '60px' }}
                    initial={{ y: -30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em',
                        fontWeight: 700, color: '#800020', marginBottom: '12px',
                    }}>
                        <i className="bi bi-ticket-perforated-fill"></i> Visitor Pass
                    </span>
                    <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '42px', margin: 0, lineHeight: 1.2 }}>
                        Attend WICEBD 2025
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginTop: '14px', maxWidth: '500px', margin: '14px auto 0', lineHeight: 1.75 }}>
                        Join us for the 8th edition — free for all visitors. Experience innovation live.
                    </p>
                </motion.div>

                <Row className="align-items-center g-5 justify-content-center">
                    {/* Left — Big pass card */}
                    <Col lg={5} md={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.65 }}
                            viewport={{ once: true }}
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderTop: '4px solid #800020',
                                borderRadius: '24px',
                                padding: '44px 40px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                                textAlign: 'center',
                            }}
                        >
                            {/* Ticket icon */}
                            <motion.div
                                style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: '88px', height: '88px', borderRadius: '22px',
                                    background: 'linear-gradient(135deg, #800020, #4f0014)',
                                    boxShadow: '0 8px 28px rgba(128,0,32,0.5)',
                                    marginBottom: '24px',
                                }}
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <i className="bi bi-ticket-perforated-fill" style={{ fontSize: '2.4rem', color: '#fff' }}></i>
                            </motion.div>

                            <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
                                Entry Pass
                            </div>
                            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '28px', marginBottom: '6px' }}>
                                Visitors Pass
                            </h3>

                            {/* FREE badge */}
                            <div style={{
                                display: 'inline-block', padding: '10px 32px',
                                background: 'linear-gradient(90deg, #800020, #c0002a)',
                                borderRadius: '50px', margin: '20px 0',
                                boxShadow: '0 6px 20px rgba(128,0,32,0.45)',
                            }}>
                                <span style={{ fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>FREE</span>
                            </div>

                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
                                No registration required. Simply show up on the event day — date and venue will be announced soon.
                            </p>

                            {/* CTA */}
                            <motion.a
                                href="/registration"
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    display: 'inline-block', padding: '14px 40px',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: '50px', color: '#fff',
                                    fontWeight: 600, fontSize: '14px',
                                    textDecoration: 'none', letterSpacing: '0.06em',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Collect Free Pass &rarr;
                            </motion.a>
                        </motion.div>
                    </Col>

                    {/* Right — perks grid */}
                    <Col lg={6} md={12}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {PERKS.map((perk, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(128,0,32,0.25)' }}
                                    style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        backdropFilter: 'blur(18px)',
                                        WebkitBackdropFilter: 'blur(18px)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '16px',
                                        padding: '22px 20px',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                        cursor: 'default',
                                    }}
                                >
                                    <i className={`bi ${perk.icon}`} style={{ fontSize: '1.6rem', color: '#800020', marginBottom: '10px', display: 'block' }}></i>
                                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{perk.label}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{perk.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </motion.section>
    );
};

export default PriceV2;