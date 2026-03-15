import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SingleFactV2 = ({ fact }) => {
    const { icon, end, title, iconColor = 'text-primary' } = fact;

    return (
        <Col lg={3} md={6} sm={12} className="mb-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 90, delay: fact.delay ? fact.delay / 1000 : 0 }}
                whileHover={{ y: -8, scale: 1.03 }}
                style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderTop: '3px solid var(--primary-maroon, #800020)',
                    borderRadius: '20px',
                    padding: '40px 28px',
                    textAlign: 'center',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
                    cursor: 'default',
                    transition: 'box-shadow 0.3s ease',
                }}
            >
                {/* Icon */}
                <motion.div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'rgba(128, 0, 32, 0.2)',
                        border: '1px solid rgba(128, 0, 32, 0.4)',
                        marginBottom: '20px',
                    }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <i className={`${icon}`} style={{ fontSize: '1.8rem', color: '#ffffff' }}></i>
                </motion.div>

                {/* Count */}
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: '10px' }}>
                    <CountUp end={end} enableScrollSpy duration={2.5} suffix="+" />
                </div>

                {/* Label */}
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                    {title}
                </div>

                {/* Accent line */}
                <motion.div
                    style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #800020, transparent)', marginTop: '18px', borderRadius: '2px' }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                />
            </motion.div>
        </Col>
    );
};

export default SingleFactV2;
