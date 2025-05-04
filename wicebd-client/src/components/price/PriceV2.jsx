import React from 'react';
import PriceV2Data from '../../jsonData/price/PriceV2Data.json'
import SinglePriceV2 from './SinglePriceV2';
import ReactWOW from 'react-wow';

const PriceV2 = ({ pricingClass }) => {
    return (
        <>
            <section className={`pricing-section-two ${pricingClass}`}>
                <div className="anim-icons">
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-line-1"></span>
                    </ReactWOW>
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-circle-1"></span>
                    </ReactWOW>
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-dots"></span>
                    </ReactWOW>
                </div>
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">Get Ticket</span>
                        <h2>Choose a Ticket</h2>
                    </div>
                    <div className="outer-box">
                        <div className="row">
                            {PriceV2Data.map(price =>
                                <div className="pricing-block-two col-lg-4 col-md-6 col-sm-12" key={price.id}>
                                    <SinglePriceV2 price={price} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PriceV2;