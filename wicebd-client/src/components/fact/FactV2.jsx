import React from 'react';
import { Container, Row } from 'react-bootstrap';
import FactV2Data from '../../jsonData/fact/FactV2Data.json';
import SingleFactV2 from './SingleFactV2';
import { motion } from 'framer-motion';

const FactV2 = () => {
    const orbs = [
        { w: 400, left: '-80px', top: '20%', color: 'rgba(128,0,32,0.18)' },
        { w: 300, left: '70%',   top: '-60px', color: 'rgba(128,0,32,0.12)' },
        { w: 250, left: '40%',   top: '60%',   color: 'rgba(255,255,255,0.04)' },
    ];

    return (
        <motion.section
            className="position-relative overflow-hidden"
            style={{
                background: 'linear-gradient(160deg, #0a0610 0%, #12040c 50%, #0a0610 100%)',
                padding: '110px 0',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            {/* Real photo — space/innovation feel */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=60')",
                backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07,
            }} />

            {/* Ambient maroon orbs */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {orbs.map((orb, i) => (
                    <motion.div key={i}
                        style={{
                            position: 'absolute', borderRadius: '50%',
                            width: orb.w, height: orb.w,
                            left: orb.left, top: orb.top,
                            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
                            filter: 'blur(50px)',
                        }}
                        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
                        transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            <Container style={{ position: 'relative', zIndex: 2 }}>
                {/* Section title */}
                <motion.div
                    className="text-center"
                    style={{ marginBottom: '60px' }}
                    initial={{ y: -30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span style={{
                        display: 'inline-block', fontSize: '12px', textTransform: 'uppercase',
                        letterSpacing: '0.2em', color: '#800020', fontWeight: 700, marginBottom: '12px',
                    }}>By The Numbers</span>
                    <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '40px', margin: 0 }}>
                        WICEBD in Numbers
                    </h2>
                </motion.div>

                <Row className="g-4 justify-content-center">
                    {FactV2Data.map((fact) => (
                        <SingleFactV2 fact={fact} key={fact.id} />
                    ))}
                </Row>
            </Container>
        </motion.section>
    );
};

export default FactV2;