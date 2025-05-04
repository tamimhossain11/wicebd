import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BannerV1 from '../../components/banner/BannerV1';
import ComingSoonV1 from '../../components/comingSoon/ComingSoonV1';
import AboutV1 from '../../components/about/AboutV1';
import FeatureV1 from '../../components/feature/FeatureV1';
import SpeakerV1 from '../../components/speaker/SpeakerV1';
import FactV1 from '../../components/fact/FactV1';
import ScheduleV1 from '../../components/schedule/ScheduleV1';
import PriceV1 from '../../components/price/PriceV1';
import VideoV1 from '../../components/video/VideoV1';
import WhyChooseV1 from '../../components/whyChoose/WhyChooseV1';
import ClientV1 from '../../components/client/ClientV1';
import RegisterV1 from '../../components/form/RegisterV1';
import BlogV1 from '../../components/blog/BlogV1';
import FooterV1 from '../../components/footer/FooterV1';

const Home1 = () => {
    return (
        <>
            <div className="page-wrapper">
                <HeaderV1 whiteLogo={true} parentMenu='home' />
                <BannerV1 />
                <ComingSoonV1 />
                <AboutV1 />
                <FeatureV1 />
                <SpeakerV1 />
                <FactV1 />
                <ScheduleV1 />
                <PriceV1 />
                <VideoV1 />
                <WhyChooseV1 />
                <ClientV1 />
                <RegisterV1 />
                <BlogV1 hasShape={true} />
                <FooterV1 />
            </div>
        </>
    );
};

export default Home1;