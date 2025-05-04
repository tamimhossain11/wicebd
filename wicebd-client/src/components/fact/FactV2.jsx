import React from 'react';
import FactV2Data from '../../jsonData/fact/FactV2Data.json'
import SingleFactV2 from './SingleFactV2';

const FactV2 = () => {
    return (
        <>
            <section className="fun-fact-section style-two" style={{ backgroundImage: "url(../images/background/9.jpg)" }}>
                <div className="auto-container">
                    <div className="fact-counter">
                        <div className="row clearfix">
                            {FactV2Data.map(fact =>
                                <SingleFactV2 fact={fact} key={fact.id} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FactV2;