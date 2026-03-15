import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import { motion } from 'framer-motion';
import BlogSingleContent from '../../components/blog/BlogSingleContent';
import { useParams } from 'react-router-dom';
import BlogContentV1Data from '../../jsonData/blog/BlogContentV1Data.json';

const BlogSingle = () => {
    const { id } = useParams();
    const data = BlogContentV1Data.filter(p => p.id === parseInt(id))[0];

    return (
        <div className="page-wrapper" style={{ background: 'linear-gradient(160deg,#0a0004 0%,#160008 60%,#220010 100%)' }}>
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" parentMenu="blog" />

            <section style={{
                position: 'relative', padding: '160px 0 72px', overflow: 'hidden',
                background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
            }}>
                <div style={{
                    position: 'absolute', width: 440, height: 440, borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(128,0,32,0.18),transparent 70%)',
                    top: -140, right: -80, filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />
                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 700, color: '#c0002a', display: 'block', marginBottom: 12 }}>
                            WICEBD — Article
                        </span>
                        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(28px,4.5vw,48px)', margin: '0 0 14px', lineHeight: 1.1 }}>
                            Blog <span style={{
                                background: 'linear-gradient(135deg,#fff 0%,#ffb8c8 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>Post</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)', padding: '40px 0 100px' }}>
                <div className="auto-container">
                    <BlogSingleContent blogInfo={data} />
                </div>
            </section>

            <FooterV2 />
        </div>
    );
};

export default BlogSingle;
