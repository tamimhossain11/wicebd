import React from 'react';
import ClientV1Data from '../../jsonData/client/ClientV1Data.json'
import SingleClientV1 from './SingleClientV1';
import ReactWOW from 'react-wow';

const ClientV1 = () => {
    return (
        <>
            <section className="clients-section">
                <div className="anim-icons">
                    <ReactWOW animation='zoomIn'>
                        <span className="icon icon-dots-3"></span>
                    </ReactWOW>
                    <span className="icon icon-circle-blue"></span>
                </div>
                <div className="auto-container">
                    <div className="sec-title">
                        <span className="title">Clients</span>
                        <h2>Official Sponsors</h2>
                    </div>
                    {ClientV1Data.map(client =>
                        <SingleClientV1 key={client.id} client={client} />
                    )}
                </div>
            </section>
        </>
    );
};

export default ClientV1;