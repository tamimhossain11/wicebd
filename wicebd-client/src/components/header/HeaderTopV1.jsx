import React from 'react';
import SocialShare from '../others/SocialShare';
import { HashLink as Link } from 'react-router-hash-link'

const HeaderTopV1 = () => {
    return (
        <>
            <div className="header-top">
                <div className="auto-container">
                    <div className="clearfix">
                        <div className="top-left pull-left">
                            <div className="text">Best choice for WICEBD & Party Events.</div>
                        </div>
                        <div className="pull-right">
                            <ul className="social-links">
                                <SocialShare />
                            </ul>
                            <Link to="/login#" className="theme-btn register-btn">Register Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderTopV1;