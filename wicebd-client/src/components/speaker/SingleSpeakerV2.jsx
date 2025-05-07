import React from 'react';
import ReactWOW from 'react-wow';
import { HashLink as Link } from 'react-router-hash-link'
import SocialShare from '../others/SocialShare';

const SingleSpeakerV2 = ({ speaker }) => {
    const { id, thumb, name, designation } = speaker

    return (
        <>
            <ReactWOW animation='fadeInUp'>
                <div className="speaker-block-two col-lg-3 col-md-6 col-sm-12">
                    <div className="inner-box">
                    <figure className="image"><img src={`/src/assets/images/teams/${thumb}`} alt="image"/></figure>
                        <div className="info-box">
                        <h4 className="name">{name}</h4>
                            <span className="designation">{designation}</span>
                        </div>
                        <div className="image-box">
                        </div>
                        <div className="social-box">
                        </div>
                    </div>
                </div>
            </ReactWOW>
        </>
    );
};

export default SingleSpeakerV2;