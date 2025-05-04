import React from 'react';
import BlogCommentData from '../../jsonData/blog/BlogCommentData.json'
import SingleBlogComment from './SingleBlogComment';

const BlogComment = () => {
    return (
        <>
            <div className="comments-area">
                <div className="group-title">
                    <h3>Comments 02</h3>
                </div>
                {BlogCommentData.map(comment =>
                    <SingleBlogComment comment={comment} key={comment.id} />
                )}
            </div>
        </>
    );
};

export default BlogComment;