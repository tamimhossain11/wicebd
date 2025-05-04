import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SocialShare = () => {
    return (
        <>
            <li>
                <Link to="http://facebook.com" target='_blank'><i className="fab fa-facebook-f"></i></Link>
            </li>
            <li>
                <Link to="http://twitter.com" target='_blank'><i className="fab fa-twitter"></i></Link>
            </li>
            <li>
                <Link to="http://pinterest.com" target='_blank'><i className="fab fa-pinterest"></i></Link>
            </li>
            <li>
                <Link to="http://dribbble.com" target='_blank'><i className="fab fa-dribbble"></i></Link>
            </li>
        </>
    );
};

export default SocialShare;