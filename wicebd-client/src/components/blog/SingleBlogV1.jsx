import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SingleBlogV1 = ({ blog }) => {
    const { id, thumb, author, authorIcon, comment, commentsIcon, title, btnText } = blog

    return (
        <>
            <div className="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInRight">
                <div className="inner-box">
                    <div className="image-box">
                        <figure className="image"><Link to={`/blog-single/${id}`}><img src={`../images/resource/${thumb}`} alt="image" /></Link></figure>
                    </div>
                    <div className="lower-content">
                        <ul className="post-info">
                            <li><span className={authorIcon}></span> {author}</li>
                            <li><span className={commentsIcon}></span> Comment {comment}</li>
                        </ul>
                        <h4><Link to={`/blog-single/${id}`}>{title}</Link></h4>
                        <div className="btn-box"><Link to={`/blog-single/${id}`} className="read-more">{btnText}</Link></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleBlogV1;