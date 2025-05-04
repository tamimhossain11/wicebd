import React from 'react';
import RatingsFive from '../others/RatingsFive';

const SingleTestimonialV1 = ({ testimonial }) => {
    const { icon, text, name } = testimonial

    return (
        <>
            <div className="testimonial-block">
                <div className="inner">
                    <span className={icon}></span>
                    <div className="text">{text}</div>
                    <div className="name">{name}</div>
                    <div className="rating">
                        <RatingsFive />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleTestimonialV1;