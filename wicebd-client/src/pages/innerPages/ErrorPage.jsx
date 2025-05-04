import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import ErrorPageContent from '../../components/errorPage/ErrorPageContent';
import FooterV1 from '../../components/footer/FooterV1';

const ErrorPage = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='blog' />
                <BreadCrumb />
                <ErrorPageContent />
                <FooterV1 />
            </div>
        </>
    );
};

export default ErrorPage;