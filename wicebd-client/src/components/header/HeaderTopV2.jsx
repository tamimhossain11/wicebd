import React from 'react';
import SocialShare from '../others/SocialShare';

const HeaderTopV2 = () => {
    return (
        <>
            <div className="header-top-two">
                <div className="auto-container">
                    <div className="clearfix">
                        <div className="top-left clearfix">
                            <ul className="links clearfix">
                                <li><a href="tel:1-000-000-0000"><span className="icon fa fa-phone"></span>Call : 1-000-000-0000</a></li>
                                <li><a href="mailto:info@WICEBD.com"><span className="icon fa fa-envelope"></span>info@WICEBD.com</a></li>
                                <li><span className="icon fa fa-clock me-2"></span>Open Hours 10:00 am - 10:00 pm</li>
                            </ul>
                        </div>
                        <div className="top-right clearfix d-none d-lg-block">
                            <ul className="social-icons">
                                <SocialShare />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderTopV2;