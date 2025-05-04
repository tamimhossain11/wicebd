import React from 'react';
import EventInfo from './EventInfo';

const EventV2 = () => {
    return (
        <>
            <section className="event-info-section">
                <div className="auto-container">
                    <div className="row">
                        <div className="info-column col-lg-6 col-md-12 col-sm-12 order-lg-2 ps-30 ">
                            <EventInfo />
                        </div>
                        <div className="map-column col-lg-6 col-md-12 col-sm-12">
                            <div className="map-outer">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25216.765666144616!2d144.9456413371385!3d-37.8112271492458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b8c21cb29b%3A0x1c045678462e3510!2sMelbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2s!4v1599237324751!5m2!1sen!2s"
                                    height="435" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EventV2;