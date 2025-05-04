import React from 'react';
import PriceV3Data from '../../jsonData/price/PriceV3Data.json'
import SinglePriceV3 from './SinglePriceV3';
import ReactWOW from 'react-wow';

const PriceV3 = () => {
    return (
        <>
            <section className="pricing-section-three">
                <div className="anim-icons">
                    <span className="icon icon-line-1 wow zoomIn"></span>
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-circle-1"></span>
                    </ReactWOW>
                    <span className="icon icon-dots wow zoomIn"></span>
                </div>
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">Get Ticket</span>
                        <h2>Choose a Ticket</h2>
                    </div>
                    <div className="outer-box">
                        <div className="row">
                            {PriceV3Data.map(plan =>
                                <div className="pricing-block-three col-lg-4 col-md-6 col-sm-12" key={plan.id}>
                                    <SinglePriceV3 plan={plan} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PriceV3;