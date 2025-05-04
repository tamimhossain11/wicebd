import React from 'react';
import RegisterForm from './RegisterForm';

const RegisterV1 = () => {
    return (
        <>
            <section className="register-section">
                <div className="auto-container">
                    <div className="anim-icons full-width">
                        <span className="icon icon-circle-3 wow zoomIn"></span>
                    </div>
                    <div className="outer-box">
                        <div className="row no-gutters">
                            <div className="title-column col-lg-4 col-md-6 col-sm-12">
                                <div className="inner">
                                    <div className="sec-title light">
                                        <div className="icon-box"><span className="icon flaticon-rocket-ship"></span></div>
                                        <h2>REGISTER NOW</h2>
                                        <div className="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmtempor incididunt labore et dolore magna.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="register-form col-lg-8 col-md-6 col-sm-12">
                                <div className="form-inner">
                                    <RegisterForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RegisterV1;