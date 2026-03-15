import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ThemeProvider, createTheme,
    TextField, MenuItem, CircularProgress,
    Snackbar, Alert,
} from '@mui/material';
import axios from 'axios';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

/* ── MUI dark theme ── */
const darkTheme = createTheme({
    palette: { mode: 'dark', primary: { main: '#800020' }, background: { default: 'transparent', paper: 'transparent' } },
    typography: { fontFamily: 'inherit' },
    components: { MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } } },
});

/* ── Shared field style ── */
const fx = {
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '10px',
        color: '#fff',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.13)' },
        '&:hover fieldset': { borderColor: 'rgba(128,0,32,0.55)' },
        '&.Mui-focused fieldset': { borderColor: '#800020', borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.42)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#c0002a' },
    '& .MuiInputBase-input, & .MuiInputBase-inputMultiline': { color: '#fff' },
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' },
    '& .MuiFormHelperText-root.Mui-error': { color: '#ff7070', marginLeft: 0, marginTop: 4 },
};

/* ── Info cards data ── */
const INFO = [
    {
        icon: 'fa-map-marker-alt',
        title: 'Our Location',
        lines: ['Dreams of Bangladesh', 'Dhaka, Bangladesh'],
    },
    {
        icon: 'fa-phone-alt',
        title: 'Phone',
        lines: ['+880 1XXX-XXXXXX', 'Mon – Fri, 10 AM – 6 PM'],
    },
    {
        icon: 'fa-envelope',
        title: 'Email',
        lines: ['info@wicebd.com', 'support@wicebd.com'],
    },
    {
        icon: 'fa-clock',
        title: 'Office Hours',
        lines: ['Saturday – Thursday', '10:00 AM – 6:00 PM'],
    },
];

const SUBJECTS = [
    'General Inquiry',
    'Registration Help',
    'Sponsorship / Partnership',
    'Media & Press',
    'Volunteer',
    'Other',
];

/* ── Decorative orb ── */
const Orb = ({ style }) => (
    <div style={{
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,rgba(128,0,32,0.2),transparent 70%)',
        filter: 'blur(60px)', ...style,
    }} />
);

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, type: 'success', msg: '' });
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const onChange = e => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        setErrors(p => ({ ...p, [name]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.subject) e.subject = 'Please select a subject';
        if (!form.message.trim()) e.message = 'Message is required';
        return e;
    };

    const handleSubmit = async ev => {
        ev.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            await axios.post(`${backendUrl}/api/contact`, form);
            setToast({ open: true, type: 'success', msg: 'Message sent! We\'ll get back to you soon.' });
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch {
            setToast({ open: true, type: 'error', msg: 'Failed to send. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="page-wrapper" style={{ background: 'linear-gradient(160deg,#0a0004 0%,#160008 60%,#220010 100%)' }}>
                <span className="header-span" />
                <HeaderV1 headerStyle="header-style-two" parentMenu="contact" />

                {/* ── Hero ── */}
                <section style={{
                    position: 'relative', padding: '160px 0 96px', overflow: 'hidden',
                    background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
                }}>
                    <Orb style={{ width: 500, height: 500, top: -160, right: -80 }} />
                    <Orb style={{ width: 320, height: 320, bottom: -100, left: -60 }} />
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
                        backgroundSize: '60px 60px',
                    }} />

                    <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.55 }}
                            style={{
                                width: 90, height: 90, borderRadius: 24, margin: '0 auto 28px',
                                background: 'linear-gradient(135deg,#800020,#4f0014)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 12px 40px rgba(128,0,32,0.5)',
                            }}
                        >
                            <i className="fa fa-paper-plane" style={{ color: '#fff', fontSize: 36 }} />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }}>
                            <span style={{
                                display: 'inline-block', fontSize: 11, textTransform: 'uppercase',
                                letterSpacing: '0.24em', fontWeight: 700, color: '#c0002a', marginBottom: 14,
                            }}>WICEBD 2026 — Get In Touch</span>
                            <h1 style={{
                                color: '#fff', fontWeight: 900, fontSize: 'clamp(32px,5vw,56px)',
                                margin: '0 0 18px', lineHeight: 1.1,
                            }}>
                                Contact <span style={{
                                    background: 'linear-gradient(135deg,#fff 0%,#ffb8c8 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>Us</span>
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 17, lineHeight: 1.85, maxWidth: 500, margin: '0 auto' }}>
                                Have questions about WICEBD? We&apos;re here to help. Reach out and our team will respond within 24 hours.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── Info cards ── */}
                <section style={{
                    background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
                    padding: '0 0 64px',
                }}>
                    <div className="auto-container">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: 20,
                            marginTop: -32,
                            position: 'relative', zIndex: 3,
                        }}>
                            {INFO.map((card, i) => (
                                <motion.div key={card.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(24px)',
                                        WebkitBackdropFilter: 'blur(24px)',
                                        border: '1px solid rgba(255,255,255,0.09)',
                                        borderTop: '3px solid #800020',
                                        borderRadius: 16,
                                        padding: '28px 24px',
                                        boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12,
                                        background: 'linear-gradient(135deg,#800020,#4f0014)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 16,
                                        boxShadow: '0 6px 18px rgba(128,0,32,0.4)',
                                    }}>
                                        <i className={`fa ${card.icon}`} style={{ color: '#fff', fontSize: 18 }} />
                                    </div>
                                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, color: '#c0002a', marginBottom: 10 }}>
                                        {card.title}
                                    </div>
                                    {card.lines.map(l => (
                                        <div key={l} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7 }}>{l}</div>
                                    ))}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Form + Map ── */}
                <section style={{
                    background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
                    padding: '0 0 100px',
                }}>
                    <div className="auto-container">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}
                            className="contact-grid">

                            {/* Form card */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.55 }}
                                style={{
                                    background: 'rgba(255,255,255,0.042)',
                                    backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                                    border: '1px solid rgba(255,255,255,0.09)',
                                    borderTop: '3px solid #800020',
                                    borderRadius: 20,
                                    padding: '44px 40px 48px',
                                    boxShadow: '0 20px 56px rgba(0,0,0,0.4)',
                                }}
                            >
                                <div style={{ marginBottom: 32 }}>
                                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700, color: '#c0002a' }}>
                                        Send a Message
                                    </span>
                                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 28, margin: '8px 0 0', lineHeight: 1.25 }}>
                                        We&apos;d love to hear from you
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} noValidate>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                        <TextField
                                            fullWidth label="Full Name *" name="name"
                                            value={form.name} onChange={onChange}
                                            error={!!errors.name} helperText={errors.name} sx={fx}
                                        />
                                        <TextField
                                            fullWidth label="Email Address *" name="email" type="email"
                                            value={form.email} onChange={onChange}
                                            error={!!errors.email} helperText={errors.email} sx={fx}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                        <TextField
                                            fullWidth label="Phone (optional)" name="phone"
                                            value={form.phone} onChange={onChange} sx={fx}
                                        />
                                        <TextField
                                            select fullWidth label="Subject *" name="subject"
                                            value={form.subject} onChange={onChange}
                                            error={!!errors.subject} helperText={errors.subject} sx={fx}
                                            SelectProps={{
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: {
                                                            background: '#1a000a',
                                                            border: '1px solid rgba(128,0,32,0.3)',
                                                            borderRadius: 2,
                                                            '& .MuiMenuItem-root': {
                                                                color: 'rgba(255,255,255,0.75)',
                                                                '&:hover, &.Mui-selected': {
                                                                    background: 'rgba(128,0,32,0.2)',
                                                                    color: '#fff',
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            {SUBJECTS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                        </TextField>
                                    </div>
                                    <div style={{ marginBottom: 32 }}>
                                        <TextField
                                            fullWidth multiline rows={5}
                                            label="Your Message *" name="message"
                                            value={form.message} onChange={onChange}
                                            error={!!errors.message} helperText={errors.message} sx={fx}
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            width: '100%', padding: '15px', borderRadius: 50, border: 'none',
                                            background: loading ? 'rgba(128,0,32,0.4)' : 'linear-gradient(135deg,#800020,#c0002a)',
                                            color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '0.05em',
                                            boxShadow: loading ? 'none' : '0 8px 28px rgba(128,0,32,0.45)',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                        }}
                                    >
                                        {loading
                                            ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Sending…</>
                                            : <><i className="fa fa-paper-plane" /> Send Message</>
                                        }
                                    </motion.button>
                                </form>
                            </motion.div>

                            {/* Right side — social + map */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.55 }}
                            >
                                {/* Social links */}
                                <div style={{
                                    background: 'rgba(255,255,255,0.042)',
                                    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(255,255,255,0.09)',
                                    borderTop: '3px solid #800020',
                                    borderRadius: 20,
                                    padding: '32px 36px',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                                    marginBottom: 24,
                                }}>
                                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700, color: '#c0002a', display: 'block', marginBottom: 6 }}>
                                        Follow Us
                                    </span>
                                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 20px' }}>
                                        Stay Connected
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {[
                                            { icon: 'fa-facebook-f', label: 'Facebook', handle: '@wicebd', href: 'https://www.facebook.com/wicebd' },
                                            { icon: 'fa-youtube',    label: 'YouTube',  handle: '@wicebd', href: 'https://www.youtube.com/@wicebd' },
                                            { icon: 'fa-instagram',  label: 'Instagram',handle: '@wicebd', href: 'https://www.instagram.com/wicebd' },
                                        ].map(s => (
                                            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                                                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14,
                                                    padding: '12px 16px', borderRadius: 12,
                                                    background: 'rgba(255,255,255,0.04)',
                                                    border: '1px solid rgba(255,255,255,0.07)',
                                                    transition: 'all 0.22s ease',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(128,0,32,0.18)'; e.currentTarget.style.borderColor = 'rgba(128,0,32,0.4)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                                            >
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                                    background: 'linear-gradient(135deg,#800020,#4f0014)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <i className={`fab ${s.icon}`} style={{ color: '#fff', fontSize: 14 }} />
                                                </div>
                                                <div>
                                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{s.handle}</div>
                                                </div>
                                                <i className="fa fa-arrow-right" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginLeft: 'auto' }} />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Map placeholder */}
                                <div style={{
                                    borderRadius: 20, overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.09)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                                }}>
                                    <iframe
                                        title="Map"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.36399323356!2d90.27923879452956!3d23.780573132392437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1710000000000"
                                        width="100%" height="240"
                                        style={{ border: 0, display: 'block', filter: 'grayscale(100%) invert(90%) contrast(0.85)' }}
                                        allowFullScreen loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <FooterV2 />

                <Snackbar
                    open={toast.open}
                    autoHideDuration={5000}
                    onClose={() => setToast(t => ({ ...t, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))}
                        sx={{ background: '#1a000a', color: '#fff', border: '1px solid rgba(128,0,32,0.4)', '& .MuiAlert-icon': { color: '#c0002a' } }}>
                        {toast.msg}
                    </Alert>
                </Snackbar>
            </div>
        </ThemeProvider>
    );
}
