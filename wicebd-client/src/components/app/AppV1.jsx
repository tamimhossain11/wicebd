import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'
import ReactWOW from 'react-wow';

const AppV1 = () => {
    return (
        <>
            <section className="app-section">
                <div className="auto-container">
                    <div className="row">
                        <div className="content-column col-lg-5 col-md-12 col-sm-12">
                            <div className="inner-column">
                                <div className="sec-title">
                                    <span className="title">App Download</span>
                                    <h2>WICEBD App</h2>
                                </div>
                                <div className="text-box text-base leading-relaxed space-y-3">
  <p>🚀 <strong>Step into the future of innovation</strong> with the <strong>WICEBD App</strong> – your ultimate companion for the World Invention Competition & Exhibition 2025!</p>
  
  <p>🔔 Stay updated with real-time notifications on event schedules, deadlines, and results.</p>
  
  <p>📚 Unlock exclusive learning resources to enhance your project and presentation skills.</p>
  
  <p>📱 Enjoy seamless registration, project submission, and team coordination—all from your phone.</p>
  
  <p>🌍 Connect with a vibrant community of young innovators, mentors, and global changemakers.</p>
  
  <p>✨ Whether you're in school, college, or university—this app is designed to empower your creativity and ambition.</p>

  <p><strong>Download the WICEBD App today and bring your ideas to life on a global stage. The future is in your hands. 🌟</strong></p>
</div>

                                <div className="link-box">
                                    <Link to="https://www.apple.com/app-store/" target='_blank'><img src="../images/icons/app-store.png" alt="image" /></Link>
                                    <Link to="https://play.google.com/store/apps" target='_blank'><img src="../images/icons/google-play.png" alt="image" /></Link>
                                </div>
                            </div>
                        </div>
                        <div className="image-column col-lg-7 col-md-12 col-sm-12">
                            <div className="inner-column">
                                <div className="image-box">
                                    <ReactWOW animation='fadeInRight'>
                                        <figure className="image"><img src="../images/resource/app-mockup.png" alt="image" />
                                        </figure>
                                    </ReactWOW>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AppV1;