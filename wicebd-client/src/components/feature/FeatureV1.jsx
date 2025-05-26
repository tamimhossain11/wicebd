import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import featureV1Data from '../../jsonData/feature/featureV1Data.json';
import SingleFeatureV1 from './SingleFeatureV1';
import 'bootstrap-icons/font/bootstrap-icons.css';

const FeatureV1 = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <motion.section 
            className="py-5 position-relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
        >
            {/* Animated decorative elements */}
            <div className="position-absolute w-100 h-100 top-0 start-0">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="position-absolute"
                        style={{
                            width: '150px',
                            height: '150px',
                            border: '2px dashed rgba(13, 110, 253, 0.3)',
                            borderRadius: '50%',
                            left: `${i * 25}%`,
                            top: `${i * 20}%`
                        }}
                        animate={{
                            rotate: 360,
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 20 + i * 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <Container>
                <Row className="mb-5">
                    <Col lg={4} className="mb-4 mb-lg-0">
                        <motion.div 
                            className="h-100 p-4"
                            variants={itemVariants}
                            whileHover={{ 
                                y: -5,
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-grid-3x3-gap-fill fs-1 me-3 text-primary"></i>
                                <div>
                                    <span className="text-uppercase text-muted fw-bold letter-spacing-1">
                                        Segments
                                    </span>
                                    <h2 className="display-6 fw-bold mb-0">Our Segments</h2>
                                </div>
                            </div>
                            <p className="text-muted">
                                Explore the diverse competition categories designed to showcase innovation across multiple disciplines.
                            </p>
                        </motion.div>
                    </Col>

                    {featureV1Data.map((feature) => (
                        <Col lg={4} md={6} key={feature.id} className="mb-4">
                            <SingleFeatureV1 feature={feature} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </motion.section>
    );
};

export default FeatureV1;