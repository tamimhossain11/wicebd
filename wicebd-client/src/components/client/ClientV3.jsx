import React from 'react';
import ClientV2Data from '../../jsonData/client/ClientV2Data.json'
import { HashLink as Link } from 'react-router-hash-link'
import Slider from 'react-slick';

const ClientV3 = () => {

    const settings = {
        infinite: true,
        autoplay: true,
        arrows: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        lazyLoad: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 1,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]

    }

    return (
        <>
            <section className="clients-section-three" style={{ backgroundImage: "url(images/background/9.jpg)" }}>
                <div className="auto-container">
                    <div className="sponsors-outer">
                        <div className="sponsors-carousel">
                            <Slider {...settings}>
                                {ClientV2Data.map(client =>
                                    <div className="client-block" key={client.id}>
                                        <figure className="image-box"><Link to={void (0)}><img src={`images/clients/${client.clientThumb}`} alt="image" /></Link></figure>
                                    </div>
                                )}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ClientV3;