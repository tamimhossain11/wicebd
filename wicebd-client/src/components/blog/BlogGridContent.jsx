import React, { useState } from 'react';
import BlogContentV1Data from '../../jsonData/blog/BlogContentV1Data.json'
import SingleBlogGrid from './SingleBlogGrid';
import Pagination from 'react-paginate';

const BlogGridContent = () => {

    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentGalleryData = BlogContentV1Data.slice(startIndex, endIndex);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
    };

    const totalPages = Math.ceil(BlogContentV1Data.length / itemsPerPage);

    return (
        <>
            <section className="news-section alternate">
                <div className="auto-container">
                    <div className="row">
                        {currentGalleryData.map(blog =>
                            <div className="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInRight" key={blog.id}>
                                <SingleBlogGrid blog={blog} />
                            </div>
                        )}
                    </div>
                    <Pagination
                        previousLabel={currentPage === 1 ? <i className='icon fa fa-ban'></i> : <i className='icon fa fa-angle-left'></i>}
                        nextLabel={currentPage === totalPages ? <i className='icon fa fa-ban'></i> : <i className='icon fa fa-angle-right'></i>}
                        breakLabel={'...'}
                        pageCount={Math.ceil(BlogContentV1Data.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'styled-pagination text-center'}
                        activeClassName={'active'}
                    />
                </div>
            </section>
        </>
    );
};

export default BlogGridContent;