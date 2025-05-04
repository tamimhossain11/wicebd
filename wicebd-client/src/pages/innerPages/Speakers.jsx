import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import SpeakerV2 from '../../components/speaker/SpeakerV2';
import SpeakerV1 from '../../components/speaker/SpeakerV1';
import SpeakerV3 from '../../components/speaker/SpeakerV3';
import FooterV1 from '../../components/footer/FooterV1';

const Speakers = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='speakers' />
                <BreadCrumb title="Speakers" breadCrumb="speakers" />
                <SpeakerV2 />
                <SpeakerV1 />
                <SpeakerV3 />
                <FooterV1 />
            </div>
        </>
    );
};

export default Speakers;