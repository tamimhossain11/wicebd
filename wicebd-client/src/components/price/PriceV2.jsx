import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import PriceV2Data from '../../jsonData/price/PriceV2Data.json';
import SinglePriceV2 from './SinglePriceV2';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PriceV2 = ({ pricingClass }) => {
    return (
        <motion.section 
            className={`py-5 position-relative overflow-hidden ${pricingClass}`}
            style={{
                background: 'linear-gradient(to bottom, #ec407a, #6a0f24)',
                color: 'white'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Animated decorative elements */}
            <div className="position-absolute w-100 h-100 top-0 start-0">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="position-absolute rounded-circle"
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            width: `${Math.random() * 200 + 50}px`,
                            height: `${Math.random() * 200 + 50}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1],
                            rotate: [0, 180]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                ))}
            </div>

            <Container>
                <motion.div
                    className="text-center mb-5"
                    initial={{ y: -50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="d-block text-uppercase mb-2" style={{ 
                        letterSpacing: '2px',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        <i className="bi bi-ticket-perforated me-2"></i>
                        Get Ticket
                    </span>
                    <h2 className="display-5 fw-bold mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        Choose a Ticket
                    </h2>
                </motion.div>

                <Row className="g-4 justify-content-center">
                    {PriceV2Data.map((price) => (
                        <Col lg={4} md={6} key={price.id}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                whileHover={{ 
                                    y: -10,
                                    boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
                                }}
                                transition={{ 
                                    type: 'spring',
                                    stiffness: 100,
                                    delay: price.id * 0.1
                                }}
                                viewport={{ once: true }}
                            >
                                <SinglePriceV2 price={price} />
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </motion.section>
    );
};

export default PriceV2;