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
                                        <p><strong>32, Breaking Street,</strong></p>
                                        <p>2nd cros, Newyork ,USA 10002</p>
                                    </li>
                                    <li>
                                        <span className="icon fa fa-phone-volume"></span>
                                        <p><strong>Call Us</strong></p>
                                        <p><a href="tel:+321 4567 89 012">+321 4567 89 012</a></p>
                                    </li>
                                    <li>
                                        <span className="icon fa fa-envelope"></span>
                                        <p><strong>Mail Us</strong></p>
                                        <p><a href="mailto:support@example.com">Support@example.com</a></p>
                                    </li>
                                    <li>
                                        <span className="icon fa fa-clock"></span>
                                        <p><strong>Opening Time</strong></p>
                                        <p>Mon - Sat: 09.00am to 18.00pm</p>
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
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25216.765666144616!2d144.9456413371385!3d-37.8112271492458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b8c21cb29b%3A0x1c045678462e3510!2sMelbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2s!4v1599237324751!5m2!1sen!2s" height="540" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ContactPageContent;