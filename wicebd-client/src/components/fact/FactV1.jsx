import React from 'react';
import FactV1Data from '../../jsonData/fact/FactV1Data.json'
import SingleFactV1 from './SingleFactV1';

const FactV1 = () => {
    return (
        <>
            <section className="fun-fact-section">
                <div className="auto-container">
                    <div className="fact-counter">
                        <div className="row clearfix">
                            {FactV1Data.map(fact =>
                                <div className={`counter-column col-lg-3 col-md-6 col-sm-12`} key={fact.id}>
                                    <SingleFactV1 fact={fact} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FactV1;