import React, { useEffect, useRef } from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import BannerV2Data from '../../jsonData/banner/BannerV2Data.json'
import Parallax from 'parallax-js';
import TimeV1 from '../counter/TimeV1';

const BannerV2 = () => {
    const time = new Date("May 30 2025")
    const sceneRef = useRef(null);

    useEffect(() => {
        if (sceneRef.current) {
            // eslint-disable-next-line no-unused-vars
            const parallaxInstance = new Parallax(sceneRef.current);
        }
    }, []);

    return (
        <section className="banner-conference">
            {/* Parallax floating icons */}
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

            {/* Floating glass orbs — pure CSS animated */}
            <div className="hero-orbs" aria-hidden="true">
                <span className="hero-orb hero-orb-1"></span>
                <span className="hero-orb hero-orb-2"></span>
                <span className="hero-orb hero-orb-3"></span>
            </div>

            <div className="auto-container">
                <div className="content-box content-box-blur">
                    {/* Live badge */}
                    <span className="title">8th Edition &nbsp;·&nbsp; Date TBA &nbsp;·&nbsp; Dhaka</span>

                    <h2>World Invention<br />Competition &amp; Exhibition<br />Bangladesh</h2>

                    {/* Subtitle */}
                    <p className="banner-subtitle">
                        The 8th edition of WICEBD — showcasing innovation, science &amp; technology
                        from Bangladesh to the global stage.
                    </p>

                    {/* Countdown */}
                    <div className="time-counter">
                        <TimeV1 expiryTimestamp={time} />
                    </div>

                    {/* CTA */}
                    <div className="btn-box">
                        <Link to="/buy-ticket#" className="theme-btn btn-style-two">
                            <span className="btn-title">Register Now</span>
                        </Link>
                        <Link to="/about-us#" className="hero-link-secondary">
                            Learn More &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="banner-hero-scroll">
                <span className="scroll-line"></span>
                <span>Scroll</span>
            </div>
        </section>
    );
};

export default BannerV2;
