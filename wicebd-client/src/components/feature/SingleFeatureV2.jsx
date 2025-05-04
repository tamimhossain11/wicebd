import React from 'react';
import ReactWOW from 'react-wow';
import { HashLink as Link } from 'react-router-hash-link'

const SingleFeatureV2 = ({ feature }) => {
    const { animation, icon, name, text, btnText, delay } = feature

    return (
        <>
            <ReactWOW animation={animation} delay={delay}>
                <div className="feature-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                        <div className="icon-box"><span className={icon}></span></div>
                        <h4><Link to="/about-us#">{name}</Link></h4>
                        <div className="text">{text}</div>
                        <div className="link-box"><Link to="/about-us#" className="theme-btn">{btnText}</Link></div>
                    </div>
                </div>
            </ReactWOW>
        </>
    );
};

export default SingleFeatureV2;