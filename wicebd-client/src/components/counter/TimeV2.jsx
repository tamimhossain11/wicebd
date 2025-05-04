import React from 'react';
import { useTimer } from 'react-timer-hook';

const TimeV2 = ({ expiryTimestamp }) => {
    const { seconds, minutes, hours, days, } = useTimer({ expiryTimestamp, onExpire: () => console.log('Counter Expired') });

    return (
        <>
            <div>
                <span>{days <= 9 ? `0${days}` : days}</span> <h6>Days</h6>
            </div>
            <div>
                <span>{hours <= 9 ? `0${hours}` : hours}</span><h6>Hours</h6>
            </div>
            <div>
                <span>{minutes <= 9 ? `0${minutes}` : minutes}</span><h6>Minutes</h6>
            </div>
            <div>
                <span>{seconds <= 9 ? `0${seconds}` : seconds}</span><h6>Second</h6>
            </div>
        </>
    );
};

export default TimeV2;