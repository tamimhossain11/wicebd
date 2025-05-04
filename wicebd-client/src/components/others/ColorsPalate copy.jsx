import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const ColorsPalate = ({ openColorPlate, boxedLayout, fullWidthLayout, leftToRight, rightToLeft }) => {

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