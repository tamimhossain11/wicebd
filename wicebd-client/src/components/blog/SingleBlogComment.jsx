import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SingleBlogComment = ({ comment }) => {
    const { authorThumb, name, designation, text, btnText, btnClass } = comment

    return (
        <>
            <div className="comment-box">
                <div className="comment">
                    <div className="author-thumb"><img src={`../images/resource/${authorThumb}`} alt="image" /></div>
                    <div className="comment-info">
                        <div className="name">{name}</div> -
                        <div className="date">{designation}</div>
                    </div>
                    <div className="text">{text}</div>
                    <Link to="#" className={btnClass}><span className="btn-title">{btnText}</span></Link>
                </div>
            </div>
        </>
    );
};

export default SingleBlogComment;