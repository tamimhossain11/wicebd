import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BannerV5 from '../../components/banner/BannerV5';
import AboutV2 from '../../components/about/AboutV2';
import FeatureV3 from '../../components/feature/FeatureV3';
import FluidV1 from '../../components/fluid/FluidV1';
import SpeakerV3 from '../../components/speaker/SpeakerV3';
import ScheduleV3 from '../../components/schedule/ScheduleV3';
import FaqV1 from '../../components/faq/FaqV1';
import AppV1 from '../../components/app/AppV1';
import EventV2 from '../../components/event/EventV2';
import CallToActionV1 from '../../components/callToAction/CallToActionV1';
import PriceV3 from '../../components/price/PriceV3';
import GalleryV3 from '../../components/gallery/GalleryV3';
import SubscribeV2 from '../../components/subscribe/SubscribeV2';
import ClientV3 from '../../components/client/ClientV3';
import FooterV2 from '../../components/footer/FooterV2';

const Home5 = () => {
    return (
        <>
            <div className="page-wrapper">
                <HeaderV1 headerStyle="header-style-four" headerTopV2={true} whiteLogo={true} parentMenu='home' />
                <BannerV5 />
                <AboutV2 />
                <FeatureV3 />
                <FluidV1 />
                <SpeakerV3 />
                <ScheduleV3 />
                <FaqV1 />
                <AppV1 />
                <EventV2 />
                <CallToActionV1 />
                <PriceV3 />
                <GalleryV3 />
                <SubscribeV2 />
                <ClientV3 />
                <FooterV2 hasIcon={true} footerStyle="style-three" darkLogo={true} />
            </div>
        </>
    );
};

export default Home5;