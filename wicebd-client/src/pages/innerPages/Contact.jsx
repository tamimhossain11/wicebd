import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import ContactPageContent from '../../components/contact/ContactPageContent';
import FooterV1 from '../../components/footer/FooterV1';

const Contact = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" />
                <BreadCrumb title="Contact Us" breadCrumb="contact" />
                <ContactPageContent />
                <FooterV1 />
            </div>
        </>
    );
};

export default Contact;