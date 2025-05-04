import React, { useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const LoginForm = () => {

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <section className="register-section">
                <div className="auto-container">
                    <div className="form-box">
                        <div className="box-inner">
                            <h1>Login Now</h1>
                            <div className="styled-form login-form">
                                <form method="post" action="index.html">
                                    <div className="form-group">
                                        <span className="adon-icon"><span className="fa fa-user"></span></span>
                                        <input type="text" name="username" placeholder="Your Name *" autoComplete='off' required />
                                    </div>
                                    <div className="form-group">
                                        <span className="adon-icon"><span className="fa fa-envelope"></span></span>
                                        <input type="email" name="useremil" placeholder="Email Address*" autoComplete='off' required />
                                    </div>
                                    <div className="form-group">
                                        <span className="adon-icon" onClick={togglePasswordVisibility}><span className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></span></span>
                                        <input type={showPassword ? "text" : "password"}
                                            name="userpassword"
                                            placeholder="Enter Password"
                                            autoComplete="off"
                                            required
                                            value={password}
                                            onChange={handlePasswordChange} />
                                    </div>
                                    <div className="clearfix">
                                        <div className="form-group pull-left">
                                            <button type="button" className="theme-btn btn-style-two"><span className="btn-title">Login Now</span></button>
                                        </div>
                                        <div className="form-group social-icon-one pull-right">
                                            Or login with &ensp;
                                            <li><Link to={void (0)} className="fab fa-facebook-f"></Link></li>
                                            <li><Link to={void (0)} className="fab fa-twitter"></Link></li>
                                            <li><Link to={void (0)} className="fab fa-apple"></Link></li>
                                        </div>
                                    </div>
                                    <div className="clearfix">
                                        <div className="pull-left">
                                            <input type="checkbox" id="remember-me" /><label className="remember-me" htmlFor="remember-me" >&nbsp; Remember Me</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginForm;