import React from 'react';
import { Container, Row } from 'react-bootstrap';
import FactV2Data from '../../jsonData/fact/FactV2Data.json';
import SingleFactV2 from './SingleFactV2';
import { motion } from 'framer-motion';

const FactV2 = () => {
    return (
        <motion.section 
            className="py-5 position-relative overflow-hidden"
            style={{
            backgroundImage: "url(../images/background/9.png)" ,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Animated background elements */}
            <div className="position-absolute top-0 start-0 w-100 h-100">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="position-absolute rounded-circle"
                        style={{
                            background: "rgba(13, 110, 253, 0.05)",
                            width: `${Math.random() * 200 + 100}px`,
                            height: `${Math.random() * 200 + 100}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            y: [0, Math.random() * 40 - 20],
                            x: [0, Math.random() * 40 - 20],
                            opacity: [0.1, 0.2, 0.1]
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
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Row className="g-4 justify-content-center">
                        {FactV2Data.map((fact) => (
                            <SingleFactV2 fact={fact} key={fact.id} />
                        ))}
                    </Row>
                </motion.div>
            </Container>
        </motion.section>
    );
};

export default FactV2;