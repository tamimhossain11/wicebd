import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SingleBlogGrid = ({ blog }) => {
    const { id, thumb, comments, commentsIcon, author, authorIcon, title, btnText } = blog

    return (
        <>
            <div className="inner-box">
                <div className="image-box">
                    <figure className="image"><Link to={`/blog-single/${id}#`}><img src={`../images/resource/${thumb}`} alt="image" /></Link></figure>
                </div>
                <div className="lower-content">
                    <ul className="post-info">
                        <li><span className={authorIcon}></span> {author}</li>
                        <li><span className={commentsIcon}></span> Comment {comments}</li>
                    </ul>
                    <h4><Link to={`/blog-single/${id}#`}>{title}</Link></h4>
                    <div className="btn-box"><Link to={`/blog-single/${id}#`} className="read-more">{btnText}</Link></div>
                </div>
            </div>
        </>
    );
};

export default SingleBlogGrid;