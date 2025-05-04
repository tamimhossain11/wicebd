import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import PriceV1 from '../../components/price/PriceV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import PriceV2 from '../../components/price/PriceV2';
import PriceV3 from '../../components/price/PriceV3';
import FooterV1 from '../../components/footer/FooterV1';

const Pricing = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='about' />
                <BreadCrumb title="pricing" breadCrumb="pricing" />
                <PriceV1 />
                <PriceV2 pricingClass="alternate" />
                <PriceV3 />
                <FooterV1 />
            </div>
        </>
    );
};

export default Pricing;