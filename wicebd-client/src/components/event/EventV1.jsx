import React from 'react';
import EventInfo from './EventInfo';

const EventV1 = () => {
    return (
        <>
            <section className="event-info-section">
                <div className="auto-container">
                    <div className="row">
                        <div className="info-column col-lg-6 col-md-12 col-sm-12">
                            <EventInfo />
                        </div>
                        <div className="image-column col-lg-6 col-md-12 col-sm-12">
                            <figure className="image"><img src="../images/icons/map-4.png" alt="image" /></figure>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EventV1;