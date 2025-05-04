import React from 'react';
import { useParams } from 'react-router-dom';
import ScheduleV1Data from '../../jsonData/schedule/ScheduleV1Data.json'

const EventDetailsContent = () => {
    const { parentId, childId } = useParams();

    return (
        <>
            <section className="event-detail">
                <div className="auto-container">
                    <div className="image-box">
                        <figure className="image wow fadeIn"><img src={`/images/resource/${ScheduleV1Data[parentId - 1].tabData[childId - 1].eventThumb}`} alt="" /></figure>
                    </div>
                    <div className="content-box">
                        <div className="speaker-info">
                            <figure className="thumb">
                                <img src={`/images/resource/${ScheduleV1Data[parentId - 1].tabData[childId - 1].speakerThumb}`} alt="image" />
                            </figure>
                            <h5 className="name">{ScheduleV1Data[parentId - 1].tabData[childId - 1].name}</h5>
                            <span className="designation">{ScheduleV1Data[parentId - 1].tabData[childId - 1].designation}</span>
                        </div>
                        <ul className="upper-info">
                            <li><span className="icon far fa-clock"></span>{ScheduleV1Data[parentId - 1].tabData[childId - 1].sessionStart} - {ScheduleV1Data[parentId - 1].tabData[childId - 1].sessionEnd}</li>
                            <li><span className="icon fa fa-map-marker-alt"></span>Bennelong Point, Sydney NSW 2000, Australia</li>
                        </ul>
                        <h2>{ScheduleV1Data[parentId - 1].tabData[childId - 1].title}</h2>
                        <p>Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.duis aute irure dolor in repre hen derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur cepteur sint occaecat cupidatat eaque ipsa quae illo proident sunt in culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error sit voluptatem accusantium dolore laudant rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto.</p>
                        <p>Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.duis aute irure dolor in reprehen derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur cepteur sint occaecat cupidatat.</p>
                        <div className="row two-column">
                            <div className="column col-lg-6 col-md-12">
                                <figure className="image"><img src="/images/resource/post-img.jpg" alt="image" /></figure>
                            </div>
                            <div className="column col-lg-6 col-md-12">
                                <h4>Evolution of user Interface</h4>
                                <ul className="list-style-two">
                                    <li>Multiple Announcements during the event.</li>
                                    <li>Logo & company details on the WordCamp Kolkata.</li>
                                    <li>Dedicated blog post thanking each of our Gold.</li>
                                    <li>Acknowledgment and thanks in opening and closing.</li>
                                </ul>
                            </div>
                        </div>
                        <p>Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.duis aute irure dolor in repre hen derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur cepteur sint occaecat cupidatat eaque ipsa quae illo proident sunt in culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error sit voluptatem accusantium dolore laudant rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto.</p>
                        <p>Dolor sit amet consectetur elit sed do eiusmod tempor incd idunt labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.duis aute irure dolor in reprehen derit in voluptate velit esse cillum dolore eu fugiat nulla pariatur cepteur sint occaecat cupidatat.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EventDetailsContent;