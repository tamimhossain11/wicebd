import React from 'react';
import SingleScheduleBlockV3 from './SingleScheduleBlockV3';

const SingleScheduleTabV3 = ({ schedule }) => {
    const { tabClass, tabId, id } = schedule

    return (
        <>
            <div className={`tab tab-pane fade ${tabClass}`} id={tabId} key={id}>
                <div className="schedule-timeline row">
                    {schedule.tabData.map(block =>
                        <div className="schedule-block col-lg-6 col-md-12 col-sm-12" key={block.id}>
                            <SingleScheduleBlockV3 block={block} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SingleScheduleTabV3;