import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import SpeakerV1Data from '../../jsonData/speaker/SpeakerV1Data.json';

const executives = SpeakerV1Data.filter(m => m.id <= 18);
const organizers = SpeakerV1Data.filter(m => m.id >= 19);

const ROLE_BADGE = {
    'Event Chairperson': { bg: 'linear-gradient(135deg,#800020,#4f0014)', label: 'Chairperson' },
    'Executive Director': { bg: 'linear-gradient(135deg,#9e0028,#600018)', label: 'Executive Director' },
    'Executive': { bg: 'rgba(128,0,32,0.18)', label: 'Executive' },
    'Organizer': { bg: 'rgba(255,255,255,0.12)', label: 'Organizer' },
};

const MemberCard = ({ member, index, dark }) => {
    const badge = ROLE_BADGE[member.designation] || ROLE_BADGE['Organizer'];
    const isLeader = member.designation === 'Event Chairperson' || member.designation === 'Executive Director';

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.5 }}
            whileHover={{ y: -6, boxShadow: dark
                ? '0 24px 52px rgba(128,0,32,0.35)'
                : '0 24px 52px rgba(128,0,32,0.18)' }}
            style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: dark ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(255,255,255,0.9)',
                borderTop: isLeader ? '4px solid #800020' : `3px solid ${dark ? 'rgba(128,0,32,0.5)' : 'rgba(128,0,32,0.3)'}`,
                boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 28px rgba(0,0,0,0.09)',
                cursor: 'default',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            }}
        >
            {/* Photo */}
            <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                <img
                    src={`/images/speakers/${member.thumb}`}
                    onError={e => { e.target.src = '/images/speakers/default.png'; }}
                    alt={member.name}
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'top center',
                        transition: 'transform 0.45s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)',
                }} />
                {/* Leader star badge */}
                {isLeader && (
                    <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'linear-gradient(135deg,#800020,#4f0014)',
                        borderRadius: '50%', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(128,0,32,0.6)',
                    }}>
                        <i className="fa fa-star" style={{ color: '#fff', fontSize: '13px' }}></i>
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: '18px 20px 20px' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '3px 12px',
                    borderRadius: '50px',
                    background: badge.bg,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: (member.designation === 'Event Chairperson' || member.designation === 'Executive Director') ? '#fff' : (dark ? 'rgba(255,255,255,0.8)' : '#800020'),
                    marginBottom: '8px',
                }}>
                    {badge.label}
                </div>
                <div style={{
                    fontWeight: 700,
                    fontSize: '15px',
                    color: dark ? '#fff' : '#111',
                    lineHeight: 1.3,
                }}>
                    {member.name}
                </div>
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

            {/* Tab Switcher */}
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
                                    padding: '12px 28px',
                                    borderRadius: '50px',
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
                                    borderRadius: '50px', padding: '1px 9px',
                                    fontSize: '12px', fontWeight: 800,
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
                            style={{ textAlign: 'center', marginBottom: '44px' }}
                        >
                            {activeTab === 'executives' ? (
                                <>
                                    <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '36px', margin: '0 0 10px' }}>
                                        Executive Team
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
                                        The leadership driving WICEBD 2025 forward — from vision to execution.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 style={{ color: '#111', fontWeight: 700, fontSize: '36px', margin: '0 0 10px' }}>
                                        Organizer Team
                                    </h2>
                                    <p style={{ color: '#777', fontSize: '15px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
                                        The dedicated volunteers making every detail of WICEBD 2025 possible.
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Cards grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '22px',
                            }}
                        >
                            {members.map((member, i) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    index={i}
                                    dark={isDark}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            <FooterV2 />
        </div>
    );
};

export default OrganizingPanel;
