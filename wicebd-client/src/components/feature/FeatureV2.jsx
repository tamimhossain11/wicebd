import React from 'react';
import featureV2Data from '../../jsonData/feature/featureV2Data.json'
import SingleFeatureV2 from './SingleFeatureV2';

const FeatureV2 = () => {
    return (
        <section className="features-section">
            <div className="auto-container">
                <div className="sec-title text-center" style={{ marginBottom: '60px' }}>
                    <span className="title" style={{ color: 'var(--primary-maroon)' }}>What We Offer</span>
                    <h2 style={{ color: '#ffffff' }}>Event Categories</h2>
                </div>
                <div className="row">
                    {featureV2Data.map(feature =>
                        <SingleFeatureV2 feature={feature} key={feature.id} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeatureV2;