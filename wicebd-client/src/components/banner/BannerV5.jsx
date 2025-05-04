import React, { useEffect, useRef } from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import BannerV2Data from '../../jsonData/banner/BannerV2Data.json'
import Parallax from 'parallax-js';
import TimeV1 from '../counter/TimeV1';

const BannerV5 = () => {
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
            <section className="banner-conference-two" style={{ backgroundImage: "url(images/background/6.jpg)" }}>
                <div className="images-outer">
                    <figure className="speaker-img"><img src="images/main-slider/banner_img.png" alt="image" /></figure>
                </div>

                <div className="auto-container">
                    <div className="content-box">
                        <span className="title">1st to 10 March 2019, Gold-Land Hotel, Canada</span>
                        <h2>World Digital <br />Conference 2023</h2>
                        <div className="time-counter">
                            <TimeV1 expiryTimestamp={time} />
                        </div>
                        <div className="btn-box"><Link to="/buy-ticket#" className="theme-btn btn-style-two"><span className="btn-title">Booking Now</span></Link></div>
                    </div>
                </div>
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
            </section>
        </>
    );
};

export default BannerV5;