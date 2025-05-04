import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import FaqV1 from '../../components/faq/FaqV1';
import FaqForm from '../../components/form/FaqForm';
import FooterV1 from '../../components/footer/FooterV1';

const Faq = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='about' />
                <BreadCrumb title="faq's" breadCrumb="faq" />
                <FaqV1 />
                <FaqForm />
                <FooterV1 />
            </div>
        </>
    );
};

export default Faq;