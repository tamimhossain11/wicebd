import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const MainMenu = ({ parentMenu, toggleMenu, toggleMultiMenu }) => {
    return (
        <>
            <ul className="navigation clearfix">
                <li className={`dropdown ${parentMenu === 'home' ? 'current' : ''} `}>
                    <Link to={void (0)} onClick={toggleMenu}>Home</Link>
                    <ul className='sub-menu'>
                        <li><Link to="/#">Home Classic</Link></li>
                        <li><Link to="/home-2#">Home Conference</Link></li>
                        <li><Link to="/home-3#">Home Meetup</Link></li>
                        <li><Link to="/home-4#">Home Page Four</Link></li>
                        <li><Link to="/home-5#">Home Page Five</Link></li>
                        <li className={`dropdown ps-0 multi-menu-parent`}>
                            <Link to={void (0)} onClick={toggleMultiMenu}>Header Styles</Link>
                            <ul className='multi-menu'>
                                <li><Link to="/#">Header Style One</Link></li>
                                <li><Link to="/home-2#">Header Style Two</Link></li>
                                <li><Link to="/home-3#">Header Style Three</Link></li>
                                <li><Link to="/home-4#">Home Page Four</Link></li>
                                <li><Link to="/home-5#">Home Page Five</Link></li>
                            </ul>
                            <div className="dropdown-btn" ><span className="fa fa-angle-down"></span></div>
                        </li>
                    </ul>
                    <div className="dropdown-btn" ><span className="fa fa-angle-down"></span></div>
                </li>
                <li className={`dropdown ${parentMenu === 'about' ? 'current' : ''}`}>
                    <Link to={void (0)} onClick={toggleMenu}>About</Link>
                    <ul className='sub-menu'>
                        <li><Link to="/about-us#" >About Us</Link></li>
                        <li><Link to="/pricing#" >Pricing</Link></li>
                        <li><Link to="/faqs#" >FAQs</Link></li>
                        <li><Link to="/gallery#" >Gallery</Link></li>
                        <li><Link to="/coming-soon#" >Coming Soon</Link></li>
                    </ul>
                    <div className="dropdown-btn" ><span className="fa fa-angle-down"></span></div>
                </li>
                <li className={`dropdown ${parentMenu === 'speakers' ? 'current' : ''}`}>
                    <Link to={void (0)} onClick={toggleMenu}>Speakers</Link>
                    <ul className='sub-menu'>
                        <li><Link to="/speakers#">Speakers</Link></li>
                        <li><Link to="/speakers-detail/1#">Speakers Detail</Link></li>
                    </ul>
                    <div className="dropdown-btn"><span className="fa fa-angle-down"></span></div>
                </li>
                <li className={`dropdown ${parentMenu === 'schedule' ? 'current' : ''}`}>
                    <Link to={void (0)} onClick={toggleMenu}>Schedule</Link>
                    <ul className='sub-menu'>
                        <li><Link to="/schedule#">Schedule</Link></li>
                        <li><Link to="/event-detail/1/1#">Event Detail</Link></li>
                        <li><Link to="/buy-ticket#">Buy Ticket</Link></li>
                    </ul>
                    <div className="dropdown-btn"><span className="fa fa-angle-down"></span></div>
                </li>
                <li className={`dropdown ${parentMenu === 'blog' ? 'current' : ''}`}>
                    <Link to={void (0)} onClick={toggleMenu}>Blog</Link>
                    <ul className='sub-menu'>
                        <li><Link to="/blog-sidebar#">Blog With Sidebar</Link></li>
                        <li><Link to="/blog-grid#">Blog Grid</Link></li>
                        <li><Link to="/blog-single/1#">Blog Single</Link></li>
                        <li><Link to="/error-page#">404 Error</Link></li>
                    </ul>
                    <div className="dropdown-btn"><span className="fa fa-angle-down"></span></div>
                </li>
                <li><Link to="/contact#">Contact</Link></li>
            </ul>
        </>
    );
};

export default MainMenu;