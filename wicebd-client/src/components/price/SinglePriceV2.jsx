import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from 'react-bootstrap';
import { HashLink as Link } from 'react-router-hash-link';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SinglePriceV2 = ({ price }) => {
    const { icon, title, plan, list1, list2, list3, list4, list5, btnText } = price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ 
                y: -10,
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
            }}
            transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 10
            }}
            viewport={{ once: true }}
        >
            <Card className="h-100 border-0 shadow" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <Card.Body className="text-center p-4">
                    {/* Icon Header */}
                    <div className="icon-wrapper mb-3">
                        <motion.div
                            className="rounded-circle d-inline-flex align-items-center justify-content-center"
                            style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                border: '2px solid rgba(255, 255, 255, 0.3)'
                            }}
                            whileHover={{ rotate: 15 }}
                        >
                            <i className={`${icon} fs-3`} style={{ color: 'white' }}></i>
                        </motion.div>
                    </div>

                    {/* Title */}
                    <motion.h3 
                        className="text-white mb-3"
                        style={{ fontWeight: 600 }}
                        whileHover={{ color: '#ffeb3b' }}
                    >
                        {title}
                    </motion.h3>

                    {/* Price */}
                    <motion.div 
                        className="price-display mb-4"
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                    >
                        <span className="display-4 fw-bold text-white">
                            ${plan}
                        </span>
                    </motion.div>

                    {/* Features List */}
                    <ul className="features-list list-unstyled mb-4">
                        {[list1, list2, list3, list4, list5].map((item, index) => (
                            <motion.li 
                                key={index}
                                className="py-2 text-white"
                                initial={{ x: -20 }}
                                whileInView={{ x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ 
                                    x: 5,
                                    color: '#ffeb3b'
                                }}
                            >
                                <i className="bi bi-check-circle-fill me-2"></i>
                                {item}
                            </motion.li>
                        ))}
                    </ul>

                    {/* Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            as={Link} 
                            to="/buy-ticket#" 
                            variant="light" 
                            className="w-100 py-3 rounded-pill fw-bold"
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: '#ec407a',
                                border: 'none'
                            }}
                        >
                            {btnText}
                        </Button>
                    </motion.div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};

export default SinglePriceV2;