import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SingleFeatureV3 = ({ feature }) => {
    const { icon, about, text, btnIcon } = feature

    return (
        <>
            <div className="inner-box">
                <div className="icon-box"><span className={icon}></span></div>
                <h4><Link to="/about-us#">{about}</Link></h4>
                <div className="text">{text}</div>
                <div className="link-box">
                    <Link to="/about-us#" className="theme-btn">
                        <span className={btnIcon}></span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SingleFeatureV3;