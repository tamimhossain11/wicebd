import React from 'react';

const SingleFaqV1 = ({ faq }) => {
    const { accordionId, accordionParent, dataTarget, ariaExpanded, title, collapseClass, ariaLabelled, text } = faq

    return (
        <>
            <li className='blocks' id={accordionId}>
                <span className="acc-btn" type="button" data-bs-toggle="collapse" data-bs-target={`#${dataTarget}`} aria-expanded={ariaExpanded} aria-controls={dataTarget}>
                    {title}
                </span>
                <div id={dataTarget} className={`acc-content accordion-collapse collapse ${collapseClass}`} aria-labelledby={ariaLabelled} data-bs-parent={`#${accordionParent}`}>
                    <div className="content">
                        <div className="text">{text}</div>
                    </div>
                </div>
            </li>
        </>
    );
};

export default SingleFaqV1;