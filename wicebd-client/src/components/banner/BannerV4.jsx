import React from 'react';
import BannerV4Data from '../../jsonData/banner/BannerV4Data.json'

const BannerV4 = () => {
    return (
        <>
            <section className="banner-section-two" style={{ backgroundImage: "url(../images/background/11.jpg)" }}>
                <div className="auto-container">
                    <div className="outer-container">
                        <div className="content">
                            <div className="upper-content">
                                <div className="title">Kids involvement using technologies</div>
                                <h1>KIDSO <span>| 2023</span></h1>
                                <h2>Digital Agency<span>Pearl Hotel, New York, USA</span></h2>
                            </div>
                            <div className="lower-content">
                                <div className="row clearfix">
                                    {BannerV4Data.map(banner =>
                                        <div className="column col-lg-4 col-md-4 col-sm-12" key={banner.id}>
                                            <div className="lower-title">{banner.title}</div>
                                            <div className="date">{banner.info}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BannerV4;