import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BannerV2 from '../../components/banner/BannerV2';
import HighlightMoments from '../../components/sections/HighlightMoments';
import FeatureV2 from '../../components/feature/FeatureV2';
import FactV2 from '../../components/fact/FactV2';
import MediaCoverage from '../../components/sections/MediaCoverage';
import ScheduleV2 from '../../components/schedule/ScheduleV2';
import PriceV2 from '../../components/price/PriceV2';
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
                <MediaCoverage />
                <ScheduleV2 />
                <PriceV2 />
                <EventV1 />
                <FooterV2 />
            </div>
        </>
    );
};

export default Home2;
