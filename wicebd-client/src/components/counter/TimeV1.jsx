import React from 'react';
import { useTimer } from 'react-timer-hook';

const TimeV1 = ({ expiryTimestamp }) => {
    const { seconds, minutes, hours, days, } = useTimer({ expiryTimestamp, onExpire: () => console.log('Counter Expired') });
    return (
        <>
            <div className="time-countdown clearfix">
                <div className="counter-column">
                    <span className="count">{days <= 9 ? `0${days}` : days}</span>Days
                </div>
                <div className="counter-column">
                    <span className="count">{hours <= 9 ? `0${hours}` : hours}</span>Hours
                </div>
                <div className="counter-column">
                    <span className="count">{minutes <= 9 ? `0${minutes}` : minutes}</span>Minutes
                </div>
                <div className="counter-column">
                    <span className="count">{seconds <= 9 ? `0${seconds}` : seconds}</span>Second
                </div>
            </div>
        </>
    );
};

export default TimeV1;