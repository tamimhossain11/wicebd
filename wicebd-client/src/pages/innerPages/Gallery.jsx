import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from "../../components/footer/FooterV2";
import GalleryPageContent from '../../components/gallery/GalleryPageContent';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';

const Gallery = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='about' />
                <BreadCrumb title="Gallery" breadCrumb="gallery" />
                <GalleryPageContent />
                <FooterV2 />
            </div>
        </>
    );
};

export default Gallery;