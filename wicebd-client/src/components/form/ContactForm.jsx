import React from 'react';
import { toast } from 'react-toastify';

const ContactForm = () => {

    const handleSubmit = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Message Sent!")
    }

    return (
        <>
            <div className="inner-column">
                <div className="contact-form">
                    <div className="sec-title">
                        <h2>Get in Touch</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row clearfix">
                            <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                                <input type="text" name="username" placeholder="Name" autoComplete='off' required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                                <input type="number" name="phone" className='no-arrows' placeholder="Phone" autoComplete='off' required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                                <input type="email" name="email" placeholder="Email" autoComplete='off' required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                                <input type="text" name="subject" placeholder="Subject" autoComplete='off' required />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                                <textarea name="message" placeholder="Message" autoComplete='off' required></textarea>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                                <button className="theme-btn btn-style-one" type="submit" name="submit-form"><span className="btn-title">Submit Now</span></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ContactForm;