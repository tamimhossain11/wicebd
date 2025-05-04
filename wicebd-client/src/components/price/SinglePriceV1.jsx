import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import ReactWOW from 'react-wow';

const SinglePriceV1 = ({ plan }) => {
    const { icon, title, price, list1, list2, list3, list4, list5, list1Class, list2Class, list3Class, list4Class, list5Class, btnText, btnLink, animation, delay } = plan

    return (
        <>
            <ReactWOW animation={animation} delay={delay}>
                <div className="inner-box" >
                    <div className="icon-box">
                        <div className="icon-outer"><span className={icon}></span></div>
                    </div>
                    <div className="price-box">
                        <div className="title">{title}</div>
                        <h4 className="price">${price}</h4>
                    </div>
                    <ul className="features">
                        <li className={list1Class}>{list1}</li>
                        <li className={list2Class}>{list2}</li>
                        <li className={list3Class}>{list3}</li>
                        <li className={list4Class}>{list4}</li>
                        <li className={list5Class}>{list5}</li>
                    </ul>
                    <div className="btn-box">
                        <Link to={`/${btnLink}#`} className="theme-btn">{btnText}</Link>
                    </div>
                </div>
            </ReactWOW>
        </>
    );
};

export default SinglePriceV1;