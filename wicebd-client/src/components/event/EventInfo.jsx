import React from 'react';
import EventV1Data from '../../jsonData/event/EventV1Data.json'
import SingleEventTabV1 from './SingleEventTabV1';

const EventInfo = () => {
    return (
        <>
            <div className="inner-column">
                <div className="sec-title style-two">
                    <span className="title">Reach us</span>
                    <h2>Direction for the <br />Event hall</h2>
                </div>
                <div className="event-info-tabs tabs-box">
                    <ul className="tab-buttons clearfix nav nav-tabs">
                        <li className="tab-btn active" data-bs-toggle="tab" data-bs-target="#tab1">Time</li>
                        <li className="tab-btn" data-bs-toggle="tab" data-bs-target="#tab2">Venue</li>
                        <li className="tab-btn" data-bs-toggle="tab" data-bs-target="#tab3">How to</li>
                    </ul>
                    <div className="tabs-content">
                        {EventV1Data.map(event =>
                            <SingleEventTabV1 event={event} key={event.id} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventInfo;