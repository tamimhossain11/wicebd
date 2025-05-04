import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BannerV2 from '../../components/banner/BannerV2';
import FeatureV2 from '../../components/feature/FeatureV2';
import FactV2 from '../../components/fact/FactV2';
import SpeakerV2 from '../../components/speaker/SpeakerV2';
import ScheduleV2 from '../../components/schedule/ScheduleV2';
import PriceV2 from '../../components/price/PriceV2';
import EventV1 from '../../components/event/EventV1';
import ClientV2 from '../../components/client/ClientV2';
import GalleryV2 from '../../components/gallery/GalleryV2';
import TestimonialV1 from '../../components/testimonial/TestimonialV1';
import BlogV1 from '../../components/blog/BlogV1';
import SubscribeV1 from '../../components/subscribe/SubscribeV1';
import FooterV2 from '../../components/footer/FooterV2';

const Home2 = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='home' />
                <BannerV2 />
                <FeatureV2 />
                <FactV2 />
                <SpeakerV2 />
                <ScheduleV2 />
                <PriceV2 />
                <EventV1 />
                <ClientV2 />
                <GalleryV2 />
                <TestimonialV1 />
                <BlogV1 />
                <SubscribeV1 />
                <FooterV2 />
            </div>
        </>
    );
};

export default Home2;