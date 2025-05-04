import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV1 from '../../components/footer/FooterV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import BlogGridContent from '../../components/blog/BlogGridContent';

const BlogGrid = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='blog' />
                <BreadCrumb title="Blog Grid" breadCrumb="blog-grid" />
                <BlogGridContent />
                <FooterV1 />
            </div>
        </>
    );
};

export default BlogGrid;