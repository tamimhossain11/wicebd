import React, { useState } from 'react';
import { Gallery } from 'react-photoswipe-gallery';
import GalleryV2Data from '../../jsonData/gallery/GalleryV2Data.json'
import SingleImageBox from './SingleImageBox';
import Pagination from 'react-paginate';

const GalleryPageContent = () => {

    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [itemsPerPage, setItemsPerPage] = useState(9);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentGalleryData = GalleryV2Data.slice(startIndex, endIndex);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
    };

    const totalPages = Math.ceil(GalleryV2Data.length / itemsPerPage);

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
                            {currentGalleryData.map(gallery =>
                                <div className="gallery-item col-lg-4 col-md-6 col-sm-12" key={gallery.id} >
                                    <SingleImageBox gallery={gallery} />
                                </div>
                            )}
                        </Gallery>
                        <Pagination
                            previousLabel={currentPage === 1 ? <i className='icon fa fa-ban'></i> : <i className='icon fa fa-angle-left'></i>}
                            nextLabel={currentPage === totalPages ? <i className='icon fa fa-ban'></i> : <i className='icon fa fa-angle-right'></i>}
                            breakLabel={'...'}
                            pageCount={Math.ceil(GalleryV2Data.length / itemsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'styled-pagination text-center'}
                            activeClassName={'active'}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default GalleryPageContent;