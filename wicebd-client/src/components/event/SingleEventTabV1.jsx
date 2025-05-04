import React from 'react';

const SingleEventTabV1 = ({ event }) => {
    const { tabId, tabClass, icon, title, text, icon1, icon2, icon3, list1, list2, list3, infoList } = event

    return (
        <>
            <div className={`tab tab-pane fade ${tabClass}`} id={tabId}>
                <h4><span className={icon}></span>{title}</h4>
                <div className="text">{text}</div>
                <ul className={`info-list ${infoList}`}>
                    <li><span className={icon1}></span>{list1}</li>
                    <li><span className={icon2}></span> <a href={`tel:${list2}`}>{list2}</a></li>
                    <li><span className={icon3}></span> <a href={`mailto:${list3}`}>{list3}</a></li>
                </ul>
            </div>
        </>
    );
};

export default SingleEventTabV1;