import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from 'react-photoswipe-gallery';

const SingleImageBox = ({ gallery }) => {
    const { thumb } = gallery

    return (
        <>
            <div className="image-box">
                <figure className="image"><img src={`../images/gallery/${thumb}`} alt="image" /></figure>
                <div className="overlay-box">
                    <Link className="lightbox-image">
                        <Item
                            original={`../images/gallery/${thumb}`}
                            thumbnail={`../images/gallery/${thumb}`}
                            width="370"
                            height="370"
                        >
                            {({ ref, open }) => (
                                <span ref={ref} onClick={open} className="icon fa fa-expand-arrows-alt" />
                            )}
                        </Item>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SingleImageBox;