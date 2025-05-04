import React from 'react';
import SocialShare from '../others/SocialShare';
import { HashLink as Link } from 'react-router-hash-link'
import ReactWOW from 'react-wow';

const FooterV2 = ({ hasIcon = false, footerStyle, darkLogo = false }) => {
    return (
        <>
            <footer className={`main-footer style-two ${footerStyle}`}>
                {hasIcon ?
                    <><div className="anim-icons full-width">
                        <span className="icon icon-circle-blue wow fadeIn"></span>
                        <span className="icon icon-dots wow fadeInleft"></span>
                        <ReactWOW animation='zoomIn'>
                            <span className="icon icon-circle-1"></span>
                        </ReactWOW>
                    </div></>
                    :
                    <></>
                }
                <div className="auto-container">
                    <div className="footer-content">
                        {darkLogo ?
                            <><div className="footer-logo"><Link to="/#"><img src="../images/logo-2.png" alt="image" /></Link></div></>
                            :
                            <><div className="footer-logo"><Link to="/#"><img src="../images/logo.png" alt="image" /></Link></div></>
                        }
                        <ul className="footer-nav">
                            <li><Link to="/#">Home</Link></li>
                            <li><Link to="/about-us#">About Us</Link></li>
                            <li><Link to="#">Services</Link></li>
                            <li><Link to="#">Projects</Link></li>
                            <li><Link to="/contact#">Contact Us</Link></li>
                        </ul>
                        <div className="copyright-text">&copy; Copyright {(new Date().getFullYear())} All Rights Reserved by <Link to="https://themeforest.net/user/expert-themes/portfolio" target='_blank'>Expert-Themes</Link></div>
                        <ul className="social-icon-one">
                            <SocialShare />
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterV2;