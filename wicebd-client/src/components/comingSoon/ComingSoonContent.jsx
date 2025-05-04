import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import { toast } from 'react-toastify';
import ReactWOW from 'react-wow';
import TimeV2 from '../counter/TimeV2';
import SocialShare from '../others/SocialShare';

const ComingSoonContent = () => {

    const time = new Date("May 07 2025")

    const handleEmail = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks for your Email")
    }

    return (
        <>
            <section className="coming-soon">
                <div className="anim-icons full-width">
                    <span className="icon icon-circle-blue wow fadeIn"></span>
                    <span className="icon icon-dots wow fadeInleft"></span>
                    <span className="icon icon-line-1 wow zoomIn"></span>
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-circle-1"></span>
                    </ReactWOW>
                </div>
                <div className="auto-container">
                    <div className="content">
                        <div className="logo"><Link to="/#"><img src="../images/logo-2.png" alt="image" /></Link></div>
                        <h1>Coming Soon</h1>
                        <div className="text">We are currently working on an awesome new site. Stay tuned for more information.<br /> Subscribe to our newsletter to stay updated on our progress</div>
                        <div className="timer">
                            <div className="cs-countdown clearfix">
                                <TimeV2 expiryTimestamp={time} />
                            </div>
                        </div>
                        <div className="emailed-form">
                            <form onSubmit={handleEmail}>
                                <div className="form-group">
                                    <input type="email" name="email" placeholder="Enter your email" required autoComplete='off' />
                                    <button type="submit" className="theme-btn"><i className="flaticon-arrow-pointing-to-right"></i></button>
                                </div>
                            </form>
                        </div>
                        <div className="social-links">
                            <ul className="social-icon-two social-icon-colored">
                                <SocialShare />
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ComingSoonContent;