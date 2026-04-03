import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BannerV2 from '../../components/banner/BannerV2';
import HighlightMoments from '../../components/sections/HighlightMoments';
import FeatureV2 from '../../components/feature/FeatureV2';
import FactV2 from '../../components/fact/FactV2';
import MediaCoverage from '../../components/sections/MediaCoverage';
import WhyWiceSection from '../../components/sections/WhyWiceSection';
import WiceInfoSection from '../../components/sections/WiceInfoSection';
import GlobeSection from '../../components/sections/GlobeSection';
import SponsorsSection from '../../components/sections/SponsorsSection';
import EventV1 from '../../components/event/EventV1';
import FooterV2 from '../../components/footer/FooterV2';

const Home2 = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='home' />
                <BannerV2 />
                <HighlightMoments />
                <FeatureV2 />
                <FactV2 />
                <WiceInfoSection />
                <GlobeSection />
                <WhyWiceSection />
                <MediaCoverage />
                <SponsorsSection />
                <EventV1 />
                <FooterV2 />
            </div>
        </>
    );
};

export default Home2;
