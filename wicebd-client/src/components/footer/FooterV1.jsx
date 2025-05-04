import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import SocialShare from '../others/SocialShare';
import { Gallery } from 'react-photoswipe-gallery';
import GalleryV1Data from '../../jsonData/gallery/GalleryV1Data.json'
import SingleGalleryV1 from '../gallery/SingleGalleryV1';

const FooterV1 = () => {
    return (
        <>
            <footer className="main-footer">
                <div className="widgets-section">
                    <div className="auto-container">
                        <div className="row">
                            <div className="big-column col-xl-6 col-lg-12 col-md-12 col-sm-12">
                                <div className="row">
                                    <div className="footer-column col-xl-7 col-lg-6 col-md-6 col-sm-12">
                                        <div className="footer-widget about-widget">
                                            <div className="logo">
                                                <Link to="/#"><img src="/images/logo.png" alt="image" /></Link>
                                            </div>
                                            <div className="text">
                                                <p>We have very good strength in innovative technology and tools with over 35 years of experience. We makes long-term investments goal in global companies in different sectors, mainly in Europe, America and other countries.</p>
                                            </div>
                                            <ul className="social-icon-one social-icon-colored">
                                                <SocialShare />
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="footer-column col-xl-5 col-lg-6 col-md-6 col-sm-12">
                                        <div className="footer-widget widget-ps-50">
                                            <h2 className="widget-title">Useful Links</h2>
                                            <ul className="user-links">
                                                <li><Link to="/about-us#">About Us</Link></li>
                                                <li><Link to="/services#">Services</Link></li>
                                                <li><Link to="/projects#">Projects</Link></li>
                                                <li><Link to="/schedule#">Schedule</Link></li>
                                                <li><Link to="/blog#">Blogs</Link></li>
                                                <li><Link to="/contact#">Contact Us</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="big-column col-xl-6 col-lg-12 col-md-12 col-sm-12">
                                <div className="row">
                                    <div className="footer-column col-lg-6 col-md-6 col-sm-12">
                                        <div className="footer-widget contact-widget">
                                            <h2 className="widget-title">Contact Us</h2>
                                            <div className="widget-content">
                                                <ul className="contact-list">
                                                    <li>
                                                        <span className="icon flaticon-clock"></span>
                                                        <div className="text">Mon - Fri: 09:00 - 18:00</div>
                                                    </li>
                                                    <li>
                                                        <span className="icon flaticon-phone"></span>
                                                        <div className="text"><Link to="tel:+1-345-5678-77">+1-345-5678-77</Link></div>
                                                    </li>
                                                    <li>
                                                        <span className="icon flaticon-paper-plane"></span>
                                                        <div className="text"><Link to="mailto:support@example.com">support@example.com</Link></div>
                                                    </li>
                                                    <li>
                                                        <span className="icon flaticon-worldwide"></span>
                                                        <div className="text">13005 Greenville Avenue <br /> California, TX 70240</div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="footer-column col-lg-6 col-md-6 col-sm-12">
                                        <div className="footer-widget widget-ps-50 instagram-widget">
                                            <h2 className="widget-title">Instagram Gallery</h2>
                                            <div className="widget-content">
                                                <div className="outer insta-outer clearfix">
                                                    <Gallery withDownloadButton>
                                                        {GalleryV1Data.slice(0, 6).map(album =>
                                                            <SingleGalleryV1 key={album.id} album={album} />
                                                        )}
                                                    </Gallery>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="auto-container">
                        <div className="inner-container clearfix">
                            <div className="copyright-text">
                                <p>&copy; Copyright {(new Date().getFullYear())} All Rights Reserved by <Link to="https://themeforest.net/user/expert-themes/portfolio" target='_blank'>Expert-Themes</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterV1;