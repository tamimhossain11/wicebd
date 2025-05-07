import React from 'react';
import SocialShare from '../others/SocialShare';
import { HashLink as Link } from 'react-router-hash-link'

const SingleSpeakerV3 = ({ speaker }) => {
    const { id, thumb, name, designation } = speaker

    return (
        <>
            <div className="inner-box">
            <figure className="image"><img src={`/src/assets/images/teams/${thumb}`} alt="image"/></figure>
                <div className="image-box">
                </div>
                <div className="info-box">
                <h4 className="name">{name}</h4>
                    <span className="designation">{designation}</span>
                </div>
                <div className="social-box">
                </div>
            </div>
        </>
    );
};

export default SingleSpeakerV3;