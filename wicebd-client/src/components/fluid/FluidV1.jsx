import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const FluidV1 = () => {
    return (
        <>
            <section className="fluid-section-one">
                <div className="outer-box clearfix">
                    <div className="content-column">
                        <div className="shape-layers">
                            <div className="shape-2"></div>
                            <div className="shape-1"></div>
                        </div>
                        <div className="inner-column">
                            <h3>Modern Marketing <br />Summit Sydney 2018</h3>
                            <div className="text">Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat</div>
                            <div className="btn-box"><Link to="/buy-ticket#" className="theme-btn btn-style-four"><span className="btn-title">Buy Ticket</span></Link></div>
                        </div>
                    </div>
                    <div className="image-column" style={{ backgroundImage: "url(../images/resource//image-1.jpg)" }}>
                        <div className="image-box">
                            <figure className="image"><img src="../images/resource/image-1.jpg" alt="image" /></figure>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FluidV1;