import React, { useState } from 'react';
import {
    Box, TextField, MenuItem, FormControl, InputLabel, Select,
    Typography, Grid, FormHelperText, CircularProgress,
    Step, Stepper, StepLabel, Checkbox,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReferenceSearch from './ReferenceSearch';

/* ─── Shared field style ─── */
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
    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' },
    '& .MuiFormHelperText-root.Mui-error': { color: '#ff7070', marginLeft: 0, marginTop: '4px' },
};

const MP = {
    PaperProps: {
        sx: {
            background: '#1a000a', border: '1px solid rgba(128,0,32,0.3)', borderRadius: '10px',
            '& .MuiMenuItem-root': {
                color: 'rgba(255,255,255,0.8)',
                '&:hover': { background: 'rgba(128,0,32,0.2)' },
                '&.Mui-selected': { background: 'rgba(128,0,32,0.4)', color: '#fff' },
            },
        },
    },
};

const STEPS = ['Competition', 'Team Info', 'Project'];

const SUBCATS = ['IT and Robotics', 'Environmental Science', 'Innovative Social Science', 'Applied Physics and Engineering', 'Applied Life Science'];
const EDU_LEVELS = [
    { value: 'Primary School', label: 'Elementary (Class 1–5)' },
    { value: 'High School', label: 'High School (Class 6–10)' },
    { value: 'college', label: 'College (Class 11–12)' },
    { value: 'University', label: 'University' },
];

const SubmitBtn = ({ loading, label }) => (
    <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
        whileTap={{ scale: 0.97 }}
        style={{
            padding: '14px 48px', borderRadius: '50px', border: 'none',
            background: loading ? 'rgba(128,0,32,0.45)' : 'linear-gradient(135deg,#800020,#c0002a)',
            color: '#fff', fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(128,0,32,0.4)',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            transition: 'background 0.3s',
        }}
    >
        {loading ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Submitting…</> : label}
    </motion.button>
);

const NavRow = ({ step, total, onBack, loading, lastLabel }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5 }}>
        {step > 0 ? (
            <button type="button" onClick={onBack} style={{
                padding: '12px 28px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.18)',
                background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 600,
                fontSize: '14px', cursor: 'pointer', transition: 'border-color 0.25s',
            }}
                onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.18)'}
            >
                ← Back
            </button>
        ) : <span />}
        <SubmitBtn loading={loading} label={step === total - 1 ? lastLabel : 'Continue →'} />
    </Box>
);

export default function ProjectRegistrationForm() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        competitionCategory: 'Project', projectSubcategory: '', categories: '', crRefrence: '',
        ca_code: '', club_code: '',
        leader: '', institution: '', leaderPhone: '', leaderWhatsApp: '', leaderEmail: '',
        tshirtSizeLeader: '', member2: '', institution2: '', tshirtSize2: '',
        member3: '', institution3: '', tshirtSize3: '',
        projectTitle: '', projectCategory: '', participatedBefore: '',
        previousCompetition: '', socialMedia: '', infoSource: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const set = (name, value) => setForm(p => ({
        ...p, [name]: value,
        ...(name === 'participatedBefore' && value === 'No' ? { previousCompetition: '' } : {}),
    }));

    const onChange = e => { set(e.target.name, e.target.value); setErrors(p => ({ ...p, [e.target.name]: '' })); };

    const validateStep = () => {
        const errs = {};
        if (step === 0) {
            if (!form.projectSubcategory) errs.projectSubcategory = 'Required';
            if (!form.categories) errs.categories = 'Required';
            if (!form.crRefrence.trim()) errs.crRefrence = 'Required';
        }
        if (step === 1) {
            if (!form.leader.trim()) errs.leader = 'Required';
            if (!form.institution.trim()) errs.institution = 'Required';
            if (!/^\d{11}$/.test(form.leaderPhone.replace(/\D/g,''))) errs.leaderPhone = 'Enter an 11-digit number';
            if (!/^\d{11}$/.test(form.leaderWhatsApp.replace(/\D/g,''))) errs.leaderWhatsApp = 'Enter an 11-digit number';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.leaderEmail)) errs.leaderEmail = 'Enter a valid email';
            if (!form.tshirtSizeLeader) errs.tshirtSizeLeader = 'Required';
        }
        if (step === 2) {
            if (!form.projectTitle.trim()) errs.projectTitle = 'Required';
            if (!form.projectCategory) errs.projectCategory = 'Required';
            if (!form.participatedBefore) errs.participatedBefore = 'Required';
            if (!form.infoSource.trim()) errs.infoSource = 'Required';
            if (form.socialMedia) {
                try { new URL(form.socialMedia); } catch { errs.socialMedia = 'Enter a valid URL'; }
            }
            if (!termsAccepted) errs.termsAccepted = 'You must accept the Terms & Conditions to proceed';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = e => {
        e.preventDefault();
        if (!validateStep()) return;
        if (step < STEPS.length - 1) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        else handleSubmit();
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const saveRes = await axios.post(`${backendUrl}/api/registration/start`, form);
            const { paymentID } = saveRes.data;
            if (!paymentID) { toast.error('Failed to initiate registration'); return; }
            const payRes = await axios.post(`${backendUrl}/api/payment/initiate`, { paymentID, formData: form });
            const { bkashURL, paymentID: bkashID } = payRes.data;
            if (bkashURL && bkashID) {
                sessionStorage.setItem('bkashPaymentID', bkashID);
                window.location.href = bkashURL;
            } else {
                toast.error('Payment URL not received');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {/* Stepper */}
            <Stepper activeStep={step} alternativeLabel sx={{ mb: 5,
                '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.4)', fontSize: '13px', mt: '6px' },
                '& .MuiStepLabel-label.Mui-active': { color: '#fff', fontWeight: 700 },
                '& .MuiStepLabel-label.Mui-completed': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.1)' },
                '& .MuiStepIcon-root.Mui-active': { color: '#800020' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#800020' },
                '& .MuiStepConnector-line': { borderColor: 'rgba(255,255,255,0.12)' },
            }}>
                {STEPS.map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
            </Stepper>

            <AnimatePresence mode="wait">
                <motion.form
                    key={step}
                    onSubmit={handleNext}
                    noValidate
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* ── Step 0: Competition ── */}
                    {step === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={f} error={!!errors.projectSubcategory}>
                                    <InputLabel>Subcategory *</InputLabel>
                                    <Select name="projectSubcategory" value={form.projectSubcategory} onChange={onChange} label="Subcategory *" MenuProps={MP}>
                                        {SUBCATS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                    </Select>
                                    {errors.projectSubcategory && <FormHelperText>{errors.projectSubcategory}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={f} error={!!errors.categories}>
                                    <InputLabel>Education Level *</InputLabel>
                                    <Select name="categories" value={form.categories} onChange={onChange} label="Education Level *" MenuProps={MP}>
                                        {EDU_LEVELS.map(l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>)}
                                    </Select>
                                    {errors.categories && <FormHelperText>{errors.categories}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="CR Reference *" name="crRefrence" value={form.crRefrence} onChange={onChange}
                                    error={!!errors.crRefrence} helperText={errors.crRefrence} sx={f} placeholder="Your CR's name" />
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
                                    onChange={(code) => set('ca_code', code)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <ReferenceSearch
                                    type="club"
                                    value={form.club_code}
                                    onChange={(code) => set('club_code', code)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* ── Step 1: Team ── */}
                    {step === 1 && (
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Leader Name *" name="leader" value={form.leader} onChange={onChange}
                                        error={!!errors.leader} helperText={errors.leader} sx={f} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Institution *" name="institution" value={form.institution} onChange={onChange}
                                        error={!!errors.institution} helperText={errors.institution} sx={f} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Phone Number *" name="leaderPhone" value={form.leaderPhone} onChange={onChange}
                                        error={!!errors.leaderPhone} helperText={errors.leaderPhone} placeholder="01XXXXXXXXX" sx={f} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="WhatsApp Number *" name="leaderWhatsApp" value={form.leaderWhatsApp} onChange={onChange}
                                        error={!!errors.leaderWhatsApp} helperText={errors.leaderWhatsApp} placeholder="01XXXXXXXXX" sx={f} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Email Address *" name="leaderEmail" value={form.leaderEmail} onChange={onChange}
                                        error={!!errors.leaderEmail} helperText={errors.leaderEmail} type="email" sx={f} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={f} error={!!errors.tshirtSizeLeader}>
                                        <InputLabel>T-Shirt Size *</InputLabel>
                                        <Select name="tshirtSizeLeader" value={form.tshirtSizeLeader} onChange={onChange} label="T-Shirt Size *" MenuProps={MP}>
                                            {['S','M','L','XL','XXL'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                        </Select>
                                        {errors.tshirtSizeLeader && <FormHelperText>{errors.tshirtSizeLeader}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Optional members */}
                            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', mt: 4, mb: 2 }}>
                                Additional Members — Optional
                            </Typography>
                            {[2, 3].map(n => (
                                <Box key={n} sx={{ mb: 2.5, p: 3, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', mb: 2 }}>Member {n}</Typography>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={12} sm={5}>
                                            <TextField fullWidth label="Name" name={`member${n}`} value={form[`member${n}`]} onChange={onChange} sx={f} size="small" />
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <TextField fullWidth label="Institution" name={`institution${n}`} value={form[`institution${n}`]} onChange={onChange} sx={f} size="small" />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <FormControl fullWidth sx={f} size="small">
                                                <InputLabel>Size</InputLabel>
                                                <Select name={`tshirtSize${n}`} value={form[`tshirtSize${n}`]} onChange={onChange} label="Size" MenuProps={MP}>
                                                    {['S','M','L','XL','XXL'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* ── Step 2: Project ── */}
                    {step === 2 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Project Title *" name="projectTitle" value={form.projectTitle} onChange={onChange}
                                    error={!!errors.projectTitle} helperText={errors.projectTitle || `${form.projectTitle.length}/160`}
                                    inputProps={{ maxLength: 160 }} sx={f} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={f} error={!!errors.projectCategory}>
                                    <InputLabel>Project Category *</InputLabel>
                                    <Select name="projectCategory" value={form.projectCategory} onChange={onChange} label="Project Category *" MenuProps={MP}>
                                        <MenuItem value="Innovation">Innovation</MenuItem>
                                        <MenuItem value="Research">Research</MenuItem>
                                    </Select>
                                    {errors.projectCategory && <FormHelperText>{errors.projectCategory}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={f} error={!!errors.participatedBefore}>
                                    <InputLabel>Participated before? *</InputLabel>
                                    <Select name="participatedBefore" value={form.participatedBefore} onChange={onChange} label="Participated before? *" MenuProps={MP}>
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Select>
                                    {errors.participatedBefore && <FormHelperText>{errors.participatedBefore}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            {form.participatedBefore === 'Yes' && (
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Which competition?" name="previousCompetition" value={form.previousCompetition} onChange={onChange} sx={f} />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Social Media (optional)" name="socialMedia" value={form.socialMedia} onChange={onChange}
                                    error={!!errors.socialMedia} helperText={errors.socialMedia} placeholder="https://facebook.com/…" sx={f} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="How did you hear about WICEBD? *" name="infoSource" value={form.infoSource} onChange={onChange}
                                    error={!!errors.infoSource} helperText={errors.infoSource} placeholder="e.g. Facebook, Teacher…" sx={f} />
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
                    )}

                    <NavRow step={step} total={STEPS.length} onBack={() => setStep(s => s - 1)} loading={loading} lastLabel="Submit & Pay →" />
                </motion.form>
            </AnimatePresence>
        </Box>
    );
}
