import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BannerV2 from '../../components/banner/BannerV2';
import HighlightMoments from '../../components/sections/HighlightMoments';
import CompetitionCategories from '../../components/sections/CompetitionCategories';
import FactV2 from '../../components/fact/FactV2';
import MediaCoverage from '../../components/sections/MediaCoverage';
import WhyWiceSection from '../../components/sections/WhyWiceSection';
import WiceInfoSection from '../../components/sections/WiceInfoSection';
import GlobeSection from '../../components/sections/GlobeSection';
import SponsorsSection from '../../components/sections/SponsorsSection';

import FooterV2 from '../../components/footer/FooterV2';

const Home2 = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='home' />
                <BannerV2 />
                <HighlightMoments />
                <CompetitionCategories />
                <FactV2 />
                <WiceInfoSection />
                <GlobeSection />
                <WhyWiceSection />
                <MediaCoverage />
                <SponsorsSection />
                <FooterV2 />
            </div>
        </>
    );
};

export default Home2;
