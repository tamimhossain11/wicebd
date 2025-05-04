import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import CategoryData from '../../jsonData/widget/CategoryData.json'

const CategoriesWidget = () => {
    return (
        <>
            <div className="sidebar-widget categories">
                <h4 className="sidebar-title">Categories</h4>
                <div className="widget-content">
                    <ul className="blog-categories">
                        {CategoryData.map(category =>
                            <li key={category.id}><Link to="#">{category.categoryName} <span>{category.quantity}</span></Link></li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default CategoriesWidget;