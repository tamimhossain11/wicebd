import React from 'react';
import SocialShare from '../others/SocialShare';

const SpeakerInfo = ({ speakerInfo }) => {
    const { thumb, name } = speakerInfo

    return (
        <>
            <section className="speaker-detail">
                <div className="auto-container">
                    <div className="row">
                        <div className="image-column col-lg-4 col-md-12 col-sm-12">
                            <div className="image-box">
                                <figure className="image"><img src={`../images/resource/${thumb}`} alt="image" /></figure>
                                <ul className="social-icon-two social-icon-colored text-center">
                                    <SocialShare />
                                </ul>
                            </div>
                        </div>
                        <div className="info-column col-lg-8 col-md-12 col-sm-12">
                            <div className="inner-column">
                                <div className="text-box">
                                    <h3>{name}</h3>
                                    <p>Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
                                    <h4>Sessions by Marke</h4>
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="speaker-session-info">
                                                <h5>Day 1</h5>
                                                <span> 10.30 - 11.30 am </span>
                                                <p> Marketing Matters </p>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="speaker-session-info">
                                                <h5>Day 2</h5>
                                                <span> 12.30 - 11.30 am </span>
                                                <p> Education Matters </p>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="speaker-session-info">
                                                <h5>Day 3</h5>
                                                <span> 12.30 - 11.30 am </span>
                                                <p> Education Matters </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SpeakerInfo;