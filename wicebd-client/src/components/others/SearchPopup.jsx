import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SearchPopup = ({ openSearch, searchClose }) => {

    const handleSearch = (event) => {
        event.preventDefault()
        event.target.reset()
    }

    return (
        <>
            <div id="search-popup" className={`search-popup ${openSearch ? "popup-visible" : ""}`} >
                <div className="close-search theme-btn"><span className="fas fa-window-close" onClick={searchClose}></span></div>
                <div className="popup-inner">
                    <div className="overlay-layer" onClick={searchClose}></div>
                    <div className="search-form">
                        <form onSubmit={handleSearch}>
                            <div className="form-group">
                                <fieldset>
                                    <input type="search" className="form-control" name="search-input" autoComplete='off' placeholder="Search Here" required />
                                    <input type="submit" value="Search Now!" className="theme-btn" />
                                </fieldset>
                            </div>
                        </form>
                        <br />
                        <h3>Recent Search Keywords</h3>
                        <ul className="recent-searches">
                            <li><Link to={void (0)}>Seo</Link></li>
                            <li><Link to={void (0)}>Business</Link></li>
                            <li><Link to={void (0)}>Events</Link></li>
                            <li><Link to={void (0)}>Digital</Link></li>
                            <li><Link to={void (0)}>Conference</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchPopup;