import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import ReactWOW from 'react-wow';

const AppV1 = () => {
    return (
        <>
            <section className="app-section">
                <div className="auto-container">
                    <div className="row">
                        <div className="content-column col-lg-5 col-md-12 col-sm-12">
                            <div className="inner-column">
                                <div className="sec-title">
                                    <span className="title">App Download</span>
                                    <h2>WICEBD App</h2>
                                </div>
                                <div className="text-box">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    eiusmod tempor incididunt labore et dolore magna aliqua. Aliquip ex ea commodo
                                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                    eu fugiat nulla pariatur.</div>
                                <div className="link-box">
                                    <Link to="https://www.apple.com/app-store/" target='_blank'><img src="../images/icons/app-store.png" alt="image" /></Link>
                                    <Link to="https://play.google.com/store/apps" target='_blank'><img src="../images/icons/google-play.png" alt="image" /></Link>
                                </div>
                            </div>
                        </div>
                        <div className="image-column col-lg-7 col-md-12 col-sm-12">
                            <div className="inner-column">
                                <div className="image-box">
                                    <ReactWOW animation='fadeInRight'>
                                        <figure className="image"><img src="../images/resource/app-mockup.png" alt="image" />
                                        </figure>
                                    </ReactWOW>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AppV1;