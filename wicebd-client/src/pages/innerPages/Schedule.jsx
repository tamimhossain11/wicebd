import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import ScheduleV1 from '../../components/schedule/ScheduleV1';
import SubscribeV2 from '../../components/subscribe/SubscribeV2';
import FooterV2 from "../../components/footer/FooterV2";

const Schedule = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='schedule' />
                <BreadCrumb title="Schedule" breadCrumb="schedule" />
                <ScheduleV1 />
                <SubscribeV2 />
                <FooterV2 />
            </div>
        </>
    );
};

export default Schedule;