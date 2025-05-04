import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const SingleClientV1 = ({ client }) => {
    const { title } = client

    return (
        <>
            <div className="sponsors-outer">
                <h3>{title}</h3>
                <div className="row">
                    {client.clientData.map(thumb =>
                        <div className="client-block col-lg-3 col-md-6 col-sm-12" key={thumb.id}>
                            <figure className="image-box"><Link to={void (0)}><img src={`images/clients/${thumb.clientThumb}`} alt="image" /></Link></figure>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SingleClientV1;