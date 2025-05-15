import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import OlympiadForm from '../../components/olympiad/OlympiadForm';
import FooterV1 from '../../components/footer/FooterV1';

const Olympiad = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='schedule' />
                <OlympiadForm />
                <FooterV1 />
            </div>
        </>
    );
};

export default Olympiad;