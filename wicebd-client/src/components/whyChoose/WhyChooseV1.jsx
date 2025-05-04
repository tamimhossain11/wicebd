import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import WhyChooseV1Data from '../../jsonData/whyChoose/WhyChooseV1Data.json'

const WhyChooseV1 = () => {
    return (
        <>
            <section className="why-choose-us">
                <div className="auto-container">
                    <div className="row">
                        <div className="content-column col-lg-6 col-md-12 col-sm-12 order-lg-2  ">
                            <div className="inner-column">
                                <div className="sec-title">
                                    <span className="title">JOIN THE EVENT</span>
                                    <h2>Why Choose WICEBD?</h2>
                                    <div className="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmtempor incididunt labore et dolore magna aliqu enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip</div>
                                </div>
                                <ul className="list-style-one">
                                    {WhyChooseV1Data.map(choose =>
                                        <li key={choose.id}>{choose.list}</li>
                                    )}
                                </ul>
                                <div className="btn-box">
                                    <Link to="/buy-ticket#" className="theme-btn btn-style-two"><span className="btn-title">Get Tickets</span></Link>
                                </div>
                            </div>
                        </div>
                        <div className="image-column col-lg-6 col-md-12 col-sm-12 ">
                            <div className="image-box">
                                <figure className="image"><img src="../images/background/3.jpg" alt="image" /></figure>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default WhyChooseV1;