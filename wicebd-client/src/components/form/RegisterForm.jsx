import React from 'react';
import { toast } from 'react-toastify';

const RegisterForm = () => {

    const handleSearch = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks for Registration")
    }

    return (
        <>
            <form onSubmit={handleSearch}>
                <div className="form-group">
                    <span className="icon fa fa-user"></span>
                    <input type="text" name="username" placeholder="Full name" autoComplete='off' required />
                </div>
                <div className="form-group">
                    <span className="icon fa fa-envelope"></span>
                    <input type="email" name="email" placeholder="Email address" autoComplete='off' required />
                </div>
                <div className="form-group">
                    <span className="icon fa fa-phone"></span>
                    <input type="number" name="phone" className='no-arrows' placeholder="Phone" autoComplete='off' required />
                </div>
                <div className="form-group">
                    <span className="icon fa fa-edit"></span>
                    <textarea name="message" placeholder="Additional Message" autoComplete='off' required></textarea>
                </div>
                <div className="form-group text-end">
                    <button type="submit" className="theme-btn btn-style-four"><span className="btn-title">Register Now</span></button>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;