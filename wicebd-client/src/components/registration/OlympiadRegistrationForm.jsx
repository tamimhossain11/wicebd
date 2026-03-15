import React, { useState } from 'react';
import { Box, TextField, Typography, Grid, CircularProgress, FormHelperText } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', institution: '', crReference: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
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
                    <button onClick={() => { setDone(false); setForm({ fullName: '', email: '', phone: '', address: '', institution: '', crReference: '' }); }}
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
