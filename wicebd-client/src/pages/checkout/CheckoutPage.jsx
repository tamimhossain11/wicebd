import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircularProgress, Typography, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import api from '../../api/index';

const EXTRA_CHARGE = { project: 300, megazine: 120, olympiad: 0 };
const BASE_FEE = { project: 999, megazine: 399, olympiad: 50 };

const Row = ({ label, value, bold, highlight }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '11px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
        <span style={{ color: bold ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)', fontSize: 14 }}>{label}</span>
        <span style={{ color: highlight ? '#10b981' : bold ? '#fff' : 'rgba(255,255,255,0.8)', fontWeight: bold ? 700 : 400, fontSize: bold ? 15 : 14 }}>{value}</span>
    </div>
);

const Divider = () => <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />;

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const raw = sessionStorage.getItem('checkoutData');
        if (!raw) { navigate('/register'); return; }
        try { setFormData(JSON.parse(raw)); }
        catch { navigate('/register'); }
    }, [navigate]);

    if (!formData) return null;

    const cat = formData.competitionCategory?.toLowerCase() || 'project';
    const baseFee = BASE_FEE[cat] ?? 620;
    const extraCharge = EXTRA_CHARGE[cat] ?? 0;
    const extraCount = (formData.member4 ? 1 : 0) + (formData.member5 ? 1 : 0);
    const extraTotal = extraCount * extraCharge;

    // Promo discount (stored as percentage)
    const promoDiscount = formData._promoDiscount || 0;
    const promoCode = formData._promoCode || '';
    const promoSaving = promoDiscount > 0 ? Math.round(baseFee * promoDiscount / 100) : 0;

    const total = baseFee + extraTotal - promoSaving;

    const categoryLabel = cat === 'megazine' ? 'Wall Magazine' : cat === 'olympiad' ? 'Science Olympiad' : 'Project';

    const members = [
        formData.leader && { name: formData.leader, institution: formData.institution, role: 'Leader' },
        formData.member2 && { name: formData.member2, institution: formData.institution2 },
        formData.member3 && { name: formData.member3, institution: formData.institution3 },
        formData.member4 && { name: formData.member4, institution: formData.institution4, extra: true },
        formData.member5 && { name: formData.member5, institution: formData.institution5, extra: true },
    ].filter(Boolean);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // 1. Save registration to temp table
            const apiEndpoint = cat === 'olympiad' ? '/api/olympiad/start' : '/api/registration/start';
            const saveRes = await api.post(apiEndpoint, formData);
            const { paymentID } = saveRes.data;
            if (!paymentID) { toast.error('Failed to initiate registration'); setLoading(false); return; }

            // 2. Initiate PayStation payment
            const payRes = await api.post('/api/payment/initiate', { paymentID });
            const { payment_url, invoice_number } = payRes.data;
            if (payment_url && invoice_number) {
                sessionStorage.setItem('paystationInvoice', invoice_number);
                sessionStorage.removeItem('checkoutData');
                window.location.href = payment_url;
            } else {
                toast.error('Payment URL not received');
                setLoading(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" parentMenu="register" />

            {/* Hero */}
            <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', padding: '160px 0 60px' }}>
                <div className="auto-container" style={{ textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>Order Summary</span>
                        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 38, margin: '10px 0 10px', lineHeight: 1.2 }}>Review & Pay</h1>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
                            Confirm your registration details before proceeding to payment.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Checkout body */}
            <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)', padding: '48px 0 100px' }}>
                <div className="auto-container">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                        style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}
                    >
                        {/* Category badge */}
                        <div style={{
                            background: 'rgba(128,0,32,0.12)', border: '1px solid rgba(128,0,32,0.3)',
                            borderRadius: 12, padding: '14px 20px',
                            display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#800020', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>Competition</div>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginTop: 2 }}>WICEBD 2025 — {categoryLabel}</div>
                            </div>
                        </div>

                        {/* Team / Participant details */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '24px 28px' }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', mb: 1.5 }}>
                                {cat === 'olympiad' ? 'Participant' : 'Team Members'}
                            </Typography>
                            {members.map((m, i) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 0',
                                    borderBottom: i < members.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                }}>
                                    <div>
                                        <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                                            {m.name}
                                            {m.role && <span style={{ color: '#800020', fontSize: 12, marginLeft: 8, fontWeight: 700 }}>({m.role})</span>}
                                        </div>
                                        {m.institution && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{m.institution}</div>}
                                    </div>
                                    {m.extra && (
                                        <span style={{ fontSize: 11, color: '#c0002a', fontWeight: 700, background: 'rgba(128,0,32,0.15)', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                                            +৳{extraCharge}
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Extra fields */}
                            <div style={{ marginTop: 16 }}>
                                {cat !== 'olympiad' && formData.projectTitle && (
                                    <Row label={cat === 'megazine' ? 'Magazine Title' : 'Project Title'} value={formData.projectTitle} />
                                )}
                                {formData.leaderEmail && <Row label="Email" value={formData.leaderEmail} />}
                                {formData.leaderPhone && <Row label="Phone" value={formData.leaderPhone} />}
                                {formData.categories && <Row label="Category" value={formData.categories} />}
                                {cat === 'project' && formData.projectSubcategory && <Row label="Subcategory" value={formData.projectSubcategory} />}
                            </div>
                        </div>

                        {/* Price breakdown */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '24px 28px' }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', mb: 1.5 }}>
                                Price Breakdown
                            </Typography>

                            <Row label={`Base Registration (${categoryLabel})`} value={`৳${baseFee.toLocaleString()}`} />

                            {extraCount > 0 && (
                                <Row
                                    label={`Extra Member${extraCount > 1 ? 's' : ''} × ${extraCount} (৳${extraCharge} each)`}
                                    value={`৳${extraTotal.toLocaleString()}`}
                                />
                            )}

                            {promoSaving > 0 && (
                                <Row
                                    label={`Promo Discount (${promoCode} · ${promoDiscount}%)`}
                                    value={`−৳${promoSaving.toLocaleString()}`}
                                    highlight
                                />
                            )}

                            <Divider />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Total Payable</span>
                                <span style={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>৳{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                style={{
                                    padding: '13px 28px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.15)',
                                    background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 14,
                                    fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                ← Edit Registration
                            </button>

                            <motion.button
                                type="button"
                                onClick={handleConfirm}
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: '14px 48px', borderRadius: 50, border: 'none',
                                    background: loading ? 'rgba(128,0,32,0.45)' : 'linear-gradient(135deg,#800020,#c0002a)',
                                    color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '0.05em',
                                    boxShadow: loading ? 'none' : '0 8px 24px rgba(128,0,32,0.45)',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                }}
                            >
                                {loading
                                    ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Processing…</>
                                    : `Confirm & Pay ৳${total.toLocaleString()} →`}
                            </motion.button>
                        </div>

                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 4 }}>
                            You will be redirected to PayStation secure checkout.
                        </p>
                    </motion.div>
                </div>
            </section>

            <FooterV2 />
            <ToastContainer position="bottom-right"
                toastStyle={{ background: '#1a000a', color: '#fff', border: '1px solid rgba(128,0,32,0.35)', borderRadius: 10 }} />
        </div>
    );
}
