import React from 'react';
import ScheduleListV1Data from '../../jsonData/schedule/ScheduleListV1Data.json'
import ScheduleV1Data from '../../jsonData/schedule/ScheduleV1Data.json'
import ScheduleList from './ScheduleList';
import { HashLink as Link } from 'react-router-hash-link'

const ScheduleV3 = () => {
    return (
        <>
            <section className="schedule-section style-three">
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">About Conference</span>
                        <h2>Schedule Plan</h2>
                    </div>
                    <div className="schedule-tabs style-three tabs-box">
                        <div className="btns-box">
                            <ul className="tab-buttons clearfix nav nav-tabs">
                                {ScheduleListV1Data.map(list =>
                                    <ScheduleList list={list} key={list.id} />
                                )}
                            </ul>
                        </div>
                        <div className="tabs-content">
                            {ScheduleV1Data.map(schedule =>
                                <div className={`tab tab-pane fade ${schedule.tabClass}`} id={schedule.tabId} key={schedule.id}>
                                    <div className="schedule-timeline row">
                                        {schedule.tabData.map(block =>
                                            <div className="schedule-block col-lg-6 col-md-12 col-sm-12" key={block.id}>
                                                <div className="inner-box">
                                                    <div className="inner">
                                                        <div className="date">{block.sessionStart} - {block.sessionEnd}</div>
                                                        <div className="speaker-info">
                                                            <figure className="thumb"><img src={`../images/resource/${block.speakerThumb}`} alt="image" /></figure>
                                                            <h5 className="name">{block.name}</h5>
                                                            <span className="designation">{block.designation}</span>
                                                        </div>
                                                        <h4><Link to={`/event-detail/${schedule.id}/${block.id}#`}>{block.title}</Link></h4>
                                                        <div className="text">{block.text}</div>
                                                        <div className="btn-box">
                                                            <Link to={`/event-detail/${schedule.id}/${block.id}#`} className="theme-btn">{block.btnText}</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ScheduleV3;