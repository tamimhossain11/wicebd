import React, { useEffect, useState } from 'react';
import { NavHashLink as Link } from 'react-router-hash-link'
import SearchPopup from '../others/SearchPopup';
import HeaderTopV1 from './HeaderTopV1';
import HeaderTopV2 from './HeaderTopV2';
import MainMenu from './MainMenu';
import ColorsPalate from '../others/ColorsPalate';

const HeaderV1 = ({ headerStyle, whiteLogo = false, headerTopV1, headerTopV2, parentMenu }) => {

    // Sticky Menu 
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 5) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Search Bar
    const [openSearch, setOpenSearch] = useState(false);

    const searchOpen = (event) => {
        event.preventDefault();
        setOpenSearch(!openSearch)
    }

    const searchClose = () => {
        setOpenSearch(false)
    }

    // Mobile Menu 

    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenMenu = (event) => {
        event.preventDefault();
        setOpenMenu(!openMenu)
        document.querySelector(".page-wrapper").classList.add("no-color-palate")
    }

    const handleCloseMenu = () => {
        setOpenMenu(false)
        document.querySelector(".page-wrapper").classList.remove("no-color-palate")
    }

    const toggleMenu = (e) => {
        e.preventDefault();
        const listItem = e.target.parentElement;
        const subMenu = listItem.querySelector('.sub-menu');
        if (subMenu) {
            listItem.classList.toggle('open');
        }
    };

    const toggleMultiMenu = (e) => {
        e.preventDefault();
        const listItem = e.target.parentElement;
        const subMenu = listItem.querySelector('.multi-menu');
        if (subMenu) {
            listItem.classList.toggle('open');
        }
    };

    return (
        <>
            <header className={`main-header ${headerStyle ? headerStyle : ""} ${isSticky ? "fixed-header" : ""}`}>
                {headerTopV1 ?
                    <HeaderTopV1 />
                    : <></>
                }
                {headerTopV2 ?
                    <HeaderTopV2 />
                    : <></>
                }
                <div className="main-box">
                    <div className="auto-container clearfix">
                        <div className="logo-box">
                            {whiteLogo ?
                                <>
                                    <div className="logo"><Link to="/#"><img src="/images/logo.png" alt="image" /></Link></div>
                                </>
                                : <>
                                    <div className="logo"><Link to="/#"><img src="/images/logo-2.png" alt="image" /></Link></div>
                                </>}
                        </div>
                        <div className="nav-outer clearfix">
                            <div className="mobile-nav-toggler" onClick={handleOpenMenu}><span className="icon flaticon-menu"></span></div>
                            <nav className="main-menu navbar-expand-lg navbar-light">
                                <div className="collapse navbar-collapse clearfix" id="navbarSupportedContent">
                                    <MainMenu parentMenu={parentMenu} />
                                </div>
                            </nav>
                            <div className="outer-box d-none d-lg-block">
                                <div className="search-box-outer">
                                    <div className="search-box-btn"><span className={`flaticon-search`} onClick={searchOpen}></span></div>
                                </div>
                                <div className="btn-box">
                                    <Link to="/buy-ticket#" className="theme-btn btn-style-one"><span className="btn-title">Get Tickets</span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${openMenu ? "mobile-menu-visible" : ""}`}>
                    <div className="mobile-menu">
                        <div className="menu-backdrop" ></div>
                        <div className="close-btn"><span className="icon flaticon-cancel-1"></span></div>
                        <nav className="menu-box">
                            <div className="nav-logo"><Link to="/#"><img src="/images/logo-2.png" alt="image" /></Link></div>
                            <MainMenu toggleMultiMenu={toggleMultiMenu} toggleMenu={toggleMenu} parentMenu={parentMenu} />
                        </nav>
                        <div className="close-btn" onClick={handleCloseMenu} ><span className="icon flaticon-cancel-music"></span></div>
                    </div>
                </div>
            </header>
            <SearchPopup openSearch={openSearch} searchClose={searchClose} />
            <ColorsPalate />
        </>
    );
};

export default HeaderV1;