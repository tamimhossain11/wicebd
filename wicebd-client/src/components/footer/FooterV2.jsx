import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { motion } from 'framer-motion';

const QUICK_LINKS = [
    { label: 'Home',              to: '/#' },
    { label: 'About Us',          to: '/about-us#' },
    { label: 'Registration',      to: '/registration#' },
    { label: 'Organizing Panel',  to: '/organizing-panel#' },
    { label: 'Contact Us',        to: '/contact#' },
];

const TEAM_LINKS = [
    { label: 'Selected Teams',       to: '/selected-teams#' },
    { label: 'International Round',  to: '/international-team#' },
    { label: 'Science Olympiad',     to: '/registration?tab=olympiad#' },
    { label: 'Media Coverage',       to: '/#media' },
];

const SOCIALS = [
    { icon: 'fa-facebook-f',  href: 'https://www.facebook.com/wicebd' },
    { icon: 'fa-youtube',     href: 'https://www.youtube.com/@wicebd' },
    { icon: 'fa-instagram',   href: 'https://www.instagram.com/wicebd' },
];

const FooterV2 = ({ hasIcon = false, footerStyle, darkLogo = false }) => (
    <footer style={{
        background: 'linear-gradient(160deg,#0a0004 0%,#160008 60%,#220010 100%)',
        borderTop: '1px solid rgba(128,0,32,0.25)',
        position: 'relative',
        overflow: 'hidden',
    }}>
        {/* Decorative orbs */}
        <div style={{
            position: 'absolute', width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(128,0,32,0.14),transparent 70%)',
            top: -160, right: -80, filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
            position: 'absolute', width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(128,0,32,0.10),transparent 70%)',
            bottom: -80, left: -60, filter: 'blur(50px)', pointerEvents: 'none',
        }} />

        {/* Top divider line glow */}
        <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '60%', height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(192,0,42,0.6),transparent)',
        }} />

        <div className="auto-container" style={{ position: 'relative', zIndex: 2 }}>

            {/* Main grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '48px 40px',
                padding: '72px 0 52px',
            }}>

                {/* Brand column */}
                <div style={{ gridColumn: 'span 1' }}>
                    <Link to="/#">
                        <img src="/images/logo.png" alt="WICEBD"
                            style={{ height: 52, objectFit: 'contain', marginBottom: 20, filter: 'brightness(1.1)' }} />
                    </Link>
                    <p style={{
                        color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.8,
                        marginBottom: 28, maxWidth: 240,
                    }}>
                        World Invention Competition &amp; Exhibition Bangladesh — connecting young innovators to the global stage.
                    </p>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {SOCIALS.map(s => (
                            <a key={s.icon} href={s.href} target="_blank" rel="noreferrer"
                                style={{
                                    width: 38, height: 38, borderRadius: '50%', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(128,0,32,0.18)',
                                    border: '1px solid rgba(128,0,32,0.35)',
                                    color: 'rgba(255,255,255,0.65)', fontSize: 15,
                                    transition: 'all 0.25s ease',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#800020';
                                    e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.borderColor = '#800020';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(128,0,32,0.18)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                                    e.currentTarget.style.borderColor = 'rgba(128,0,32,0.35)';
                                }}
                            >
                                <i className={`fab ${s.icon}`} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h6 style={{
                        color: '#fff', fontWeight: 700, fontSize: 13,
                        textTransform: 'uppercase', letterSpacing: '0.16em',
                        marginBottom: 22, paddingBottom: 12,
                        borderBottom: '1px solid rgba(128,0,32,0.3)',
                    }}>Quick Links</h6>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {QUICK_LINKS.map(l => (
                            <li key={l.label} style={{ marginBottom: 11 }}>
                                <Link to={l.to} style={{
                                    color: 'rgba(255,255,255,0.5)', fontSize: 14, textDecoration: 'none',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    transition: 'color 0.2s ease',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#c0002a'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                                >
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#800020', flexShrink: 0 }} />
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Teams & Events */}
                <div>
                    <h6 style={{
                        color: '#fff', fontWeight: 700, fontSize: 13,
                        textTransform: 'uppercase', letterSpacing: '0.16em',
                        marginBottom: 22, paddingBottom: 12,
                        borderBottom: '1px solid rgba(128,0,32,0.3)',
                    }}>Teams &amp; Events</h6>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {TEAM_LINKS.map(l => (
                            <li key={l.label} style={{ marginBottom: 11 }}>
                                <Link to={l.to} style={{
                                    color: 'rgba(255,255,255,0.5)', fontSize: 14, textDecoration: 'none',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    transition: 'color 0.2s ease',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#c0002a'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                                >
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#800020', flexShrink: 0 }} />
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Event Info */}
                <div>
                    <h6 style={{
                        color: '#fff', fontWeight: 700, fontSize: 13,
                        textTransform: 'uppercase', letterSpacing: '0.16em',
                        marginBottom: 22, paddingBottom: 12,
                        borderBottom: '1px solid rgba(128,0,32,0.3)',
                    }}>8th WICEBD</h6>

                    {[
                        { icon: 'fa-calendar-alt', label: 'National Round', val: 'Date TBA · Bangladesh' },
                        { icon: 'fa-globe-asia',   label: 'International Round', val: 'September 2026 · Malaysia' },
                        { icon: 'fa-university',   label: 'Int\'l Venue', val: 'SEGI University, KL' },
                        { icon: 'fa-envelope',     label: 'Contact', val: 'info@wicebd.com' },
                    ].map(item => (
                        <div key={item.label} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                background: 'rgba(128,0,32,0.18)', border: '1px solid rgba(128,0,32,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className={`fa ${item.icon}`} style={{ color: '#c0002a', fontSize: 13 }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{item.label}</div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{item.val}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '22px 0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12,
            }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>
                    &copy; {new Date().getFullYear()} WICEBD. All rights reserved.{' '}
                    <span style={{ color: 'rgba(128,0,32,0.7)' }}>·</span>{' '}
                    Organised by{' '}
                    <a href="https://www.facebook.com/DreamsofBangladesh" target="_blank" rel="noreferrer"
                        style={{ color: 'rgba(192,0,42,0.8)', textDecoration: 'none' }}>
                        Dreams of Bangladesh
                    </a>
                </p>
                <div style={{ display: 'flex', gap: 20 }}>
                    {['Privacy Policy', 'Terms of Use'].map(t => (
                        <span key={t} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, cursor: 'default' }}>{t}</span>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default FooterV2;
