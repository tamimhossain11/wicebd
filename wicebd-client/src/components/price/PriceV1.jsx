import React from 'react';
import PriceV1Data from '../../jsonData/price/PriceV1Data.json'
import SinglePriceV1 from './SinglePriceV1';

const PriceV1 = () => {
    return (
        <>
            <section className="pricing-section">
                <div className="anim-icons">
                    <span className="icon icon-circle-green"></span>
                    <span className="icon icon-circle-blue"></span>
                    <span className="icon icon-circle-pink"></span>
                </div>
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">Get Ticket</span>
                        <h2>Choose a Ticket</h2>
                    </div>
                    <div className="outer-box">
                        <div className="row">
                            {PriceV1Data.map(plan =>
                                <div className="pricing-block col-lg-4 col-md-6 col-sm-12" key={plan.id}>
                                    <SinglePriceV1 plan={plan} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PriceV1;