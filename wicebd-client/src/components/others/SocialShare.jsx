import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const SocialShare = () => {
    const socialLinks = [
        { href: "https://facebook.com", icon: "fab fa-facebook-f", label: "Facebook" },
        { href: "https://twitter.com", icon: "fab fa-twitter", label: "Twitter" },
        { href: "https://pinterest.com", icon: "fab fa-pinterest", label: "Pinterest" },
        { href: "https://dribbble.com", icon: "fab fa-dribbble", label: "Dribbble" }
    ];

    return (
        <ul className="social-share-list">
            {socialLinks.map((social, index) => (
                <li key={index}>
                    <Link to={social.href} target="_blank" aria-label={social.label}>
                        <i className={social.icon}></i>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default SocialShare;
