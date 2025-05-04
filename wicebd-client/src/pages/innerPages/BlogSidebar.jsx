import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV1 from '../../components/footer/FooterV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import BlogPageContent from '../../components/blog/BlogPageContent';
import { useParams } from 'react-router-dom';
import LatestPostV1 from '../../jsonData/blog/LatestPostV1.json'

const BlogSidebar = () => {

    const { id } = useParams()
    const data = LatestPostV1.filter(speaker => speaker.id === parseInt(id))[0]

    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='blog' />
                <BreadCrumb title="Blog Sidebar" breadCrumb="blog-sidebar" />
                <BlogPageContent sidebarInfo={data} />
                <FooterV1 />
            </div>
        </>
    );
};

export default BlogSidebar;