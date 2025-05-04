import React from 'react';
import BlogContentV1Data from '../../jsonData/blog/BlogContentV1Data.json'
import SingleLatestPost from './SingleLatestPost';

const LatestPost = () => {
    return (
        <>
            <div className="sidebar-widget popular-posts">
                <h4 className="sidebar-title">Latest Posts</h4>
                <div className="widget-content">
                    {BlogContentV1Data.slice(0, 3).map(post =>
                        <SingleLatestPost post={post} key={post.id} />
                    )}
                </div>
            </div>
        </>
    );
};

export default LatestPost;