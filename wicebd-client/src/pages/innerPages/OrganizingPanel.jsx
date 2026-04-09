import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import SpeakerV1Data from '../../jsonData/speaker/SpeakerV1Data.json';

const executives = SpeakerV1Data.filter(m => m.id <= 18);
const organizers = SpeakerV1Data.filter(m => m.id >= 19);

const GOVERNING_BODY = [
    { id: 'g1', thumb: 'speaker-1.jpg',  name: 'MD Moin Uddin',      role: 'President',    subtitle: 'Dreams of Bangladesh' },
    { id: 'g2', thumb: 'speaker-2.jpg',  name: 'Mahadir Islam Wafi', role: 'CEO',           subtitle: 'Dreams of Bangladesh' },
    { id: 'g3', thumb: 'tamimh.jpeg',     name: 'Tamim Hossain',      role: 'CTO',           subtitle: 'Dreams of Bangladesh' },
    { id: 'g4', thumb: 'mahadi-shurov.jpeg', name: 'Mahadi Hasan Shurov', role: 'CIO & CFO', subtitle: 'Dreams of Bangladesh' },
];

const ROLE_BADGE = {
    'Event Chairperson':        { bg: 'linear-gradient(135deg,#800020,#4f0014)', label: 'Chairperson' },
    'Executive Director':       { bg: 'linear-gradient(135deg,#9e0028,#600018)', label: 'Executive Director' },
    'Associate Executive Director': { bg: 'linear-gradient(135deg,#6e001a,#3d000f)', label: 'Assoc. Exec. Director' },
    'Event Incharge':           { bg: 'rgba(128,0,32,0.22)', label: 'Event Incharge' },
    'Executive':                { bg: 'rgba(128,0,32,0.18)', label: 'Executive' },
    'Organizer':                { bg: 'rgba(255,255,255,0.12)', label: 'Organizer' },
};

/* Rank number for named executives */
const EXEC_RANK = {
    'Event Chairperson': '01',
    'Executive Director': '02',
    'Associate Executive Director': '03',
    'Event Incharge': '04',
};

const MemberCard = ({ member, index, dark }) => {
    const isEmpty = !member.name;
    const badge = ROLE_BADGE[member.designation] || ROLE_BADGE['Organizer'];
    const isLeader = member.designation === 'Event Chairperson' || member.designation === 'Executive Director';
    const isSenior = isLeader || member.designation === 'Associate Executive Director';
    const rank = EXEC_RANK[member.designation];

    return (
        <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.055, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            whileHover={!isEmpty ? {
                y: -8,
                boxShadow: dark
                    ? '0 28px 60px rgba(128,0,32,0.45), 0 0 0 1px rgba(128,0,32,0.35)'
                    : '0 28px 60px rgba(128,0,32,0.22), 0 0 0 1px rgba(128,0,32,0.2)',
            } : {}}
            style={{
                borderRadius: '22px',
                overflow: 'hidden',
                position: 'relative',
                background: isEmpty
                    ? (dark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.4)')
                    : (dark
                        ? (isSenior ? 'linear-gradient(160deg,rgba(128,0,32,0.14),rgba(20,0,8,0.95))' : 'rgba(255,255,255,0.065)')
                        : (isSenior ? 'linear-gradient(160deg,rgba(255,240,245,0.95),rgba(255,255,255,0.92))' : 'rgba(255,255,255,0.82)')),
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: dark
                    ? `1px solid rgba(255,255,255,${isEmpty ? '0.05' : (isSenior ? '0.15' : '0.1')})`
                    : `1px solid rgba(255,255,255,${isEmpty ? '0.45' : '0.95'})`,
                borderTop: isEmpty
                    ? `3px solid ${dark ? 'rgba(128,0,32,0.15)' : 'rgba(128,0,32,0.1)'}`
                    : (isSenior
                        ? '3px solid #800020'
                        : `3px solid ${dark ? 'rgba(128,0,32,0.4)' : 'rgba(128,0,32,0.28)'}`),
                boxShadow: isEmpty
                    ? 'none'
                    : (dark
                        ? (isSenior ? '0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)' : '0 8px 28px rgba(0,0,0,0.35)')
                        : (isSenior ? '0 12px 36px rgba(128,0,32,0.12), inset 0 1px 0 rgba(255,255,255,0.9)' : '0 8px 24px rgba(0,0,0,0.08)')),
                cursor: 'default',
                transition: 'box-shadow 0.35s ease, transform 0.35s ease',
                opacity: isEmpty ? 0.45 : 1,
            }}
        >
            {/* Subtle inner glow strip for senior named cards */}
            {isSenior && !isEmpty && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(128,0,32,0.8), transparent)',
                    zIndex: 3,
                }} />
            )}

            {/* Photo */}
            <div style={{ position: 'relative', overflow: 'hidden', height: '260px' }}>
                {isEmpty || !member.thumb ? (
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        background: dark
                            ? 'linear-gradient(180deg, rgba(128,0,32,0.07) 0%, rgba(0,0,0,0.28) 100%)'
                            : 'linear-gradient(180deg, rgba(128,0,32,0.04) 0%, rgba(0,0,0,0.05) 100%)',
                    }}>
                        <svg width="64" height="64" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.2 }}>
                            <circle cx="36" cy="26" r="16" fill={dark ? '#fff' : '#800020'} />
                            <path d="M4 68c0-17.673 14.327-32 32-32s32 14.327 32 32" fill={dark ? '#fff' : '#800020'} />
                        </svg>
                        <span style={{ fontSize: '10px', letterSpacing: '0.15em', fontWeight: 600, textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(128,0,32,0.25)' }}>
                            Coming Soon
                        </span>
                    </div>
                ) : (
                    <img
                        src={`/images/speakers/${member.thumb}`}
                        onError={e => { e.target.src = '/images/speakers/default.png'; }}
                        alt={member.name}
                        style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover', objectPosition: 'top center',
                            transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                )}

                {/* Rich gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: dark
                        ? 'linear-gradient(to top, rgba(13,0,6,0.85) 0%, rgba(13,0,6,0.2) 45%, transparent 75%)'
                        : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                {/* Rank number — top-left */}
                {rank && !isEmpty && (
                    <div style={{
                        position: 'absolute', top: '14px', left: '14px',
                        fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em',
                        color: isSenior ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                        background: isSenior ? 'rgba(128,0,32,0.7)' : 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(8px)',
                        padding: '3px 9px', borderRadius: '30px',
                        border: isSenior ? '1px solid rgba(255,100,100,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    }}>
                        {rank}
                    </div>
                )}

                {/* Senior star — top-right */}
                {isSenior && !isEmpty && (
                    <div style={{
                        position: 'absolute', top: '14px', right: '14px',
                        background: 'linear-gradient(135deg,#800020,#4f0014)',
                        borderRadius: '50%', width: '34px', height: '34px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(128,0,32,0.65)',
                        border: '1px solid rgba(255,255,255,0.15)',
                    }}>
                        <i className="fa fa-star" style={{ color: '#fff', fontSize: '12px' }}></i>
                    </div>
                )}
            </div>

            {/* Info panel */}
            <div style={{ padding: '16px 20px 22px', position: 'relative' }}>
                {/* Role badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    background: isEmpty
                        ? (dark ? 'rgba(255,255,255,0.05)' : 'rgba(128,0,32,0.04)')
                        : badge.bg,
                    fontSize: '9.5px', fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: isEmpty
                        ? (dark ? 'rgba(255,255,255,0.25)' : 'rgba(128,0,32,0.3)')
                        : (isSenior ? '#fff' : (dark ? 'rgba(255,255,255,0.85)' : '#800020')),
                    marginBottom: '9px',
                    border: isEmpty ? `1px dashed ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(128,0,32,0.12)'}` : 'none',
                }}>
                    {!isEmpty && isSenior && (
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.7)', display: 'inline-block', flexShrink: 0 }} />
                    )}
                    {badge.label}
                </div>

                {/* Name */}
                <div style={{
                    fontWeight: isEmpty ? 400 : 700,
                    fontSize: isEmpty ? '13px' : '15px',
                    color: isEmpty
                        ? (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)')
                        : (dark ? '#fff' : '#111'),
                    lineHeight: 1.3,
                    fontStyle: isEmpty ? 'italic' : 'normal',
                    letterSpacing: isEmpty ? '0' : '0.01em',
                }}>
                    {isEmpty ? '— TBA —' : member.name}
                </div>

                {/* Accent line for senior named members */}
                {isSenior && !isEmpty && (
                    <div style={{
                        marginTop: '10px', height: '2px', borderRadius: '2px',
                        background: 'linear-gradient(90deg, rgba(128,0,32,0.7), transparent)',
                        width: '40%',
                    }} />
                )}
            </div>
        </motion.div>
    );
};

const OrganizingPanel = () => {
    const [activeTab, setActiveTab] = useState('executives');

    const tabs = [
        { id: 'executives', label: 'Executives', icon: 'fa fa-users', count: executives.length },
        { id: 'organizers', label: 'Organizers', icon: 'fa fa-handshake-o', count: organizers.length },
    ];

    const members = activeTab === 'executives' ? executives : organizers;
    const isDark = activeTab === 'executives';

    return (
        <div className="page-wrapper">
            <span className="header-span"></span>
            <HeaderV1 headerStyle="header-style-two" parentMenu="organizing" />

            {/* Hero / Breadcrumb */}
            <section style={{
                position: 'relative',
                background: 'linear-gradient(160deg, #0d0006 0%, #1a000a 50%, #2a0010 100%)',
                padding: '160px 0 80px',
                overflow: 'hidden',
            }}>
                {/* Orbs */}
                <div style={{
                    position: 'absolute', width: '480px', height: '480px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(128,0,32,0.25), transparent 70%)',
                    top: '-100px', left: '-80px', filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', width: '320px', height: '320px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(128,0,32,0.18), transparent 70%)',
                    bottom: '-60px', right: '10%', filter: 'blur(50px)', pointerEvents: 'none',
                }} />

                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span style={{
                            display: 'inline-block', fontSize: '12px', textTransform: 'uppercase',
                            letterSpacing: '0.22em', fontWeight: 700, color: '#800020', marginBottom: '14px',
                        }}>WICEBD 2025</span>
                        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '48px', margin: '0 0 16px', lineHeight: 1.15 }}>
                            Organizing Panel
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.75 }}>
                            Meet the dedicated team behind the 8th World Invention Competition and Exhibition — Bangladesh.
                        </p>

                        {/* Breadcrumb */}
                        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
                            <span>Home</span>
                            <i className="fa fa-angle-right" style={{ fontSize: '11px' }}></i>
                            <span style={{ color: '#800020' }}>Organizing Panel</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Governing Body */}
            <section style={{
                position: 'relative',
                background: 'linear-gradient(160deg, #0d0006 0%, #1a000a 60%, #2a0010 100%)',
                padding: '72px 0 80px',
                borderBottom: '1px solid rgba(128,0,32,0.2)',
            }}>
                <div className="auto-container">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center', marginBottom: '48px' }}
                    >
                        <span style={{
                            display: 'inline-block', fontSize: '11px', textTransform: 'uppercase',
                            letterSpacing: '0.22em', fontWeight: 700, color: '#800020', marginBottom: '10px',
                        }}>Dreams of Bangladesh</span>
                        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '36px', margin: '0 0 10px', lineHeight: 1.2 }}>
                            Governing Body
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
                            The founding leaders of Dreams of Bangladesh powering WICEBD.
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                        gap: '24px',
                        maxWidth: '960px',
                        margin: '0 auto',
                    }}>
                        {GOVERNING_BODY.map((person, i) => (
                            <motion.div
                                key={person.id}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                whileHover={person.thumb ? { y: -6, boxShadow: '0 24px 52px rgba(128,0,32,0.45)' } : {}}
                                style={{
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.06)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderTop: '4px solid #800020',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                    cursor: 'default',
                                    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                                }}
                            >
                                {/* Photo */}
                                <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                                    {person.thumb ? (
                                        <img
                                            src={`/images/speakers/${person.thumb}`}
                                            alt={person.name}
                                            style={{
                                                width: '100%', height: '100%',
                                                objectFit: 'cover', objectPosition: 'top center',
                                                transition: 'transform 0.45s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'linear-gradient(180deg, rgba(128,0,32,0.12) 0%, rgba(0,0,0,0.25) 100%)',
                                        }}>
                                            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3 }}>
                                                <circle cx="36" cy="26" r="16" fill="#fff" />
                                                <path d="M4 68c0-17.673 14.327-32 32-32s32 14.327 32 32" fill="#fff" />
                                            </svg>
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)',
                                    }} />
                                    {/* Gold crown badge */}
                                    <div style={{
                                        position: 'absolute', top: '12px', right: '12px',
                                        background: 'linear-gradient(135deg,#b8860b,#8b6914)',
                                        borderRadius: '50%', width: '34px', height: '34px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(184,134,11,0.5)',
                                    }}>
                                        <i className="fa fa-star" style={{ color: '#fff', fontSize: '12px' }}></i>
                                    </div>
                                </div>

                                {/* Info */}
                                <div style={{ padding: '18px 20px 20px' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '3px 12px',
                                        borderRadius: '50px',
                                        background: 'linear-gradient(135deg,#800020,#4f0014)',
                                        fontSize: '10px', fontWeight: 700,
                                        letterSpacing: '0.12em', textTransform: 'uppercase',
                                        color: '#fff', marginBottom: '8px',
                                    }}>
                                        {person.role}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff', lineHeight: 1.3 }}>
                                        {person.name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                                        {person.subtitle}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tab Switcher + Cards */}
            <section style={{
                background: isDark
                    ? 'linear-gradient(160deg, #0d0006 0%, #1a000a 60%, #2a0010 100%)'
                    : 'linear-gradient(160deg, #f7f4fa 0%, #fdf0f4 50%, #f7f4fa 100%)',
                padding: '80px 0 100px',
                transition: 'background 0.4s ease',
            }}>
                <div className="auto-container">

                    {/* Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '60px', flexWrap: 'wrap' }}
                    >
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '12px 28px', borderRadius: '50px',
                                    border: activeTab === tab.id ? 'none' : '1px solid rgba(128,0,32,0.3)',
                                    background: activeTab === tab.id
                                        ? 'linear-gradient(135deg,#800020,#4f0014)'
                                        : 'transparent',
                                    color: activeTab === tab.id ? '#fff' : '#800020',
                                    fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                                    letterSpacing: '0.05em',
                                    boxShadow: activeTab === tab.id ? '0 8px 24px rgba(128,0,32,0.4)' : 'none',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <i className={tab.icon}></i>
                                {tab.label}
                                <span style={{
                                    background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'rgba(128,0,32,0.12)',
                                    borderRadius: '50px', padding: '1px 9px', fontSize: '12px', fontWeight: 800,
                                }}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </motion.div>

                    {/* Section heading */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + '-heading'}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            style={{ textAlign: 'center', marginBottom: '52px' }}
                        >
                            {activeTab === 'executives' ? (
                                <>
                                    <span style={{
                                        display: 'inline-block', fontSize: '11px', textTransform: 'uppercase',
                                        letterSpacing: '0.22em', fontWeight: 700, color: '#800020', marginBottom: '10px',
                                    }}>WICEBD 2025</span>
                                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '38px', margin: '0 0 12px', lineHeight: 1.15 }}>
                                        Executive Team
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', maxWidth: '460px', margin: '0 auto', lineHeight: 1.75 }}>
                                        The leadership driving WICEBD 2025 forward — from vision to execution.
                                    </p>
                                    {/* Decorative divider */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '22px' }}>
                                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, rgba(128,0,32,0.5))' }} />
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#800020', boxShadow: '0 0 8px rgba(128,0,32,0.8)' }} />
                                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, rgba(128,0,32,0.5))' }} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span style={{
                                        display: 'inline-block', fontSize: '11px', textTransform: 'uppercase',
                                        letterSpacing: '0.22em', fontWeight: 700, color: '#800020', marginBottom: '10px',
                                    }}>WICEBD 2025</span>
                                    <h2 style={{ color: '#111', fontWeight: 800, fontSize: '38px', margin: '0 0 12px', lineHeight: 1.15 }}>
                                        Organizer Team
                                    </h2>
                                    <p style={{ color: '#777', fontSize: '15px', maxWidth: '460px', margin: '0 auto', lineHeight: 1.75 }}>
                                        The dedicated volunteers making every detail of WICEBD 2025 possible.
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '22px' }}>
                                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, rgba(128,0,32,0.35))' }} />
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#800020', boxShadow: '0 0 8px rgba(128,0,32,0.5)' }} />
                                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, rgba(128,0,32,0.35))' }} />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Cards grid — named members featured, empty in tighter sub-grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Named members — larger grid */}
                            {(() => {
                                const named = members.filter(m => m.name);
                                const empty = members.filter(m => !m.name);
                                return (
                                    <>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                                            gap: '24px',
                                            marginBottom: empty.length ? '32px' : 0,
                                        }}>
                                            {named.map((member, i) => (
                                                <MemberCard key={member.id} member={member} index={i} dark={isDark} />
                                            ))}
                                        </div>

                                        {empty.length > 0 && (
                                            <>
                                                {/* Empty cards section label */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    marginBottom: '20px',
                                                }}>
                                                    <div style={{ flex: 1, height: '1px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' }} />
                                                    <span style={{
                                                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em',
                                                        textTransform: 'uppercase',
                                                        color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
                                                    }}>More to be announced</span>
                                                    <div style={{ flex: 1, height: '1px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' }} />
                                                </div>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                                    gap: '16px',
                                                }}>
                                                    {empty.map((member, i) => (
                                                        <MemberCard key={member.id} member={member} index={named.length + i} dark={isDark} />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            <FooterV2 />
        </div>
    );
};

export default OrganizingPanel;
