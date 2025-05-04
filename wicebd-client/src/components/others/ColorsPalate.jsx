import React, { useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const ColorsPalate = () => {

    // Color Palate 
    useEffect(() => {
        const boxedLayout = localStorage.getItem('boxedLayout');
        const pageDirection = localStorage.getItem('pageDirection');

        if (boxedLayout === 'true') {
            document.body.classList.add('box-layout');
        }

        const pageWrapper = document.querySelector('.page-wrapper');
        if (pageDirection === 'rtl') {
            pageWrapper.classList.add('rtl');
        }

    }, []);

    const openColorPlate = (event) => {
        event.preventDefault();
        const colorPalate = document.querySelector('.color-palate');
        colorPalate.classList.toggle('visible-palate');
    }

    const boxedLayout = (event) => {
        event.preventDefault();
        document.body.classList.add('box-layout')

        localStorage.setItem('boxedLayout', true);
    }

    const fullWidthLayout = (event) => {
        event.preventDefault();
        document.body.classList.remove('box-layout')

        localStorage.removeItem('boxedLayout');
    }

    const rightToLeft = (event) => {
        event.preventDefault();
        const pageWrapper = document.querySelector('.page-wrapper');
        pageWrapper.classList.add('rtl');

        localStorage.setItem('pageDirection', 'rtl');
    }

    const leftToRight = (event) => {
        event.preventDefault();
        const pageWrapper = document.querySelector('.page-wrapper');
        pageWrapper.classList.remove('rtl');

        localStorage.removeItem('pageDirection');
    }

    return (
        <>
            <div className={`color-palate ${openColorPlate ? "" : "visible-palate"}`}>
                <div className="color-trigger" onClick={openColorPlate}>
                    <i className="fa fa-cog"></i>
                </div>
                <div className="color-palate-head">
                    <h6>Choose Your Demo</h6>
                </div>
                <ul className="box-version option-box"> <li onClick={fullWidthLayout}>Full width</li> <li className="box" onClick={boxedLayout}>Boxed</li> </ul>
                <ul className="rtl-version option-box"> <li onClick={leftToRight}>LTR Version</li> <li className="rtl" onClick={rightToLeft}>RTL Version</li> </ul>
                <div className="palate-foo">
                    <span>You will find much more options for colors and styling in admin panel. This color picker is used only for demonstation purposes.</span>
                </div>
                <Link to="/contact#" className="purchase-btn">Purchase now</Link>
            </div>
        </>
    );
};

export default ColorsPalate;