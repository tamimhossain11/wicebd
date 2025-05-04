import React from 'react';
import BannerV1Data from '../../jsonData/banner/BannerV1Data.json'
import SingleBannerV1 from './SingleBannerV1';
import Slider from 'react-slick';

const BannerV1 = () => {

    const NextArrow = (props) => {
        return <button className="slick-next" onClick={props.onClick}>
            <i className="fa fa-angle-right" />
        </button>;
    };

    const PrevArrow = (props) => {
        return <button className="slick-prev" onClick={props.onClick}>
            <i className="fa fa-angle-left" />
        </button>;
    };

    const settings = {
        infinite: true,
        autoplay: true,
        arrows: true,
        slidesToShow: 1,
        speed: 500,
        slidesToScroll: 1,
        fade: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    }

    return (
        <>
            <section className="banner-section">
                <div className="banner-carousel">
                    <Slider {...settings}>
                        {BannerV1Data.map(banner =>
                            <SingleBannerV1 banner={banner} key={banner.id} />
                        )}
                    </Slider>
                </div>
            </section>
        </>
    );
};

export default BannerV1;