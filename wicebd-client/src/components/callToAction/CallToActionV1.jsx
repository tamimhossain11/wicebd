import React from 'react';
import { motion } from 'framer-motion';
import { Container, Button } from 'react-bootstrap';
import { HashLink as Link } from 'react-router-hash-link';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CallToActionV1 = () => {
    return (
        <motion.section 
            className="py-5 position-relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, rgba(63,81,181,0.9) 0%, rgba(233,30,99,0.9) 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Animated background elements */}
            <div className="position-absolute top-0 start-0 w-100 h-100">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="position-absolute rounded-circle"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            width: `${Math.random() * 300 + 100}px`,
                            height: `${Math.random() * 300 + 100}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            y: [0, Math.random() * 100 - 50],
                            x: [0, Math.random() * 100 - 50],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: Math.random() * 15 + 10,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                ))}
            </div>

            <Container>
                <motion.div
                    className="text-center text-white p-4 p-lg-5"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="d-inline-block mb-3 px-3 py-1 rounded-pill"
                        style={{ 
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(5px)'
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <i className="bi bi-trophy-fill me-2"></i>
                        <span className="fw-bold">WICE 2025 BANGLADESH</span>
                    </motion.div>

                    <motion.h2 
                        className="display-4 fw-bold mb-4"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        7th World Invention Competition <br /> 
                        & Exhibition 2025
                    </motion.h2>

                    <motion.p 
                        className="lead mb-5 mx-auto"
                        style={{ 
                            maxWidth: '800px',
                            backdropFilter: 'blur(5px)',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '1.5rem',
                            borderRadius: '12px'
                        }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Bangladesh proudly hosts the National Round of WICE 2025, following consecutive Gold Medal wins. 
                        Organized with IYSA, this event empowers students from elementary to university levels to showcase 
                        innovations in science, technology, and social impact. Top teams will represent Bangladesh at 
                        WICE 2025 in Malaysia.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            as={Link} 
                            to="/contact#" 
                            variant="light" 
                            size="lg" 
                            className="rounded-pill px-4 py-3 fw-bold"
                            style={{
                                background: 'white',
                                color: '#3f51b5',
                                border: 'none'
                            }}
                        >
                            <i className="bi bi-envelope-fill me-2"></i>
                            Contact Us
                        </Button>
                    </motion.div>

                    <motion.div 
                        className="mt-5 pt-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            {[
                                'Logo & company details',
                                'Dedicated blog posts',
                                'Award acknowledgments',
                                'Opening/closing ceremonies'
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="px-3 py-2 rounded-pill"
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(5px)'
                                    }}
                                    whileHover={{ 
                                        y: -3,
                                        background: 'rgba(255,255,255,0.3)'
                                    }}
                                >
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </Container>
        </motion.section>
    );
};

export default CallToActionV1;