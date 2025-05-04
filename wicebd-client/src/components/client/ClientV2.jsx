import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import ClientV2Data from '../../jsonData/client/ClientV2Data.json'

const ClientV2 = () => {
    return (
        <>
            <section className="clients-section-two" style={{ backgroundImage: "url(../images/background/9.jpg)" }}>
                <div className="auto-container">
                    <div className="sponsors-outer">
                        <div className="row">
                            {ClientV2Data.map(client =>
                                <div className="client-block col-xl-2 col-lg-3 col-md-4 col-sm-6" key={client.id}>
                                    <figure className="image-box"><Link to={void (0)}><img src={`images/clients/${client.clientThumb}`} alt="image" /></Link></figure>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ClientV2;