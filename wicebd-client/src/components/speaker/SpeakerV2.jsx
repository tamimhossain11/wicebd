import React from 'react';
import SpeakerV1Data from '../../jsonData/speaker/SpeakerV1Data.json'
import SingleSpeakerV2 from './SingleSpeakerV2';
// import ReactWOW from 'react-wow';

const SpeakerV2 = () => {
    return (
        <>
            <section className="speakers-section-two">
                <div className="anim-icons">
                    <span className="icon icon-circle-4"></span>
                    <span className="icon icon-circle-3"></span>
                </div>
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">Team</span>
                        <h2>Our Team</h2>
                    </div>
                    <div className="row">
                        {SpeakerV1Data.map(speaker =>
                            <SingleSpeakerV2 speaker={speaker} key={speaker.id} />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default SpeakerV2;