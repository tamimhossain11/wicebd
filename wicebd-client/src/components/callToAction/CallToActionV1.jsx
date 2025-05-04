import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const CallToActionV1 = () => {
    return (
        <>
            <section className="call-to-action" style={{ backgroundImage: "url(../images/background/11.jpg)" }} >
                <div className="auto-container">
                    <div className="content-box">
                        <div className="text">WE ARE A LEADING MEETUP COMPANY</div>
                        <h2>We Are Always at The Forefront <br /> of The Business Conference !</h2>
                        <div className="btn-box">
                            <Link to="/contact#" className="theme-btn btn-style-one"><span className="btn-title">Contact
                                Us</span></Link>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
};

export default CallToActionV1;