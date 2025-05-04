import React, { useState } from 'react';
import BlogContentV1Data from '../../jsonData/blog/BlogContentV1Data.json'
import SingleBlogContent from './SingleBlogContent';
import Pagination from 'react-paginate';
import SearchWidget from '../widgets/SearchWidget';
import CategoriesWidget from '../widgets/CategoriesWidget';
import TagsWidget from '../widgets/TagsWidget';
import LatestPost from './LatestPost';

const BlogPageContent = () => {

    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [itemsPerPage, setItemsPerPage] = useState(4);

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
            <div className="sidebar-page-container">
                <div className="auto-container">
                    <div className="row clearfix">
                        <div className="content-side col-lg-8 col-md-12 col-sm-12">
                            <div className="blog-sidebar">
                                {currentGalleryData.map(blog =>
                                    <SingleBlogContent blog={blog} key={blog.id} />
                                )}
                                <Pagination
                                    previousLabel={currentPage === 1 ? <i className='icon fa fa-ban'></i> : <i className='icon fa fa-angle-left'></i>}
                                    nextLabel={currentPage === totalPages ? <i className='icon fa fa-ban'></i> : <i className='icon fa fa-angle-right'></i>}
                                    breakLabel={'...'}
                                    pageCount={Math.ceil(BlogContentV1Data.length / itemsPerPage)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageClick}
                                    containerClassName={'styled-pagination'}
                                    activeClassName={'active'}
                                />
                            </div>
                        </div>
                        <div className="sidebar-side col-lg-4 col-md-12 col-sm-12">
                            <aside className="sidebar padding-left">
                                <SearchWidget />
                                <CategoriesWidget />
                                <LatestPost />
                                <TagsWidget />
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogPageContent;