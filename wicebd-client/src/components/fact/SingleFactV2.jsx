import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Card, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SingleFactV2 = ({ fact }) => {
    const { icon, end, title, iconColor = 'text-primary' } = fact;

    return (
        <Col lg={3} md={6} sm={12} className="mb-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                    type: 'spring', 
                    stiffness: 100,
                    delay: fact.delay ? fact.delay / 1000 : 0 
                }}
                whileHover={{
                    y: -5,
                    scale: 1.03,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}
            >
                <Card 
                    className="h-100 border-0 shadow-sm text-center p-4"
                    style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <div className="position-relative">
                        <motion.div
                            className="position-absolute"
                            style={{
                                top: -20,
                                right: -20,
                                width: 60,
                                height: 60,
                                background: 'rgba(13, 110, 253, 0.1)',
                                borderRadius: '50%',
                                zIndex: 0
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />
                        <i className={`${icon} ${iconColor}`} style={{
                            fontSize: '2.5rem',
                            position: 'relative',
                            zIndex: 1,
                            marginBottom: '1rem'
                        }}></i>
                    </div>
                    
                    <h2 className="display-5 fw-bold mb-3" style={{ color: '#212529' }}>
                        <CountUp 
                            end={end} 
                            enableScrollSpy 
                            duration={3} 
                            suffix="+"
                        />
                    </h2>
                    
                    <h5 className="text-muted" style={{ minHeight: '3rem' }}>
                        {title}
                    </h5>
                    
                    <motion.div
                        className="mx-auto"
                        style={{
                            height: '3px',
                            width: '50px',
                            background: 'linear-gradient(90deg, #0d6efd, #6f42c1)'
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    />
                </Card>
            </motion.div>
        </Col>
    );
};

export default SingleFactV2;