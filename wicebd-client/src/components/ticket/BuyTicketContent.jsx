import React from 'react';
import SocialShare from '../others/SocialShare';
import ReactWOW from 'react-wow';
import { toast } from 'react-toastify';

const BuyTicketContent = () => {

    const handlePurchase = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Purchase Request Submitted!")
    }

    return (
        <>
            <section className="buy-ticket">
                <div className="anim-icons full-width">
                    <span className="icon icon-circle-blue wow fadeIn"></span>
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-circle-1"></span>
                    </ReactWOW>
                </div>
                <div className="auto-container">
                    <div className="row">
                        <div className="content-column col-lg-8 col-md-12 col-sm-12 order-2">
                            <div className="inner-column">
                                <h2>Day Pass <span>$35.99</span></h2>
                                <p>Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.duis aute irure dolor in repre hen derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur cepteur sint occaecat cupidatat eaque ipsa quae illo proident sunt in culpa qui officia deserunt mollit anim id est laborum perspiciatis</p>
                                <p>derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur cepteur sint occaecat cupidatat eaque ipsa quae illo proident sunt in culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error sit voluptatem accusantium dolore laudant rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto.</p>
                                <h3>Benefits of Day Pass package</h3>
                                <p>Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.</p>
                                <ul className="list-style-one">
                                    <li>Multiple Announcements during the event.</li>
                                    <li>Logo & company details on the WordCamp.</li>
                                    <li>Dedicated blog post thanking each Gold.</li>
                                    <li>Acknowledgment and opening and closing.</li>
                                </ul>
                                <h3>Day Pass Features</h3>
                                <p>Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.duis aute irure dolor in repre hen.</p>
                            </div>
                        </div>
                        <div className="form-column col-lg-4 col-md-12 col-sm-12">
                            <div className="inner-column">
                                <div className="ticket-form">
                                    <form onSubmit={handlePurchase}>
                                        <div className="form-group">
                                            <input type="text" name="username" placeholder="Your Name" autoComplete='off' required />
                                        </div>
                                        <div className="form-group">
                                            <input type="email" name="email" placeholder="Your Email" autoComplete='off' required />
                                        </div>
                                        <div className="form-group">
                                            <input type="number" name="phone" className='no-arrows' placeholder="Phone" autoComplete='off' required />
                                        </div>
                                        <div className="form-group">
                                            <input type="number" name="qty" min="1" placeholder="Quantity" autoComplete='off' required />
                                        </div>
                                        <div className="form-group">
                                            <input type="checkbox" name="terms" id="term" className='me-1' autoComplete='off' required />
                                            <label htmlFor="term" >I accept the <span>Terms &amp; Conditions</span></label>
                                        </div>
                                        <div className="form-group">
                                            <button className="theme-btn btn-style-three" type="submit" name="Submit"><span className="btn-title">Purchase</span></button>
                                        </div>
                                    </form>
                                </div>
                                <div className="follow-us">
                                    <h3>Follow Us</h3>
                                    <ul className="social-icon-two social-icon-colored">
                                        <SocialShare />
                                    </ul>
                                </div>
                                <div className="support-box">
                                    <h3>Call for Support</h3>
                                    <p>Me old mucker spend a penny cack nice one a blinding shot young delinquent.</p>
                                    <div className="number"><span className="fa fa-phone-volume"></span> <a href="tel:+1234567890">+123 456 7890</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
};

export default BuyTicketContent;