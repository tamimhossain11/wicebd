import React from 'react';
import { Item } from 'react-photoswipe-gallery';
import { Link } from 'react-router-dom';

const SingleGalleryV1 = ({ album }) => {
    const { fullThumb, miniThumb } = album

    return (
        <>
            <div className="insta-feeds">
                <figure className="image mb-0"> <img src={`/images/gallery/${miniThumb}`} alt="image" /> </figure>
                <div className="overlay-box">
                    <Link className='insta-image'>
                        <Item
                            original={`/images/gallery/${fullThumb}`}
                            thumbnail={`/images/gallery/${miniThumb}`}
                            width="370"
                            height="370"
                        >
                            {({ ref, open }) => (
                                <span ref={ref} onClick={open} className='fas fa-link' />
                            )}
                        </Item>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SingleGalleryV1;