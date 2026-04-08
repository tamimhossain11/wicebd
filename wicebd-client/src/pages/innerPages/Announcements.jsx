import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/* ─── helpers ─── */
const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const AUDIENCE_LABEL = {
    all: 'General',
    project: 'Project',
    olympiad: 'Olympiad',
    robo_soccer: 'Robo Soccer',
    event_registered: 'Registered',
};

/* ─── Audience badge ─── */
const AudienceBadge = ({ audience }) => (
    <span style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em',
        color: '#c0002a', background: 'rgba(192,0,42,0.12)',
        border: '1px solid rgba(192,0,42,0.3)', borderRadius: 50,
        padding: '3px 10px', flexShrink: 0,
    }}>
        {AUDIENCE_LABEL[audience] || audience}
    </span>
);

/* ─── HUD corner brackets ─── */
const HudCorners = ({ color = 'rgba(192,0,42,0.5)', size = 11, offset = 7 }) => {
    const s = { position: 'absolute', width: size, height: size };
    const b = `1.5px solid ${color}`;
    return (
        <>
            <div style={{ ...s, top: offset, left: offset, borderTop: b, borderLeft: b }} />
            <div style={{ ...s, top: offset, right: offset, borderTop: b, borderRight: b }} />
            <div style={{ ...s, bottom: offset, left: offset, borderBottom: b, borderLeft: b }} />
            <div style={{ ...s, bottom: offset, right: offset, borderBottom: b, borderRight: b }} />
        </>
    );
};

/* ─── Skeleton loader card ─── */
const SkeletonCard = () => (
    <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, overflow: 'hidden',
    }}>
        <div style={{ height: 200, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ padding: '20px 22px' }}>
            <div style={{ height: 12, width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 12 }} />
            <div style={{ height: 18, width: '80%', background: 'rgba(255,255,255,0.08)', borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 14, width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: 6 }} />
        </div>
    </div>
);

/* ─── Featured (hero) news card ─── */
const FeaturedCard = ({ item, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => onClick(item)}
        style={{
            position: 'relative', borderRadius: 22, overflow: 'hidden',
            cursor: 'pointer', marginBottom: 28,
            border: '1px solid rgba(192,0,42,0.25)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
    >
        {/* Background */}
        {item.image_url ? (
            <div style={{ position: 'relative', height: 440 }}>
                <img src={item.image_url} alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(5,0,12,0.96) 0%, rgba(5,0,12,0.5) 50%, rgba(5,0,12,0.15) 100%)',
                }} />
            </div>
        ) : (
            <div style={{
                height: 280,
                background: 'linear-gradient(135deg, #1a0008 0%, #2a0012 60%, #0d0006 100%)',
            }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(192,0,42,0.25), transparent 70%)',
                    filter: 'blur(30px)',
                }} />
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    fontSize: 56, opacity: 0.15, userSelect: 'none',
                }}>
                    <i className="fa fa-newspaper" style={{ color: '#c0002a' }} />
                </div>
            </div>
        )}

        {/* Content overlay */}
        <div style={{
            position: item.image_url ? 'absolute' : 'relative',
            bottom: 0, left: 0, right: 0,
            padding: '32px 36px',
            background: item.image_url ? 'transparent' : 'rgba(5,0,12,0.9)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em',
                    color: '#fff', background: 'linear-gradient(135deg,#800020,#c0002a)',
                    borderRadius: 50, padding: '4px 14px',
                }}>
                    Latest
                </span>
                <AudienceBadge audience={item.target_audience} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginLeft: 'auto' }}>
                    <i className="fa fa-calendar-alt" style={{ marginRight: 5 }} />
                    {formatDate(item.created_at)}
                </span>
            </div>
            <h2 style={{
                color: '#fff', fontWeight: 800,
                fontSize: 'clamp(20px, 3vw, 30px)',
                margin: '0 0 10px', lineHeight: 1.25,
            }}>
                {item.title}
            </h2>
            <p style={{
                color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0,
                lineHeight: 1.7, maxWidth: 700,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
                {item.body}
            </p>
            <div style={{
                marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 7,
                color: '#c0002a', fontSize: 13, fontWeight: 700,
            }}>
                Read More <i className="fa fa-arrow-right" style={{ fontSize: 11 }} />
            </div>
        </div>
        <HudCorners color="rgba(192,0,42,0.4)" size={13} offset={10} />
    </motion.div>
);

/* ─── Regular news card ─── */
const NewsCard = ({ item, index, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.07, duration: 0.5 }}
        whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
        onClick={() => onClick(item)}
        style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderTop: '2px solid #800020',
            borderRadius: 18, overflow: 'hidden',
            cursor: 'pointer', position: 'relative',
            transition: 'box-shadow 0.3s ease',
        }}
    >
        {/* Poster */}
        {item.image_url ? (
            <div style={{ height: 190, overflow: 'hidden', position: 'relative' }}>
                <img src={item.image_url} alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(5,0,12,0.6) 0%, transparent 60%)',
                }} />
            </div>
        ) : (
            <div style={{
                height: 120,
                background: 'linear-gradient(135deg, rgba(128,0,32,0.18) 0%, rgba(64,0,16,0.25) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <i className="fa fa-newspaper" style={{ fontSize: 36, color: 'rgba(192,0,42,0.35)' }} />
            </div>
        )}

        <div style={{ padding: '18px 20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <AudienceBadge audience={item.target_audience} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' }}>
                    {formatDate(item.created_at)}
                </span>
            </div>
            <h4 style={{
                color: '#fff', fontWeight: 700, fontSize: 16,
                margin: '0 0 8px', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
                {item.title}
            </h4>
            <p style={{
                color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0,
                lineHeight: 1.7,
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
                {item.body}
            </p>
        </div>
        <HudCorners size={9} offset={6} />
    </motion.div>
);

/* ─── Full-screen detail modal ─── */
const NewsModal = ({ item, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const onKey = e => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
            }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                style={{
                    background: 'linear-gradient(160deg, #0d0006 0%, #1a000a 100%)',
                    border: '1px solid rgba(192,0,42,0.3)',
                    borderRadius: 22, maxWidth: 720, width: '100%',
                    maxHeight: '90vh', overflowY: 'auto',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
                    position: 'relative',
                }}
            >
                {/* Close button */}
                <button onClick={onClose} style={{
                    position: 'sticky', top: 0, float: 'right', marginTop: 16, marginRight: 16,
                    width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.8)',
                    cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 10,
                }} aria-label="Close">
                    ×
                </button>

                {/* Poster */}
                {item.image_url && (
                    <div style={{ borderRadius: '22px 22px 0 0', overflow: 'hidden', maxHeight: 340 }}>
                        <img src={item.image_url} alt={item.title}
                            style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }} />
                    </div>
                )}

                <div style={{ padding: '28px 32px 36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                        <AudienceBadge audience={item.target_audience} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                            <i className="fa fa-calendar-alt" style={{ marginRight: 5 }} />
                            {formatDate(item.created_at)}
                        </span>
                    </div>
                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(20px,3vw,28px)', margin: '0 0 18px', lineHeight: 1.3 }}>
                        {item.title}
                    </h2>
                    <div style={{
                        color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.85,
                        whiteSpace: 'pre-wrap',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        paddingTop: 18,
                    }}>
                        {item.body}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ─── Empty state ─── */
const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ textAlign: 'center', padding: '80px 20px' }}
    >
        <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
            background: 'rgba(128,0,32,0.1)', border: '1px solid rgba(128,0,32,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <i className="fa fa-newspaper" style={{ fontSize: 30, color: 'rgba(192,0,42,0.5)' }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15, margin: 0 }}>No news published yet. Check back soon.</p>
    </motion.div>
);

/* ─── Main page ─── */
const Announcements = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        axios.get(`${backendUrl}/api/announcements`)
            .then(res => setNews(res.data?.announcements || []))
            .catch(() => setNews([]))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all'
        ? news
        : news.filter(n => n.target_audience === filter || n.target_audience === 'all');

    const featured = filtered[0] || null;
    const rest = filtered.slice(1);

    const FILTERS = [
        { value: 'all', label: 'All News' },
        { value: 'project', label: 'Project' },
        { value: 'olympiad', label: 'Olympiad' },
        { value: 'robo_soccer', label: 'Robo Soccer' },
    ];

    return (
        <div className="page-wrapper">
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" />

            {/* ── Hero ── */}
            <section style={{
                position: 'relative',
                background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)',
                padding: '160px 0 72px', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(rgba(128,0,32,0.15) 1px, transparent 1px)',
                    backgroundSize: '34px 34px',
                    maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%)',
                }} />
                <div style={{
                    position: 'absolute', width: 480, height: 480, borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(128,0,32,0.2),transparent 70%)',
                    top: -120, left: -80, filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 10,
                            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em',
                            fontWeight: 700, color: '#800020', marginBottom: 18,
                        }}>
                            <span style={{ width: 36, height: 1, background: 'linear-gradient(90deg,transparent,#800020)', display: 'inline-block' }} />
                            WICE Bangladesh
                            <span style={{ width: 36, height: 1, background: 'linear-gradient(90deg,#800020,transparent)', display: 'inline-block' }} />
                        </span>
                        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(32px,5vw,52px)', margin: '0 0 14px', lineHeight: 1.12 }}>
                            News &amp; <span style={{ color: '#800020' }}>Announcements</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
                            Stay up to date with the latest news, competition updates, and official announcements from WICE Bangladesh.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Content ── */}
            <section style={{
                background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
                padding: '60px 0 100px',
            }}>
                <div className="auto-container">

                    {/* Filter tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 48 }}
                    >
                        {FILTERS.map(f => (
                            <button key={f.value} onClick={() => setFilter(f.value)} style={{
                                padding: '9px 22px', borderRadius: 50, cursor: 'pointer',
                                fontWeight: 700, fontSize: 13, letterSpacing: '0.04em',
                                border: filter === f.value ? 'none' : '1px solid rgba(255,255,255,0.12)',
                                background: filter === f.value
                                    ? 'linear-gradient(135deg,#800020,#c0002a)'
                                    : 'rgba(255,255,255,0.04)',
                                color: filter === f.value ? '#fff' : 'rgba(255,255,255,0.5)',
                                boxShadow: filter === f.value ? '0 4px 18px rgba(128,0,32,0.4)' : 'none',
                                transition: 'all 0.25s ease',
                            }}>
                                {f.label}
                            </button>
                        ))}
                        {!loading && (
                            <span style={{
                                marginLeft: 'auto', alignSelf: 'center',
                                fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600,
                            }}>
                                {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
                            </span>
                        )}
                    </motion.div>

                    {/* Loading skeletons */}
                    {loading && (
                        <div>
                            <div style={{ height: 400, background: 'rgba(255,255,255,0.04)', borderRadius: 22, marginBottom: 28, animation: 'pulse 1.5s infinite' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 20 }}>
                                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && (
                        <AnimatePresence mode="wait">
                            <motion.div key={filter}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {filtered.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    <>
                                        {/* Featured card */}
                                        {featured && (
                                            <FeaturedCard item={featured} onClick={setSelected} />
                                        )}

                                        {/* Rest grid */}
                                        {rest.length > 0 && (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))',
                                                gap: 22,
                                            }}>
                                                {rest.map((item, i) => (
                                                    <NewsCard key={item.id} item={item} index={i} onClick={setSelected} />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </section>

            {/* Detail modal */}
            <AnimatePresence>
                {selected && <NewsModal item={selected} onClose={() => setSelected(null)} />}
            </AnimatePresence>

            <FooterV2 />

            {/* Pulse keyframe */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default Announcements;
