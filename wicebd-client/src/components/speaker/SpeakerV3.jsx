import React from 'react';
import SpeakerV1Data from '../../jsonData/speaker/SpeakerV1Data.json'
import SingleSpeakerV3 from './SingleSpeakerV3';

const SpeakerV3 = () => {
    return (
        <>
            <section className="speakers-section-three">
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <span className="title">Speakers</span>
                        <h2>Todays Performers</h2>
                    </div>
                    <div className="row">
                        {SpeakerV1Data.map(speaker =>
                            <div className="speaker-block-three col-xl-3 col-lg-4 col-md-6 col-sm-12" key={speaker.id}>
                                <SingleSpeakerV3 speaker={speaker} />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default SpeakerV3;