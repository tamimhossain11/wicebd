import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import ErrorPageContent from '../../components/errorPage/ErrorPageContent';
import FooterV2 from "../../components/footer/FooterV2";

const ErrorPage = () => (
    <div className="page-wrapper">
        <span className="header-span" />
        <HeaderV1 headerStyle="header-style-two" parentMenu='blog' />
        <ErrorPageContent />
        <FooterV2 />
    </div>
);

export default ErrorPage;