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
                                    <h2>7th World Invention Competition & Exhibition 2025</h2>
                                    <div className="text">Bangladesh is proud to host the National Round of the World Invention Competition & Exhibition (WICE) 2025 for the first time, following consecutive Gold Medal wins and the Best Country Representative Award. Organized in partnership with the Indonesian Young Scientist Association (IYSA), this event will empower students from elementary to university levels to showcase innovative ideas in science, technology, and social impact. The top teams will earn the chance to represent Bangladesh at the international WICE 2025 in Malaysia. Join us in fostering a new era of creativity, research, and global collaboration among our brightest young minds.                                    </div>
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