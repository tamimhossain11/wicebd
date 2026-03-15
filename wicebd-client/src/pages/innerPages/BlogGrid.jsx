import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import { motion } from 'framer-motion';
import BlogGridContent from '../../components/blog/BlogGridContent';

const BlogGrid = () => (
    <div className="page-wrapper" style={{ background: 'linear-gradient(160deg,#0a0004 0%,#160008 60%,#220010 100%)' }}>
        <span className="header-span" />
        <HeaderV1 headerStyle="header-style-two" parentMenu="blog" />

        {/* Hero */}
        <section style={{
            position: 'relative', padding: '160px 0 80px', overflow: 'hidden',
            background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
        }}>
            <div style={{
                position: 'absolute', width: 480, height: 480, borderRadius: '50%',
                background: 'radial-gradient(circle,rgba(128,0,32,0.18),transparent 70%)',
                top: -160, right: -80, filter: 'blur(60px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
                backgroundSize: '60px 60px',
            }} />
            <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                    style={{
                        width: 80, height: 80, borderRadius: 20, margin: '0 auto 24px',
                        background: 'linear-gradient(135deg,#800020,#4f0014)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 32px rgba(128,0,32,0.5)',
                    }}
                >
                    <i className="fa fa-newspaper" style={{ color: '#fff', fontSize: 32 }} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 700, color: '#c0002a', display: 'block', marginBottom: 12 }}>
                        WICEBD — Latest Updates
                    </span>
                    <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(28px,5vw,52px)', margin: '0 0 16px', lineHeight: 1.1 }}>
                        News &amp; <span style={{
                            background: 'linear-gradient(135deg,#fff 0%,#ffb8c8 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>Blog</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 16, lineHeight: 1.8, maxWidth: 460, margin: '0 auto' }}>
                        Stories, announcements and insights from Dreams of Bangladesh and the WICEBD community.
                    </p>
                </motion.div>
            </div>
        </section>

        {/* Blog grid content */}
        <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)', padding: '64px 0 100px' }}>
            <div className="auto-container">
                <BlogGridContent />
            </div>
        </section>

        <FooterV2 />
    </div>
);

export default BlogGrid;
