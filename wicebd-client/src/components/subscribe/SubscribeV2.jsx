import React from 'react';
import { toast } from 'react-toastify';
import ReactWOW from 'react-wow';

const SubscribeV2 = () => {

    const handleSubscribe = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Subscribed Successfully!")
    }

    return (
        <>
            <section className="newsletter-section">
                <div className="anim-icons full-width">
                    <span className="icon icon-shape-3 wow fadeIn"></span>
                    <span className="icon icon-line-1 wow fadeIn"></span>
                </div>
                <div className="auto-container">
                    <ReactWOW animation="fadeInUp" delay='500'>
                        <div className="subscribe-form">
                            <div className="envelope-image"></div>
                            <div className="form-inner">
                                <div className="upper-box">
                                    <div className="sec-title text-center">
                                        <div className="icon-box"><span className="fa fa-envelope"></span></div>
                                        <h2>Subscribe our newslatter</h2>
                                        <div className="text">Lorem ipsum dolor amet consectetur adipisicing elit sed eiusm
                                            <br />tempor incididunt ut labore dolore magna.</div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubscribe}>
                                    <div className="form-group">
                                        <input type="email" name="email" placeholder="Your email" autoComplete='off' required />
                                        <button type="submit" className="theme-btn"><span className="fa fa-paper-plane"></span></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ReactWOW>
                </div>
            </section>
        </>
    );
};

export default SubscribeV2;