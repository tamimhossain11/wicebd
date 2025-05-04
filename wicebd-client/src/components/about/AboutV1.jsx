import React from 'react';
import AboutV1Data from '../../jsonData/about/AboutV1Data.json'
import { HashLink as Link } from 'react-router-hash-link'
import ReactWOW from 'react-wow';

const AboutV1 = () => {
    return (
        <>
            <section className="about-section">
                <div className="anim-icons full-width">
                    <span className="icon icon-circle-blue"></span>
                    <ReactWOW animation='fadeInLeft'>
                        <span className="icon icon-dots"></span>
                    </ReactWOW>
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-circle-1"></span>
                    </ReactWOW>
                </div>
                <div className="auto-container">
                    <div className="row">
                        <div className="content-column col-lg-6 col-md-12 col-sm-12">
                            <div className="inner-column">
                                <div className="sec-title">
                                    <span className="title">ABOUT EVENT</span>
                                    <h2>Welcome to the World Digital Conference 2023</h2>
                                    <div className="text">Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.</div>
                                </div>
                                <ul className="list-style-one">
                                    {AboutV1Data.map(aboutData =>
                                        <li key={aboutData.id}>{aboutData.listData}</li>
                                    )}
                                </ul>
                                <div className="btn-box"><Link to="/contact#" className="theme-btn btn-style-three"><span className="btn-title">Register Now</span></Link></div>
                            </div>
                        </div>
                        <div className="image-column col-lg-6 col-md-12 col-sm-12">
                            <div className="image-box">
                                <ReactWOW animation='fadeIn'>
                                    <figure className="image"><img src="../images/resource/about-img-1.jpg" alt="image" /></figure>
                                </ReactWOW>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutV1;