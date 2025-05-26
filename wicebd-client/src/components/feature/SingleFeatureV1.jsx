import React from 'react';
import { motion } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SingleFeatureV1 = ({ feature }) => {
    const { icon, title, text } = feature;

    return (
        <motion.div
            className="h-100"
            initial={{ opacity: 0, y: 50 }}
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
            <div 
                className="inner-box h-100 p-4 position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.95) 100%)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}
            >
                {/* Gradient accent (15% height) */}
                <div 
                    className="position-absolute top-0 start-0 w-100"
                    style={{
                        height: '6%',
                        background: 'linear-gradient(to bottom, #ec407a, #6a0f24)'
                    }}
                />

                <div className="icon-box mb-4">
                    <motion.div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle"
                        style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, rgba(236, 64, 122, 0.1) 0%, rgba(106, 15, 36, 0.1) 100%)',
                            border: '2px solid rgba(236, 64, 122, 0.3)'
                        }}
                        whileHover={{ rotate: 15 }}
                    >
                        <i className={`${icon} fs-3`} style={{ color: '#ec407a' }}></i>
                    </motion.div>
                </div>

                <motion.h4 
                    className="mb-3"
                    whileHover={{ color: '#ec407a' }}
                >
                    <Link 
                        to="/about-us#" 
                        className="text-decoration-none text-dark"
                        style={{ transition: 'color 0.3s ease' }}
                    >
                        {title}
                    </Link>
                </motion.h4>

                <motion.div 
                    className="text-muted"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {text}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SingleFeatureV1;