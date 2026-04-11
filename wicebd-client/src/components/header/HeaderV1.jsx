import React, { useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import SearchPopup from '../others/SearchPopup';
import MainMenu from './MainMenu';
import { useAuth } from '../../context/AuthContext';

const HeaderV1 = ({ headerStyle, parentMenu }) => {
    const { user, role, logout } = useAuth();

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

    // Clean up body overflow lock on unmount
    useEffect(() => {
        return () => { document.body.style.overflow = ''; };
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
        setOpenMenu(true);
        document.body.style.overflow = 'hidden';
    }

    const handleCloseMenu = () => {
        setOpenMenu(false);
        document.body.style.overflow = '';
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
            <header className={`main-header ${headerStyle ? headerStyle : ""} ${isSticky ? "fixed-header scrolled-header" : ""}`}>
                <div className="main-box">
                    <div className="auto-container clearfix">
                        <div className="logo-box">
                            <div className="logo">
                                <Link to="/#">
                                    <img
                                        src={isSticky ? "/images/logo-normal.PNG" : "/images/logo-static.PNG"}
                                        alt="WICEBD"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="nav-outer clearfix">
                            <div className="mobile-nav-toggler" onClick={handleOpenMenu}><span className="icon flaticon-menu"></span></div>
                            <nav className="main-menu navbar-expand-lg navbar-light">
                                <div className="collapse navbar-collapse clearfix" id="navbarSupportedContent">
                                    <MainMenu parentMenu={parentMenu} />
                                </div>
                            </nav>
                            <div className="outer-box d-none d-lg-flex">
                                <div className="search-box-outer">
                                    <div className="search-box-btn"><span className={`flaticon-search`} onClick={searchOpen}></span></div>
                                </div>
                                {user ? (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginLeft: 16 }}>
                                        <Link
                                            to={role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                            style={{
                                                color: 'rgba(255,255,255,0.9)',
                                                fontSize: 14,
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6,
                                            }}
                                        >
                                            <span className="fa fa-user-circle" style={{ fontSize: 18 }}></span>
                                            {user.name?.split(' ')[0]}
                                        </Link>
                                        <button
                                            onClick={logout}
                                            style={{
                                                background: 'rgba(255,255,255,0.12)',
                                                border: '1px solid rgba(255,255,255,0.25)',
                                                borderRadius: 4,
                                                color: '#fff',
                                                fontSize: 12,
                                                padding: '4px 10px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to="/sign-in"
                                        style={{
                                            marginLeft: 16,
                                            background: '#e94560',
                                            color: '#fff',
                                            padding: '8px 20px',
                                            borderRadius: 4,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            display: 'inline-block',
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile menu — rendered OUTSIDE <header> so page sections can't cover it ── */}
            <div className={`wice-mobile-overlay${openMenu ? ' wice-mobile-overlay--open' : ''}`}>
                {/* Backdrop */}
                <div className="wice-mobile-backdrop" onClick={handleCloseMenu} />

                {/* Slide-in panel */}
                <nav className="wice-mobile-panel">
                    {/* Top: logo + close */}
                    <div className="wice-mobile-panel__header">
                        <Link to="/#" onClick={handleCloseMenu}>
                            <img src="/images/logo-normal.PNG" alt="WICEBD" style={{ height: 38, objectFit: 'contain' }} />
                        </Link>
                        <button
                            onClick={handleCloseMenu}
                            className="wice-mobile-panel__close"
                            aria-label="Close menu"
                        >
                            <span className="icon flaticon-cancel-music" />
                        </button>
                    </div>

                    {/* Nav links */}
                    <div className="wice-mobile-panel__nav">
                        <MainMenu toggleMultiMenu={toggleMultiMenu} toggleMenu={toggleMenu} parentMenu={parentMenu} />
                    </div>

                    {/* Bottom: auth */}
                    <div className="wice-mobile-panel__auth">
                        {user ? (
                            <>
                                <Link
                                    to={role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                    onClick={handleCloseMenu}
                                    className="wice-mobile-auth-user"
                                >
                                    <span className="fa fa-user-circle" />
                                    <span>{user.name?.split(' ')[0]}</span>
                                    <span className="wice-mobile-auth-badge">
                                        {role === 'admin' ? 'Admin' : 'Dashboard'}
                                    </span>
                                </Link>
                                <button onClick={() => { handleCloseMenu(); logout(); }} className="wice-mobile-auth-signout">
                                    <span className="fa fa-sign-out-alt" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link to="/sign-in" onClick={handleCloseMenu} className="wice-mobile-auth-signin">
                                <span className="fa fa-user" />
                                Sign In
                            </Link>
                        )}
                    </div>
                </nav>
            </div>

            <SearchPopup openSearch={openSearch} searchClose={searchClose} />
        </>
    );
};

export default HeaderV1;