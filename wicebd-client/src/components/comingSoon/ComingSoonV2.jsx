import React from 'react';
import TimeV1 from '../counter/TimeV1';

const ComingSoonV2 = () => {
    const time = new Date("Apr 07 2025")

    return (
        <>
            <section className="coming-soon-section-two">
                <div className="auto-container">
                    <div className="outer-box">
                        <div className="time-counter">
                            <TimeV1 expiryTimestamp={time} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ComingSoonV2;