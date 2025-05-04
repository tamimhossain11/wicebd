import React, { useEffect, useRef } from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import ReactWOW from 'react-wow';
import BannerV2Data from '../../jsonData/banner/BannerV2Data.json'
import Parallax from 'parallax-js';
import TimeV1 from '../counter/TimeV1';

const BannerV2 = () => {
    const time = new Date("Nov 07 2025")

    const sceneRef = useRef(null);

    useEffect(() => {
        if (sceneRef.current) {
            // eslint-disable-next-line no-unused-vars
            const parallaxInstance = new Parallax(sceneRef.current);
        }
    }, []);

    return (
        <>
            <section className="banner-conference">
                <div className="icons parallax-scene-1" ref={sceneRef}>
                    {BannerV2Data.map(bannerIcon =>
                        <div
                            data-depth={bannerIcon.dataDepth}
                            className={`parallax-layer ${bannerIcon.iconClass}`}
                            style={{ backgroundImage: `url(../images/icons/${bannerIcon.icon})` }}
                            key={bannerIcon.id}>
                        </div>
                    )}
                </div>
                <div className="layer-outer">
                    <div className="gradient-layer"></div>
                </div>
                <div className="images-outer">
                    <figure className="speaker-img"><img src="../images/main-slider/speaker.png" alt="image" /></figure>
                </div>
                <div className="anim-icons full-width">
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-circle-3"></span>
                    </ReactWOW>
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-dots"></span>
                    </ReactWOW>
                </div>
                <div className="auto-container">
                    <div className="content-box">
                        <span className="title">January 20, 2023</span>
                        <h2> World Digital <br />Conference 2023</h2>
                        <div className="time-counter">
                            <TimeV1 expiryTimestamp={time} />
                        </div>
                        <div className="btn-box"><Link to="/buy-ticket#" className="theme-btn btn-style-two"><span className="btn-title">Book Now</span></Link></div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BannerV2;