import React from 'react';
import SocialShare from '../others/SocialShare';
import { HashLink as Link } from 'react-router-hash-link'

const SingleSpeakerV3 = ({ speaker }) => {
    const { id, thumb, name, designation } = speaker

    return (
        <>
            <div className="inner-box">
                <div className="image-box">
                    <figure className="image"><Link to={`/speakers-detail/${id}#`}><img src={`../images/resource/${thumb}`} alt="images" /></Link></figure>
                </div>
                <div className="info-box">
                    <h4 className="name"><Link to={`/speakers-detail/${id}#`}>{name}</Link></h4>
                    <span className="designation">{designation}</span>
                </div>
                <div className="social-box">
                    <ul className="social-links social-icon-colored">
                        <SocialShare />
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SingleSpeakerV3;