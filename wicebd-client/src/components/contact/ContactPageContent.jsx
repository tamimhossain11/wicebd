import React from 'react';
import SocialShare from '../others/SocialShare';
import ContactForm from '../form/ContactForm';

const ContactPageContent = () => {
    return (
        <>
            <section className="contact-page-section">
                <div className="auto-container">
                    <div className="row clearfix">
                        <div className="contact-column col-lg-4 col-md-12 col-sm-12 order-lg-2">
                            <div className="inner-column">
                                <div className="sec-title">
                                    <h2>Contact Info</h2>
                                </div>
                                <ul className="contact-info">
                                    <li>
                                        <span className="icon fa fa-map-marker-alt"></span>
                                        <p><strong>block C, 9/25 Humayun Rd</strong></p>
                                        <p>Dhaka 1207, Bangladesh</p>
                                    </li>
                                    <li>
                                        <span className="icon fa fa-phone-volume"></span>
                                        <p><strong>Call Us</strong></p>
                                        <p><a href="tel:+880 1716605265"> 01746-342152</a></p>
                                    </li>
                                    <li>
                                        <span className="icon fa fa-envelope"></span>
                                        <p><strong>Mail Us</strong></p>
                                        <p><a href="mailto:support@example.com">contact@wicebd.com</a></p>
                                    </li>
                                    <li>
                                        <span className="icon fa fa-clock"></span>
                                        <p><strong>Opening Time</strong></p>
                                        <p>Sat - Fri: 09.00am to 22.00pm</p>
                                    </li>
                                </ul>
                                <ul className="social-icon-two social-icon-colored">
                                    <SocialShare />
                                </ul>
                            </div>
                        </div>
                        <div className="form-column col-lg-8 col-md-12 col-sm-12">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            <div className="map-section">
                <div className="auto-container">
                    <div className="map-outer">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.45619571192!2d90.36076077516411!3d23.76676407865919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1004cb313c9%3A0x6ca7a5d7fc7b9f3b!2sDREAMS%20OF%20BANGLADESH!5e0!3m2!1sen!2sbd!4v1746868913690!5m2!1sen!2sbd"
                            width="600"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                    </div>
                </div>
            </div>

        </>
    );
};

export default ContactPageContent;