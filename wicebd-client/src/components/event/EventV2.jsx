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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.4736507689086!2d90.42992319999999!3d23.7661421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c78b1976ae3d%3A0xbdb6014c6a90b76c!2sDhaka%20Imperial%20College!5e0!3m2!1sen!2sbd!4v1748288112508!5m2!1sen!2sbd"
            width="620"
            height="410"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dhaka Imperial College Location"
        ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EventV2;