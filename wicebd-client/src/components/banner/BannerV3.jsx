import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import TimeV1 from '../counter/TimeV1';

const BannerV3 = () => {
    const time = new Date("May 07 2025")

    return (
        <>
            <section className="banner-meetup">
                <div className="bg-pattern" style={{ backgroundImage: "url(../images/main-slider/9.jpg)" }}></div>
                <div className="layer-outer">
                    <div className="gradient-layer"></div>
                </div>
                <div className="auto-container">
                    <div className="content-box">
                        <div className="address"><span className="icon fa fa-map-marker-alt"></span>Pearl Hotel, New York, USA</div>
                        <h2> Digital Agency <br />Thinkers Meet Up</h2>
                    </div>
                    <div className="countdown clearfix">
                        <div className="time-counter">
                            <TimeV1 expiryTimestamp={time} />
                        </div>
                    </div>
                    <div className="btn-box">
                        <Link to="/buy-ticket#" className="theme-btn btn-style-one"><span className="btn-title">Get Tickets</span></Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BannerV3;