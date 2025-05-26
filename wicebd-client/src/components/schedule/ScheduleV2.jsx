import React from 'react';
import ScheduleListV1Data from '../../jsonData/schedule/ScheduleListV1Data.json'
import ScheduleList from './ScheduleList';
import ScheduleV1Data from '../../jsonData/schedule/ScheduleV1Data.json'
import { HashLink as Link } from 'react-router-hash-link'
import EventScheduleTable from './EventScheduleTable'

const ScheduleV2 = () => {
    return (
        <>
            <section className="schedule-section style-two">
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title"></span>
                        <h2>Event Plan</h2>
                    </div>
                    <div className="schedule-tabs style-two tabs-box">
                        <div className="btns-box">
                            <ul className="tab-buttons clearfix nav nav-tabs">
                                {ScheduleListV1Data.map(list =>
                                    <ScheduleList list={list} key={list.id} />
                                )}
                            </ul>
                        </div>
                        <EventScheduleTable/>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ScheduleV2;