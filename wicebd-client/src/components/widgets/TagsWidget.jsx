import React from 'react';
import TagsData from '../../jsonData/widget/TagsData.json'
import { HashLink as Link } from 'react-router-hash-link'

const TagsWidget = () => {
    return (
        <>
            <div className="sidebar-widget popular-tags">
                <h4 className="sidebar-title">Tags</h4>
                <div className="widget-content">
                    {TagsData.map(tag =>
                        <Link to="#" key={tag.id}>{tag.tagName}</Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default TagsWidget;