import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SingleScheduleBlockV2 = ({ block }) => {
    const { sessionStart, sessionEnd, speakerThumb, name, designation, title, text, btnText } = block

    return (
        <>
            <div className={`schedule-block`}>
                <div className="inner-box">
                    <div className="inner">
                        <div className="date">{sessionStart} - {sessionEnd}</div>
                        <div className="speaker-info">
                            <figure className="thumb"><img src={`../images/resource/${speakerThumb}`} alt="image" /></figure>
                            <h5 className="name">{name}</h5>
                            <span className="designation">{designation}</span>
                        </div>
                        <h4><Link to="/event-detail/1/1#">{title}</Link></h4>
                        <div className="text">{text}</div>
                        <div className="btn-box">
                            <Link to="/event-detail/1/1#" className="theme-btn">{btnText}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleScheduleBlockV2;