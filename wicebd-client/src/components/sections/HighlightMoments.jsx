import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const HighlightMoments = () => {
    return (
        <section className="moments-highlight-section">
            <div className="auto-container">
                <div className="moments-highlight-inner">

                    {/* Left — headline + description */}
                    <div className="moments-highlight-content">
                        <span className="moments-kicker">Dreams of Bangladesh</span>
                        <h2 className="moments-title">
                            Historic Achievements<br />on the Global Stage
                        </h2>
                        <p className="moments-text">
                            Our teams earned 14 Gold medals, 3 Silver medals, and multiple
                            special awards at international invention competitions — carrying
                            the pride of Bangladesh to the world stage.
                        </p>
                        <Link to="/about-us#" className="moments-cta">
                            View Our Journey &rarr;
                        </Link>
                    </div>

                    {/* Right — glass stat cards */}
                    <div className="moments-highlight-stats">
                        <div className="moments-stat-item">
                            <span className="moments-stat-number">14</span>
                            <span className="moments-stat-label">Gold<br />Medals</span>
                        </div>
                        <div className="moments-stat-item">
                            <span className="moments-stat-number">3</span>
                            <span className="moments-stat-label">Silver<br />Medals</span>
                        </div>
                        <div className="moments-stat-item moments-stat-wide">
                            <span className="moments-stat-number">5+</span>
                            <span className="moments-stat-label">Special International Awards</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HighlightMoments;
