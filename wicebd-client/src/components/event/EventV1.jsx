import React from 'react';
import { motion } from 'framer-motion';

const INFO_CARDS = [
    {
        icon: 'far fa-calendar-alt',
        label: 'Date & Time',
        value: 'To Be Announced',
        sub: 'Stay tuned for the official date',
        color: '#800020',
    },
    {
        icon: 'fa fa-map-marker-alt',
        label: 'Venue',
        value: 'To Be Announced',
        sub: 'Venue details will be shared soon',
        color: '#800020',
    },
    {
        icon: 'icon_profile',
        label: 'Contact Person',
        value: 'Sayed Sorower Zahan',
        sub: '01741121067',
        color: '#800020',
        isPhone: true,
    },
    {
        icon: 'icon_mail',
        label: 'Email',
        value: 'support@WICEBD.com',
        sub: 'We reply within 24 hours',
        color: '#800020',
        isEmail: true,
    },
];

const EventV1 = () => {
    return (
        <section style={{
            position: 'relative',
            padding: '110px 0 90px',
            background: 'linear-gradient(160deg, #f7f4fa 0%, #fdf0f4 50%, #f7f4fa 100%)',
            overflow: 'hidden',
        }}>
            {/* Subtle decorative orb */}
            <div style={{
                position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(128,0,32,0.07), transparent 70%)',
                top: '-120px', right: '-120px', filter: 'blur(60px)', pointerEvents: 'none',
            }} />

            <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>
                {/* Header */}
                <motion.div className="text-center" style={{ marginBottom: '56px' }}
                    initial={{ opacity: 0, y: -24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                >
                    <span style={{
                        display: 'inline-block', fontSize: '12px', textTransform: 'uppercase',
                        letterSpacing: '0.2em', fontWeight: 700, color: '#800020', marginBottom: '12px',
                    }}>Find Us</span>
                    <h2 style={{ color: '#111', fontWeight: 700, fontSize: '40px', margin: 0 }}>Reach Us</h2>
                    <p style={{ color: '#777', fontSize: '15px', maxWidth: '460px', margin: '12px auto 0', lineHeight: 1.75 }}>
                        Everything you need to find us and get in touch before the big day.
                    </p>
                </motion.div>

                <div className="row align-items-start g-4">
                    {/* Left — info cards */}
                    <div className="col-lg-5 col-md-12">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {INFO_CARDS.map((card, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ x: 4 }}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '18px',
                                        background: 'rgba(255,255,255,0.82)',
                                        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
                                        border: '1px solid rgba(255,255,255,0.95)',
                                        borderLeft: '4px solid #800020',
                                        borderRadius: '16px', padding: '20px 22px',
                                        boxShadow: '0 8px 28px rgba(0,0,0,0.07)',
                                        cursor: 'default',
                                    }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        flexShrink: 0, width: '46px', height: '46px',
                                        borderRadius: '12px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #800020, #4f0014)',
                                        boxShadow: '0 4px 14px rgba(128,0,32,0.35)',
                                    }}>
                                        <span className={card.icon} style={{ color: '#fff', fontSize: '16px' }}></span>
                                    </div>
                                    {/* Text */}
                                    <div>
                                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', fontWeight: 600, marginBottom: '3px' }}>
                                            {card.label}
                                        </div>
                                        <div style={{ fontWeight: 700, color: '#111', fontSize: '15px', marginBottom: '2px' }}>
                                            {card.value}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>
                                            {card.isPhone
                                                ? <a href={`tel:${card.sub}`} style={{ color: '#800020', textDecoration: 'none' }}>{card.sub}</a>
                                                : card.isEmail
                                                    ? <a href={`mailto:${card.sub}`} style={{ color: '#800020', textDecoration: 'none' }}>{card.sub}</a>
                                                    : card.sub
                                            }
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Map */}
                    <div className="col-lg-7 col-md-12">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65 }}
                            style={{
                                borderRadius: '22px', overflow: 'hidden',
                                boxShadow: '0 20px 56px rgba(0,0,0,0.14)',
                                border: '3px solid rgba(255,255,255,0.9)',
                            }}
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.4736507689086!2d90.42992319999999!3d23.7661421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c78b1976ae3d%3A0xbdb6014c6a90b76c!2sDhaka%20Imperial%20College!5e0!3m2!1sen!2sbd!4v1748288112508!5m2!1sen!2sbd"
                                width="100%"
                                height="440"
                                style={{ border: 0, display: 'block' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Dhaka Imperial College Location"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventV1;