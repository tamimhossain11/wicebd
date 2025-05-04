import React from 'react';
import TestimonialV1Data from '../../jsonData/testimonial/TestimonialV1Data.json'
import SingleTestimonialV1 from './SingleTestimonialV1';
import Slider from 'react-slick';

const TestimonialV1 = () => {

    const NextArrow = (props) => {
        return <button className="custom-next-arrow" onClick={props.onClick}>
            <i className="arrow_carrot-right"></i>
        </button>;
    };

    const PrevArrow = (props) => {
        return <button className="custom-prev-arrow" onClick={props.onClick}>
            <i className="arrow_carrot-left"></i>
        </button>;
    };

    const settings = {
        slidesToShow: 1,
        infinite: true,
        autoplay: false,
        draggable: true,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToScroll: 1,
        loop: true,
    }

    return (
        <>
            <section className="testimonial-section">
                <div className="bg-layer" style={{ backgroundImage: "url(images/background/10.jpg)" }}></div>
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">Testimonials</span>
                        <h2>What Clients Say </h2>
                    </div>
                    <div className="carousel-outer">
                        <div className="single-item-carousel slick-carousel">
                            <Slider {...settings}>
                                {TestimonialV1Data.map(testimonial =>
                                    <SingleTestimonialV1 testimonial={testimonial} key={testimonial.id} />
                                )}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
};

export default TestimonialV1;