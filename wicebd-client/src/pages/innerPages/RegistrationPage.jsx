import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import ProjectRegistrationForm from '../../components/registration/ProjectRegistrationForm';
import WallMagazineRegistrationForm from '../../components/registration/WallMagazineRegistrationForm';
import OlympiadRegistrationForm from '../../components/registration/OlympiadRegistrationForm';

const darkTheme = createTheme({
    palette: { mode: 'dark', primary: { main: '#800020' }, background: { default: 'transparent', paper: 'transparent' } },
    typography: { fontFamily: 'inherit' },
    components: { MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } } },
});

const TABS = [
    { id: 'project',       label: 'Project',         badge: 'Team' },
    { id: 'wall-magazine', label: 'Wall Magazine',    badge: 'Team' },
    { id: 'olympiad',      label: 'Science Olympiad', badge: 'Individual' },
];

const FEE_INFO = {
    project:         { fee: 999, label: 'Registration Fee', note: null, prize: '৳2,00,000' },
    'wall-magazine': { fee: 399, label: 'Registration Fee', note: null, prize: '৳30,000' },
    olympiad:        { fee: 50,  label: 'Registration Fee', note: null, prize: '৳10,000' },
};

export default function RegistrationPage() {
    const location = useLocation();
    const [tab, setTab] = useState('project');
    const [promo, setPromo] = useState({ code: '', discount: 0 });

    useEffect(() => {
        const p = new URLSearchParams(location.search);
        const t = p.get('tab');
        if (t === 'olympiad' || t === 'wall-magazine' || t === 'project') setTab(t);
    }, [location.search]);

    // Reset promo when tab changes
    useEffect(() => { setPromo({ code: '', discount: 0 }); }, [tab]);

    const handlePromoChange = ({ code, discount }) => setPromo({ code, discount });

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu="register" />

                {/* Hero */}
                <section style={{ position: 'relative', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', padding: '160px 0 72px', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.2),transparent 70%)', top: -100, left: -80, filter: 'blur(60px)', pointerEvents: 'none' }} />
                    <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                        <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>WICEBD 2025</span>
                            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 44, margin: '10px 0 12px', lineHeight: 1.15 }}>Register Now</h1>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 440, margin: '0 auto', lineHeight: 1.8 }}>
                                Join the 8th World Invention Competition & Exhibition Bangladesh.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Form section */}
                <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)', padding: '64px 0 100px' }}>
                    <div className="auto-container">

                        {/* Tab switcher */}
                        <div className="wice-reg-tabs">
                            {TABS.map(t => {
                                const active = tab === t.id;
                                return (
                                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 26px',
                                        borderRadius: 50, border: active ? 'none' : '1px solid rgba(255,255,255,0.12)',
                                        background: active ? 'linear-gradient(135deg,#800020,#4f0014)' : 'rgba(255,255,255,0.04)',
                                        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                                        fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                        boxShadow: active ? '0 6px 22px rgba(128,0,32,0.4)' : 'none',
                                        transition: 'all 0.28s ease',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {t.label}
                                        <span style={{
                                            padding: '1px 9px', borderRadius: 50, fontSize: 11, fontWeight: 800,
                                            background: active ? 'rgba(255,255,255,0.18)' : 'rgba(128,0,32,0.15)',
                                            color: active ? '#fff' : '#c0002a',
                                        }}>{t.badge}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Card */}
                        <AnimatePresence mode="wait">
                            <motion.div key={tab}
                                className="wice-reg-card"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    maxWidth: 800, margin: '0 auto',
                                    background: 'rgba(255,255,255,0.042)',
                                    backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                                    border: '1px solid rgba(255,255,255,0.09)',
                                    borderTop: '3px solid #800020',
                                    borderRadius: 20,
                                    padding: '44px 48px 52px',
                                    boxShadow: '0 20px 56px rgba(0,0,0,0.45)',
                                }}
                            >
                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '20px', mb: 0.5 }}>
                                    {tab === 'project' ? 'Project Registration' : tab === 'wall-magazine' ? 'Wall Magazine Registration' : 'Science Olympiad Registration'}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px', mb: 2.5 }}>
                                    8th WICEBD — Bangladesh National Round
                                </Typography>

                                {/* Fee + prize info bar */}
                                {FEE_INFO[tab] && (() => {
                                    const baseFee = FEE_INFO[tab].fee;
                                    const discountedFee = promo.discount > 0
                                        ? Math.round(baseFee * (1 - promo.discount / 100))
                                        : null;
                                    return (
                                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
                                            {/* Fee */}
                                            <div style={{
                                                flex: 1, minWidth: 140,
                                                background: 'rgba(128,0,32,0.12)',
                                                border: '1px solid rgba(128,0,32,0.28)',
                                                borderRadius: 12, padding: '14px 18px',
                                            }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                                                    {FEE_INFO[tab].label}
                                                </div>
                                                {discountedFee !== null ? (
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>৳{discountedFee.toLocaleString()}</span>
                                                        <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>৳{baseFee.toLocaleString()}</span>
                                                    </div>
                                                ) : (
                                                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>৳{baseFee.toLocaleString()}</div>
                                                )}
                                                {discountedFee !== null && (
                                                    <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginTop: 3 }}>
                                                        {promo.discount}% promo discount applied · code: {promo.code}
                                                    </div>
                                                )}
                                                {!discountedFee && FEE_INFO[tab].note && (
                                                    <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginTop: 3 }}>
                                                        {FEE_INFO[tab].note}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Prize pool */}
                                            <div style={{
                                                flex: 1, minWidth: 140,
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.09)',
                                                borderRadius: 12, padding: '14px 18px',
                                            }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                                                    Prize Pool
                                                </div>
                                                <div style={{ fontSize: 24, fontWeight: 800, color: '#800020' }}>
                                                    {FEE_INFO[tab].prize}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {tab === 'project' && <ProjectRegistrationForm onPromoChange={handlePromoChange} />}
                                {tab === 'wall-magazine' && <WallMagazineRegistrationForm onPromoChange={handlePromoChange} />}
                                {tab === 'olympiad' && <OlympiadRegistrationForm onPromoChange={handlePromoChange} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                <FooterV2 />
                <ToastContainer position="bottom-right"
                    toastStyle={{ background: '#1a000a', color: '#fff', border: '1px solid rgba(128,0,32,0.35)', borderRadius: 10 }} />
            </div>
        </ThemeProvider>
    );
}
