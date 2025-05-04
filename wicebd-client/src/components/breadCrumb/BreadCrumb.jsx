import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const BreadCrumb = ({ title, breadCrumb }) => {
    return (
        <>
            <section className="page-title" style={{ backgroundImage: "url(/images/background/5.jpg)" }}>
                <div className="auto-container">
                    <h1>{title ? title : "Error Page"}</h1>
                    <ul className="bread-crumb clearfix">
                        <li><Link to="/#">Home</Link></li>
                        <li>{breadCrumb ? breadCrumb : "Error Page"}</li>
                    </ul>
                </div>
            </section >
        </>
    );
};

export default BreadCrumb;