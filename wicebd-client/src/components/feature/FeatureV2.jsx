import React from 'react';
import ReactWOW from 'react-wow';
import featureV2Data from '../../jsonData/feature/featureV2Data.json'
import SingleFeatureV2 from './SingleFeatureV2';

const FeatureV2 = () => {
    return (
        <>
            <section className="features-section">
                <div className="auto-container">
                    <div className="anim-icons">
                        <ReactWOW animation='fadeIn'>
                            <span className="icon icon-shape-3"></span>
                        </ReactWOW>
                        <span className="icon icon-line-1"></span>
                    </div>
                    <div className="row">
                        {featureV2Data.map(feature =>
                            <SingleFeatureV2 feature={feature} key={feature.id} />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeatureV2;