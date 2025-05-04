import React from 'react';
import featureV3Data from '../../jsonData/feature/featureV3Data.json'
import SingleFeatureV3 from './SingleFeatureV3';

const FeatureV3 = () => {
    return (
        <>
            <section className="features-section-three no-pd-top">
                <div className="auto-container">
                    <div className="row">
                        {featureV3Data.map(feature =>
                            <div className="feature-block-three col-lg-6 col-md-12 col-sm-12" key={feature.id}>
                                <SingleFeatureV3 feature={feature} />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeatureV3;