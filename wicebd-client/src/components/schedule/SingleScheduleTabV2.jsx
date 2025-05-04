import React from 'react';
import SingleScheduleBlockV2 from './SingleScheduleBlockV2';

const SingleScheduleTabV2 = ({ schedule }) => {
    const { tabClass, tabId, id } = schedule

    return (
        <>
            <div className={`tab tab-pane fade ${tabClass}`} id={tabId} key={id}>
                <div className="schedule-timeline">
                    {schedule.tabData.map(block =>
                        <SingleScheduleBlockV2 block={block} key={block.id} />
                    )}
                </div>
            </div>
        </>
    );
};

export default SingleScheduleTabV2;