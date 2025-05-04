import React from 'react';
import GalleryV2Data from '../../jsonData/gallery/GalleryV2Data.json'
import { Gallery } from 'react-photoswipe-gallery';
import SingleImageBox from './SingleImageBox';

const GalleryV2 = () => {
    return (
        <>
            <section className="gallery-section">
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">Gallery</span>
                        <h2>Event Gallery</h2>
                    </div>
                    <div className="row">
                        <Gallery withDownloadButton>
                            {GalleryV2Data.slice(0, 6).map(gallery =>
                                <div className="gallery-item col-lg-4 col-md-6 col-sm-12" key={gallery.id} >
                                    <SingleImageBox gallery={gallery} />
                                </div>
                            )}
                        </Gallery>
                    </div>
                </div>
            </section>
        </>
    );
};

export default GalleryV2;