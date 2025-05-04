import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SingleLatestPost = ({ post }) => {
    const { id, thumbMini, date, title } = post

    return (
        <>
            <article className="post">
                <div className="post-inner">
                    <figure className="post-thumb"><Link to={`/blog-single/${id}#`}><img src={`../images/resource/${thumbMini}`} alt="image" /></Link></figure>
                    <div className="post-info">{date}</div>
                    <div className="text"><Link to={`/blog-single/${id}#`}>{title}</Link></div>
                </div>
            </article>
        </>
    );
};

export default SingleLatestPost;