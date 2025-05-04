import React from 'react';
import ReactWOW from 'react-wow';
import { HashLink as Link } from 'react-router-hash-link'

const AboutV2 = () => {
    return (
        <>
            <section className="about-section-two">
                <div className="anim-icons full-width">
                    <span className="icon icon-circle-blue wow fadeIn"></span>
                    <span className="icon icon-dots wow fadeInleft"></span>
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-circle-1 wow "></span>
                    </ReactWOW>
                </div>
                <div className="auto-container">
                    <div className="row">
                        <div className="content-column col-lg-6 col-md-12 col-sm-12 order-2">
                            <div className="inner-column">
                                <div className="sec-title">
                                    <span className="title">ABOUT MEETUP</span>
                                    <h2>Welcome to the World <br />Digital Meetup 2023</h2>
                                    <div className="text">Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.</div>
                                </div>
                                <div className="row">
                                    <div className="about-block col-lg-6 col-md-6 col-sm-12">
                                        <div className="inner-box">
                                            <h4><span className="icon fa fa-map-marker-alt"></span> Where</h4>
                                            <div className="text">Pearl Hotel, New York, USA</div>
                                        </div>
                                    </div>
                                    <div className="about-block col-lg-6 col-md-6 col-sm-12">
                                        <div className="inner-box">
                                            <h4><span className="icon fa fa-clock"></span> when</h4>
                                            <div className="text">January 20, 2023 09:00 AM</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box"><Link to="/contact#" className="theme-btn btn-style-three"><span className="btn-title">Register Now</span></Link></div>
                            </div>
                        </div>
                        <div className="image-column col-lg-6 col-md-12 col-sm-12">
                            <div className="image-box">
                                <figure className="image wow fadeIn"><img src="../images/resource/about-img-2.jpg" alt="image" /></figure>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutV2;