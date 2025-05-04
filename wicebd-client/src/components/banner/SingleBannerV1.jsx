import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SingleBannerV1 = ({ banner }) => {
    const { thumb, subTitle, title1, title2, list1, list2, list3, btnLink, btnText } = banner

    return (
        <>
            <div className="slide-item" style={{ backgroundImage: `url(images/main-slider/${thumb}` }}>
                <div className="auto-container">
                    <div className="content-box">
                        <span className="title">{subTitle}</span>
                        <h2> {title1} <br /> {title2} </h2>
                        <ul className="info-list">
                            <li><span className="icon fa fa-chair"></span>{list1}</li>
                            <li><span className="icon fa fa-user-alt"></span>{list2}</li>
                            <li><span className="icon fa fa-map-marker-alt"></span>{list3}</li>
                        </ul>
                        <div className="btn-box"><Link to={`/${btnLink}#`} className="theme-btn btn-style-two"><span className="btn-title">{btnText}</span ></Link></div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default SingleBannerV1;