import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useAuth } from '../../context/AuthContext';

const MainMenu = ({ parentMenu, toggleMenu, toggleMultiMenu }) => {
    const { user } = useAuth();

    return (
        <>
            <ul className="navigation clearfix">
                <li className={`dropdown ${parentMenu === 'home' ? 'current' : ''}`}>
                    <Link to="/#">Home</Link>
                </li>

                {/* Register — only visible to logged-in users */}
                {user && (
                    <li className={`dropdown ${parentMenu === 'register' ? 'current' : ''}`}>
                        <Link to={void (0)} onClick={toggleMenu}>Register</Link>
                        <ul className="sub-menu">
                            <li><Link to="/registration#">Project</Link></li>
                            <li><Link to="/registration?tab=olympiad#">Olympiad</Link></li>
                            <li><Link to="/robo-soccer#">Robo Soccer</Link></li>
                        </ul>
                        <div className="dropdown-btn"><span className="fa fa-angle-down"></span></div>
                    </li>
                )}

                <li className={`dropdown ${parentMenu === 'teams' ? 'current' : ''}`}>
                    <Link to={void (0)} onClick={toggleMenu}>Teams</Link>
                    <ul className="sub-menu">
                        <li><Link to="/selected-teams#">Selected</Link></li>
                        <li><Link to="/international-team#">International</Link></li>
                    </ul>
                    <div className="dropdown-btn"><span className="fa fa-angle-down"></span></div>
                </li>

                <li className={`dropdown ${parentMenu === 'updates' ? 'current' : ''}`}>
                    <Link to={void (0)} onClick={toggleMenu}>Updates</Link>
                    <ul className="sub-menu">
                        <li><Link to="/announcements#">News</Link></li>
                        <li><Link to="/blog-details#">Blog</Link></li>
                        <li><Link to="/partners#">Partners</Link></li>
                    </ul>
                    <div className="dropdown-btn"><span className="fa fa-angle-down"></span></div>
                </li>

                <li className={`dropdown ${parentMenu === 'organizing' ? 'current' : ''}`}>
                    <Link to={void (0)} onClick={toggleMenu}>Organizing Panel</Link>
                    <ul className="sub-menu">
                        <li><Link to="/organizing-panel#">Executives</Link></li>
                        <li><Link to="/organizing-panel#organizers">Organizers</Link></li>
                    </ul>
                    <div className="dropdown-btn"><span className="fa fa-angle-down"></span></div>
                </li>

                <li><Link to="/contact#">Contact</Link></li>

                <li className={`${parentMenu === 'about' ? 'current' : ''}`}>
                    <Link to="/about-us#">About</Link>
                </li>
            </ul>
        </>
    );
};

export default MainMenu;
