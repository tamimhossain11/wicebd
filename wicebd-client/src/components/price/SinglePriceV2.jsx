import React from 'react';
import ReactWOW from 'react-wow';
import { HashLink as Link } from 'react-router-hash-link'

const SinglePriceV2 = ({ price }) => {
    const { icon, title, plan, list1, list2, list3, list4, list5, listClass, btnText, animationName, delay } = price

    return (
        <>
            <ReactWOW animation={animationName} delay={delay}>
                <div className="inner-box">
                    <div className="title"><span className={icon}></span>{title}</div>
                    <div className="price-box">
                        <h4 className="price">${plan}</h4>
                    </div>
                    <ul className="features">
                        <li className={listClass}>{list1}</li>
                        <li className={listClass}>{list2}</li>
                        <li className={listClass}>{list3}</li>
                        <li className={listClass}>{list4}</li>
                        <li className={listClass}>{list5}</li>
                    </ul>
                    <div className="btn-box">
                        <Link to="/buy-ticket#" className="theme-btn btn-style-one"><span className="btn-title">{btnText}</span></Link>
                    </div>
                </div>
            </ReactWOW>
        </>
    );
};

export default SinglePriceV2;