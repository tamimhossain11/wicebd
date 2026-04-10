import React, { useState } from 'react';
import { Box, TextField, Typography, Grid, CircularProgress, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReferenceSearch from './ReferenceSearch';

const f = {
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '10px',
        color: '#fff',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.14)' },
        '&:hover fieldset': { borderColor: 'rgba(128,0,32,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#800020', borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#c0002a' },
    '& .MuiInputBase-input': { color: '#fff' },
    '& .MuiInputBase-inputMultiline': { color: '#fff' },
    '& .MuiFormHelperText-root.Mui-error': { color: '#ff7070', marginLeft: 0, marginTop: '4px' },
};

export default function OlympiadRegistrationForm() {
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', institution: '', crReference: '', ca_code: '', club_code: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const onChange = e => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        setErrors(p => ({ ...p, [name]: '' }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
        if (!/^\d{11}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Enter an 11-digit number';
        if (!form.address.trim()) errs.address = 'Required';
        if (!form.institution.trim()) errs.institution = 'Required';
        if (!termsAccepted) errs.termsAccepted = 'You must accept the Terms & Conditions to proceed';
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/api/olympiad/register`, form);
            if (res.data.success) {
                setDone(true);
                toast.success('Registered successfully!');
            } else {
                toast.error(res.data.message || 'Registration failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Box sx={{
                        width: 72, height: 72, borderRadius: '50%', mx: 'auto', mb: 3,
                        background: 'linear-gradient(135deg,#800020,#4f0014)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 28px rgba(128,0,32,0.5)',
                        fontSize: 30, color: '#fff',
                    }}>✓</Box>
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '24px', mb: 1 }}>You're in!</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', maxWidth: 380, mx: 'auto', lineHeight: 1.8 }}>
                        Your Olympiad registration was received. We'll reach out via email with further details.
                    </Typography>
                    <button onClick={() => { setDone(false); setForm({ fullName: '', email: '', phone: '', address: '', institution: '', crReference: '', ca_code: '', club_code: '' }); }}
                        style={{ marginTop: 28, padding: '11px 32px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.18)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '14px', cursor: 'pointer' }}>
                        Register another
                    </button>
                </Box>
            </motion.div>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name *" name="fullName" value={form.fullName} onChange={onChange}
                        error={!!errors.fullName} helperText={errors.fullName} sx={f} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email Address *" name="email" value={form.email} onChange={onChange}
                        error={!!errors.email} helperText={errors.email} type="email" sx={f} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Phone Number *" name="phone" value={form.phone} onChange={onChange}
                        error={!!errors.phone} helperText={errors.phone} placeholder="01XXXXXXXXX" sx={f} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Institution *" name="institution" value={form.institution} onChange={onChange}
                        error={!!errors.institution} helperText={errors.institution} sx={f} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Address *" name="address" value={form.address} onChange={onChange}
                        error={!!errors.address} helperText={errors.address} sx={f} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="CR Reference (optional)" name="crReference" value={form.crReference} onChange={onChange} sx={f} />
                </Grid>

                {/* ── Campus Ambassador & Club Partner search ── */}
                <Grid item xs={12}>
                    <Box sx={{ height: '1px', background: 'rgba(255,255,255,0.07)', my: 1 }} />
                    <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ width: 3, height: 14, borderRadius: 2, background: '#800020' }} />
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>
                            Reference (Optional)
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ReferenceSearch
                        type="ca"
                        value={form.ca_code}
                        onChange={(code) => setForm(p => ({ ...p, ca_code: code }))}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ReferenceSearch
                        type="club"
                        value={form.club_code}
                        onChange={(code) => setForm(p => ({ ...p, club_code: code }))}
                    />
                </Grid>

                {/* T&C acceptance */}
                <Grid item xs={12}>
                    <Box sx={{
                        display: 'flex', alignItems: 'flex-start', gap: 1.5,
                        p: 2.5, borderRadius: '12px',
                        border: errors.termsAccepted ? '1px solid #ff7070' : '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.025)',
                    }}>
                        <Checkbox
                            checked={termsAccepted}
                            onChange={e => { setTermsAccepted(e.target.checked); setErrors(p => ({ ...p, termsAccepted: '' })); }}
                            sx={{
                                p: 0, mt: '2px', color: 'rgba(255,255,255,0.3)',
                                '&.Mui-checked': { color: '#800020' },
                            }}
                        />
                        <Box>
                            <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                                I have read and agree to the{' '}
                                <Link to="/terms-and-conditions" target="_blank" style={{ color: '#c0002a' }}>Terms &amp; Conditions</Link>
                                {', '}
                                <Link to="/return-refund-policy" target="_blank" style={{ color: '#c0002a' }}>Return &amp; Refund Policy</Link>
                                {', and '}
                                <Link to="/privacy-policy" target="_blank" style={{ color: '#c0002a' }}>Privacy Policy</Link>
                                {' of WICEBD.'}
                            </Typography>
                            {errors.termsAccepted && (
                                <Typography sx={{ fontSize: '12px', color: '#ff7070', mt: 0.5 }}>
                                    {errors.termsAccepted}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        padding: '14px 52px', borderRadius: '50px', border: 'none',
                        background: loading ? 'rgba(128,0,32,0.45)' : 'linear-gradient(135deg,#800020,#c0002a)',
                        color: '#fff', fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em',
                        boxShadow: loading ? 'none' : '0 8px 24px rgba(128,0,32,0.4)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                    }}
                >
                    {loading ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Submitting…</> : 'Submit Registration →'}
                </motion.button>
            </Box>
        </Box>
    );
}
