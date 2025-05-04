import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import AboutV1 from '../../components/about/AboutV1';
import FactV2 from '../../components/fact/FactV2';
import FeatureV1 from '../../components/feature/FeatureV1';
import CallToActionV1 from '../../components/callToAction/CallToActionV1';
import EventV2 from '../../components/event/EventV2';
import AppV1 from '../../components/app/AppV1';
import SubscribeV2 from '../../components/subscribe/SubscribeV2';
import FooterV1 from '../../components/footer/FooterV1';

const AboutUs = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='about' />
                <BreadCrumb title="about us" breadCrumb="about-us" />
                <AboutV1 />
                <FactV2 />
                <FeatureV1 />
                <CallToActionV1 />
                <EventV2 />
                <AppV1 />
                <SubscribeV2 />
                <FooterV1 />
            </div>
        </>
    );
};

export default AboutUs;