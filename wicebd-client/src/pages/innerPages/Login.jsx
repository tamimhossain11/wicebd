import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import LoginForm from '../../components/form/LoginForm';
import FooterV1 from '../../components/footer/FooterV1';

const Login = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='schedule' />
                <BreadCrumb title="login" breadCrumb="login" />
                <LoginForm />
                <FooterV1 />
            </div>
        </>
    );
};

export default Login;