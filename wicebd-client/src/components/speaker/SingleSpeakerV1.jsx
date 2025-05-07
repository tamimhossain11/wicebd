import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import SocialShare from '../others/SocialShare';

const SingleSpeakerV1 = ({ speaker }) => {
    const { id, thumb, name, designation } = speaker

    return (
        <>
            <div className="inner-box">
                <div className="image-box">
                </div>
                <div className="info-box">
                    <div className="inner">
                        <h4 className="name">{name}</h4>
                        <span className="designation">{designation}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleSpeakerV1;