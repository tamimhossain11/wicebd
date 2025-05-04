import React from 'react';
import ReactWOW from 'react-wow';
import BlogContentV1Data from '../../jsonData/blog/BlogContentV1Data.json'
import SingleBlogV1 from './SingleBlogV1';

const BlogV1 = ({ hasShape = false }) => {
    return (
        <>
            <section className="news-section">
                {hasShape ?
                    <>
                        <div className="anim-icons">
                            <span className="icon icon-circle-blue wow fadeIn"></span>
                            <ReactWOW animation='zoomIn'>
                                <span className="icon twist-line-1"></span>
                            </ReactWOW>
                            <ReactWOW animation='zoomIn'>
                                <span className="icon twist-line-2"></span>
                            </ReactWOW>
                            <ReactWOW animation='zoomIn'>
                                <span className="icon twist-line-3"></span>
                            </ReactWOW>
                        </div>
                    </>
                    : <></>}
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">Blogs</span>
                        <h2>Latest News</h2>
                    </div>
                    <div className="row">
                        {BlogContentV1Data.slice(15, 18).map(blog =>
                            <SingleBlogV1 blog={blog} key={blog.id} />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default BlogV1;