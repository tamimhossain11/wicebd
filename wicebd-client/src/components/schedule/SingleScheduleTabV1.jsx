import React from 'react';
import SingleScheduleBlock from './SingleScheduleBlock';

const SingleScheduleTabV1 = ({ schedule }) => {
    const { tabClass, tabId, id } = schedule

    return (
        <>
            <div className={`tab fade ${tabClass}`} id={tabId} key={id}>
                <div className="schedule-timeline">
                    {schedule.tabData.map(block =>
                        <SingleScheduleBlock block={block} key={block.id} />
                    )}
                </div>
            </div>
        </>
    );
};

export default SingleScheduleTabV1;