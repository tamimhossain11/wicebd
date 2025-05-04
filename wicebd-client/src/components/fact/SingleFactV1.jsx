import React from 'react';
import CountUp from 'react-countup';
import ReactWOW from 'react-wow';

const SingleFactV1 = ({ fact }) => {
    const { icon, end, info, animation, delay } = fact

    return (
        <>
            <ReactWOW animation={animation} delay={delay}>
                <div className="count-box">
                    <span className={`icon ${icon}`}></span>
                    <span className="count-text">
                        <CountUp duration={3} end={end} enableScrollSpy />
                    </span>
                    <h4 className="counter-title">{info}</h4>
                </div>
            </ReactWOW>
        </>
    );
};

export default SingleFactV1;