import React from 'react';
import NewsLetterForm from '../form/NewsLetterForm';

const SubscribeV1 = () => {
    return (
        <>
            <section className="subscribe-section">
                <div className="auto-container">
                    <div className="content-box">
                        <div className="row">
                            <div className="title-column col-lg-6 col-md-12">
                                <div className="sec-title">
                                    <span className="icon fa fa-envelope"></span>
                                    <h2>Subscribe our <br />newslatter</h2>
                                </div>
                            </div>
                            <div className="form-column col-lg-6 col-md-12">
                                <div className="newsletter-form">
                                    <NewsLetterForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SubscribeV1;