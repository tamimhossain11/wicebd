import React from 'react';
import GalleryV2Data from '../../jsonData/gallery/GalleryV2Data.json'
import { Gallery } from 'react-photoswipe-gallery';
import Slider from 'react-slick';
import SingleImageBox from './SingleImageBox';

const GalleryV3 = () => {

    const settings = {
        infinite: true,
        autoplay: true,
        arrows: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplaySpeed: 5000,
    }

    return (
        <>
            <section className="gallery-section style-two">
                <div className="gallery-carousel">
                    <Gallery withDownloadButton>
                        <Slider {...settings}>
                            {GalleryV2Data.slice(0, 6).map(gallery =>
                                <div className="gallery-item" key={gallery.id}>
                                    <SingleImageBox gallery={gallery} />
                                </div>
                            )}
                        </Slider>
                    </Gallery>
                </div>
            </section>
        </>
    );
};

export default GalleryV3;