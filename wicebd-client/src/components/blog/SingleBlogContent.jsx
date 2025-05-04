import React from 'react';
import ReactWOW from 'react-wow';
import { HashLink as Link } from 'react-router-hash-link'

const SingleBlogContent = ({ blog }) => {
    const { id, thumb, comments, commentsIcon, author, authorIcon, title, text, btnText } = blog

    return (
        <>
            <ReactWOW animation='fadeInRight'>
                <div className="news-block wow fadeInRight">
                    <div className="inner-box">
                        <div className="image-box">
                            <figure className="image"><Link to={`/blog-single/${id}#`}><img src={`../images/resource/${thumb}`} alt="image" /></Link></figure>
                        </div>
                        <div className="lower-content">
                            <ul className="post-info">
                                <li><span className={commentsIcon}></span> {author}</li>
                                <li><span className={authorIcon}></span> comments {comments}</li>
                            </ul>
                            <h4><Link to={`/blog-single/${id}#`}>{title}</Link></h4>
                            <div className="text">{text}</div>
                            <div className="btn-box"><Link to={`/blog-single/${id}#`} className="read-more">{btnText}</Link></div>
                        </div>
                    </div>
                </div>
            </ReactWOW>
        </>
    );
};

export default SingleBlogContent;