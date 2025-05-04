import React from 'react';
import { toast } from 'react-toastify';

const FaqForm = () => {

    const handleForm = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks for your Message!")
    }

    return (
        <>
            <section className="faq-form-section">
                <div className="auto-container">
                    <div className="sec-title">
                        <h2>Didn’t Find Your Answer?</h2>
                    </div>
                    <div className="faq-form">
                        <form onSubmit={handleForm}>
                            <div className="row">
                                <div className="form-group col-lg-12 col-md-12">
                                    <input type="text" name="username" placeholder="Name" autoComplete='off' required />
                                </div>
                                <div className="form-group col-lg-12 col-md-12">
                                    <input type="email" name="email" placeholder="Email" autoComplete='off' required />
                                </div>
                                <div className="form-group col-lg-12 col-md-12">
                                    <input type="text" name="subject" placeholder="Subject" autoComplete='off' required />
                                </div>
                                <div className="form-group col-lg-12 col-md-12">
                                    <textarea name="message" placeholder="Question Detail" autoComplete='off' required></textarea>
                                </div>
                                <div className="form-group col-lg-12 col-md-12 text-right">
                                    <button className="theme-btn btn-style-one" type="submit" name="submit-form"><span className="btn-title">Get A Quote</span></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FaqForm;