import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const MainMenu = ({ parentMenu, toggleMenu, toggleMultiMenu }) => {
    return (
        <>
            <ul className="navigation clearfix">
                <li className={`dropdown ${parentMenu === 'home' ? 'current' : ''} `}>
                    <Link to="/#">Home</Link>
                </li>
                <li className={`dropdown ${parentMenu === 'schedule' ? 'current' : ''}`}>
                    <Link to="/buy-ticket">Schedule</Link>
                   
                    <div className="dropdown-btn"><span className="fa fa-angle-down"></span></div>
                </li>
                <li><Link to="/contact#">Contact</Link></li> 
               {/* <li className={`dropdown ${parentMenu === 'about' ? 'current' : ''}`}>
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
                    <Link to={void (0)} onClick={toggleMenu}>Our Team</Link>
                    <ul className='sub-menu'>
                        <li><Link to="/speakers#">Speakers</Link></li>
                        <li><Link to="/speakers-detail/1#">Speakers Detail</Link></li>
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
                */}
            </ul>
        </>
    );
};

export default MainMenu;