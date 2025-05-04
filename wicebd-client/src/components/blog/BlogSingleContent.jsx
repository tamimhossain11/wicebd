import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import TagsWidget from '../widgets/TagsWidget';
import CategoriesWidget from '../widgets/CategoriesWidget';
import SearchWidget from '../widgets/SearchWidget';
import BlogForm from '../form/BlogForm';
import SocialShare from '../others/SocialShare';
import BlogComment from './BlogComment';
import LatestPost from './LatestPost';

const BlogSingleContent = ({ blogInfo }) => {
    const { thumb, comments, author, authorIcon, commentsIcon, title } = blogInfo

    return (
        <>
            <div className="sidebar-page-container">
                <div className="auto-container">
                    <div className="row clearfix">
                        <div className="content-side col-lg-8 col-md-12 col-sm-12">
                            <div className="blog-single">
                                <div className="news-block">
                                    <div className="inner-box">
                                        <div className="image-box">
                                            <figure className="image"><img src={`../images/resource/${thumb}`} alt="image" /></figure>
                                        </div>
                                        <div className="lower-content">
                                            <ul className="post-info">
                                                <li><span className={authorIcon}></span> {author}</li>
                                                <li><span className={commentsIcon}></span> Comment {comments}</li>
                                            </ul>
                                            <h2>{title}</h2>
                                            <p>Sed quia conse quuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
                                            <blockquote>
                                                <span className="icon fa fa-quote-left"></span>
                                                <p>Its crazy, but the things you love, prospective buyers might hate—and that means you might have a hard time unloading your home when it comes time to sell. Heres how to choose wisely</p>
                                                <cite> David Leo</cite>
                                            </blockquote>
                                            <p>or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-share-options clearfix">
                                    <div className="pull-left">
                                        <ul className="tags">
                                            <li><Link to="#">Eventa</Link></li>
                                            <li><Link to="#">Conference</Link></li>
                                            <li><Link to="#">Business</Link></li>
                                        </ul>
                                    </div>
                                    <div className="social-icon-three pull-right">
                                        <ul className="social-icon-three">
                                            <SocialShare />
                                        </ul>
                                    </div>
                                </div>
                                <BlogComment />
                                <div className="comment-form">
                                    <div className="group-title">
                                        <h3>Leave a comment</h3>
                                    </div>
                                    <BlogForm />
                                </div>
                            </div>
                        </div>
                        <div className="sidebar-side col-lg-4 col-md-12 col-sm-12">
                            <aside className="sidebar padding-left">
                                <SearchWidget />
                                <CategoriesWidget />
                                <LatestPost />
                                <TagsWidget />
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogSingleContent;