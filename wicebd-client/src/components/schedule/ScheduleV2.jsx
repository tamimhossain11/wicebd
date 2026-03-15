import React from 'react';
import EventScheduleTable from './EventScheduleTable';

const ScheduleV2 = () => {
    return (
        <section className="schedule-section style-two" style={{
            background: 'linear-gradient(160deg, #f7f4fa 0%, #fdf0f4 50%, #f7f4fa 100%)',
            padding: '110px 0 90px',
        }}>
            <div className="auto-container">
                <div className="sec-title text-center" style={{ marginBottom: '52px' }}>
                    <span className="title" style={{
                        display: 'inline-block', fontSize: '12px', textTransform: 'uppercase',
                        letterSpacing: '0.2em', fontWeight: 700, color: '#800020', marginBottom: '12px',
                    }}>
                        Date To Be Announced
                    </span>
                    <h2 style={{ color: '#111', fontWeight: 700, fontSize: '40px' }}>Event Plan</h2>
                    <p style={{ color: '#777', fontSize: '15px', maxWidth: '480px', margin: '12px auto 0', lineHeight: 1.7 }}>
                        Full day programme schedule for the 8th WICEBD national round.
                    </p>
                </div>
                <EventScheduleTable />
            </div>
        </section>
    );
};

export default ScheduleV2;