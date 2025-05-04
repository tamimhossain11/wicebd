import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import FooterV1 from '../../components/footer/FooterV1';
import BlogSingleContent from '../../components/blog/BlogSingleContent';
import { useParams } from 'react-router-dom';
import BlogContentV1Data from '../../jsonData/blog/BlogContentV1Data.json'

const BlogSingle = () => {

    const { id } = useParams()
    const data = BlogContentV1Data.filter(speaker => speaker.id === parseInt(id))[0]

    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='blog' />
                <BreadCrumb title="Blog Single" breadCrumb="blog-single" />
                <BlogSingleContent blogInfo={data} />
                <FooterV1 />
            </div>
        </>
    );
};

export default BlogSingle;