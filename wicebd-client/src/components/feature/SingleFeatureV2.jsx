import React from 'react';
import { motion } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';

const SingleFeatureV2 = ({ feature, index }) => {
    const { icon, name, text, color, badge, to } = feature;

    return (
        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${color}33`,
                    borderTop: `3px solid ${color}`,
                    borderRadius: '22px',
                    padding: '40px 30px 36px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)`,
                    cursor: 'default',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.3s ease',
                }}
            >
                {/* Glow blob */}
                <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}25, transparent 70%)`,
                    filter: 'blur(20px)', pointerEvents: 'none',
                }} />

                {/* Corner circuit lines */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '80px', height: '80px', opacity: 0.12 }} viewBox="0 0 80 80">
                    <path d="M0 30 L30 30 L30 0" stroke={color} strokeWidth="1.5" fill="none" />
                    <circle cx="30" cy="30" r="3" fill={color} />
                    <path d="M0 50 L15 50 L15 15 L50 15" stroke={color} strokeWidth="1" fill="none" strokeDasharray="3 4" />
                </svg>

                {/* Badge */}
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                        fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.15em', color: color,
                        background: `${color}18`, border: `1px solid ${color}40`,
                        borderRadius: '50px', padding: '4px 12px',
                    }}>
                        {badge}
                    </span>
                </div>

                {/* Icon */}
                <motion.div
                    animate={{ rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 5 + index * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        width: '68px', height: '68px', borderRadius: '18px',
                        background: `linear-gradient(135deg, ${color}30, ${color}12)`,
                        border: `1px solid ${color}50`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px',
                        boxShadow: `0 6px 20px ${color}30`,
                    }}
                >
                    <i className={icon} style={{ fontSize: '1.9rem', color: color }}></i>
                </motion.div>

                {/* Text */}
                <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '20px', marginBottom: '14px', lineHeight: 1.3 }}>
                    {name}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.75, flex: 1, marginBottom: '28px' }}>
                    {text}
                </p>

                {/* CTA */}
                <Link to={`${to}#`} style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ x: 4 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            color: color, fontWeight: 600, fontSize: '13px',
                            letterSpacing: '0.04em',
                        }}
                    >
                        Learn More
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                </Link>

                {/* Bottom accent */}
                <motion.div
                    style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                        opacity: 0,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </div>
    );
};

export default SingleFeatureV2;
