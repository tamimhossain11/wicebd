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
                <figure className="image"><img src={`/src/assets/images/teams/${thumb}`} alt="image"/></figure>
                    <div className="inner">
                        <h4 className="name"><Link to={`/speakers-detail/${id}#`}>{name}</Link></h4>
                        <span className="designation">{designation}</span>
                        <ul className="social-links social-icon-colored">
                            <SocialShare />
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleSpeakerV1;