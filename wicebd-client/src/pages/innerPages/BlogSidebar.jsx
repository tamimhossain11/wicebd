import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import { motion } from 'framer-motion';
import BlogPageContent from '../../components/blog/BlogPageContent';
import { useParams } from 'react-router-dom';
import LatestPostV1 from '../../jsonData/blog/LatestPostV1.json';

const BlogSidebar = () => {
    const { id } = useParams();
    const data = LatestPostV1.filter(p => p.id === parseInt(id))[0];

    return (
        <div className="page-wrapper" style={{ background: 'linear-gradient(160deg,#0a0004 0%,#160008 60%,#220010 100%)' }}>
            <span className="header-span" />
            <HeaderV1 headerStyle="header-style-two" parentMenu="blog" />

            <section style={{
                position: 'relative', padding: '160px 0 72px', overflow: 'hidden',
                background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
            }}>
                <div style={{
                    position: 'absolute', width: 420, height: 420, borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(128,0,32,0.18),transparent 70%)',
                    top: -140, left: -80, filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 700, color: '#c0002a', display: 'block', marginBottom: 12 }}>
                            WICEBD — Blog
                        </span>
                        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(28px,4.5vw,48px)', margin: '0 0 14px', lineHeight: 1.1 }}>
                            Blog <span style={{
                                background: 'linear-gradient(135deg,#fff 0%,#ffb8c8 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>Sidebar</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)', padding: '40px 0 100px' }}>
                <div className="auto-container">
                    <BlogPageContent sidebarInfo={data} />
                </div>
            </section>

            <FooterV2 />
        </div>
    );
};

export default BlogSidebar;
