import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import FooterV1 from '../../components/footer/FooterV1';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Gallery, Item } from 'react-photoswipe-gallery';

const blogSections = [
  {
    id: 1,
    title: "Introduction",
    content: "Among global competitions based on science, technology, and innovation, the World Invention Competition and Exhibition (WICE) stands out as a prestigious platform. Talented young innovators from around the world showcase their research, creative thinking, and technological solutions here.\n\nFor years, Dreams of Bangladesh (DoB) has been relentlessly working to highlight the talents of Bangladeshi youth on this international stage. In 2023 and 2024, Dreams of Bangladesh consecutively won Gold Medals, proving that with proper guidance, hard work, and dedication, Bangladeshi students can excel in global competitions.\n\nFollowing this tradition, in 2025, a special Boot Camp was organized to further prepare selected teams for international participation.",
    image: "/images/blog/introduction.jpg",
    icon: "fa fa-star",
    bgColor: "#fef7f7"
  },
  {
    id: 2,
    title: "WICE National Round",
    content: "On May 30, 2025, Dreams of Bangladesh successfully organized the WICE National Round Bangladesh. Teams from across the country presented their innovative projects, competing for the top positions.\n\nFrom this national round, a select few highly promising teams were chosen to represent Bangladesh at WICE 2025 in Malaysia. However, the goal was not just selection; Dreams of Bangladesh aimed to prepare each team to achieve Gold Medal-worthy projects at the international level.",
    image: "/images/blog/national-round.jpg",
    icon: "fa fa-trophy",
    bgColor: "#fdf5f5"
  },
  {
    id: 3,
    title: "Purpose of the Boot Camp",
    content: "Participating in an international competition requires more than just creating a project. Teams must also:\n\n• Present their projects effectively\n• Prepare documentation\n• Answer judges' questions confidently\n• Showcase the project's functionality\n\nTo guide the teams on these aspects, Dreams of Bangladesh organized a Boot Camp:\n\nDate: August 11, 2025\nVenue: Convention Hall, Mirpur\nTime: 4 PM – 8 PM",
    image: "/images/blog/bootcamp-purpose.jpg",
    icon: "fa fa-bullseye",
    bgColor: "#fcf4f4"
  },
  {
    id: 4,
    title: "Preparation and Effort",
    content: "To ensure the Boot Camp's success, the executives and organizers of Dreams of Bangladesh worked tirelessly for 3–4 days.\n\n• Each team received formal invitations\n• Guardian permissions were obtained\n• The venue was arranged with all necessary technical equipment for project presentations\n\nThe event was more than just a program; it became a platform to prepare the future innovators of Bangladesh.",
    image: "/images/blog/preparation.jpg",
    icon: "fa fa-tools",
    bgColor: "#fef6f6"
  },
  {
    id: 5,
    title: "Boot Camp Activities",
    content: "The Boot Camp began officially at 4 PM, attended by all DoB executives, organizers, participating teams, and their guardians.\n\nKey activities included:\n\n1. Motivational Session – Inspiring young innovators\n2. Project Guidance – How to elevate a project to international standards\n3. Q&A Session – Helping participants resolve project-related challenges\n4. Experience Sharing – Learning from past Gold Medal winners\n5. Networking – Building connections between teams and guardians",
    image: "/images/blog/activities.jpg",
    icon: "fa fa-users",
    bgColor: "#fdf3f3"
  },
  {
    id: 6,
    title: "Executive Director's Guidance",
    content: "Executive Director Mahadir Islam played a pivotal role in the Boot Camp. He provided detailed guidance to each team, covering:\n\n• How to make a project Gold Medal-worthy\n• Strategies for presenting projects to international judges\n• Importance of teamwork and time management\n• Making innovation solution-oriented",
    image: "/images/blog/executive-guidance.jpg",
    icon: "fa fa-user-tie",
    bgColor: "#fcf5f5"
  },
  {
    id: 7,
    title: "President's Experience Sharing",
    content: "President Moin Uddin shared his experiences with the participants, explaining how Dreams of Bangladesh won consecutive Gold Medals in WICE 2023 and 2024.\n\nThrough his session, teams learned:\n\n• How competitions at the international level are conducted\n• Types of questions judges might ask\n• How to prepare mentally for success",
    image: "/images/blog/president-sharing.jpg",
    icon: "fa fa-microphone",
    bgColor: "#fef4f4"
  },
  {
    id: 8,
    title: "Participant Reactions",
    content: "The participating teams were highly enthusiastic about the Boot Camp.\n\n• Many were attending an international platform for the first time, making the experience life-changing\n• Guardians expressed satisfaction, seeing their children engage in a professional, safe, and organized environment",
    image: "/images/blog/participant-reactions.jpg",
    icon: "fa fa-heart",
    bgColor: "#fdf6f6"
  },
  {
    id: 9,
    title: "Malaysia Trip Cost Details",
    content: "During the Boot Camp, Executive Director Mahadir Islam provided detailed guidance on the cost of participating in WICE 2025 in Malaysia. He informed that each team member's total cost is approximately BDT 155,000. This includes:\n\n• Flight: Return ticket from Dhaka to Kuala Lumpur\n• Accommodation: 4–5 nights in comfortable hotels\n• Food and Local Travel: Three meals a day plus transportation\n• Project Presentation Materials: Stall setup and display requirements\n• Miscellaneous Costs: Visa, insurance, health protocols, and other expenses\n\nMahadir Islam emphasized that the costs were planned to allow each team to participate comfortably without financial burden.",
    image: "/images/blog/malaysia-trip.jpg",
    icon: "fa fa-calculator",
    bgColor: "#fcf7f7"
  },
  {
    id: 10,
    title: "Future Plans",
    content: "Dreams of Bangladesh does not intend to stop with the Boot Camp. Future initiatives include:\n\n• Regular online mentoring sessions\n• Specialized coaching for each team\n• Resource sharing platforms to help teams refine their projects\n\nThese measures aim to ensure that Bangladeshi teams are well-prepared and confident to represent the country at WICE 2025 in Malaysia.",
    image: "/images/blog/future-plans.jpg",
    icon: "fa fa-lightbulb",
    bgColor: "#fef8f8"
  },
  {
    id: 11,
    title: "Conclusion",
    content: "The Dreams of Bangladesh Boot Camp was a unique initiative. It not only provided project guidance but also instilled hope, inspiration, and vision among participants and their guardians.\n\nThe knowledge and motivation gained from this Boot Camp will guide the teams not only at WICE 2025 but also throughout their lives.\n\nDreams of Bangladesh firmly believes that Bangladesh's youth will illuminate the global stage with their talent, innovation, and confidence.",
    image: "/images/blog/conclusion.jpg",
    icon: "fa fa-check-circle",
    bgColor: "#fef5f5"
  }
];

const BlogDetails = () => {
  return (
    <div className="page-wrapper">
      <span className="header-span"></span>
      <HeaderV1 headerStyle="header-style-two" />
      <BreadCrumb title="Blog Details" breadCrumb="blog-details" />

      {/* Beautiful Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg,rgb(185, 137, 153) 0%, #6B1426 100%)',
        padding: '100px 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ 
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 20px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '1px'
                }}>
                  DREAMS OF BANGLADESH
                </span>
              </div>
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: '700', 
                marginBottom: '25px',
                lineHeight: '1.2'
              }}>
                Guiding the Innovators of Tomorrow
              </h1>
              <p style={{ 
                fontSize: '20px', 
                opacity: '0.9',
                marginBottom: '30px'
              }}>
                Dreams of Bangladesh WICE Boot Camp 2025
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <span style={{ 
                  background: 'rgba(255,255,255,0.15)',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  <i className="fa fa-calendar me-2"></i>August 11, 2025
                </span>
                <span style={{ 
                  background: 'rgba(255,255,255,0.15)',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  <i className="fa fa-map-marker-alt me-2"></i>Convention Hall, Mirpur
                </span>
                <span style={{ 
                  background: 'rgba(255,255,255,0.15)',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  <i className="fa fa-trophy me-2"></i>WICE 2025
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog Content */}
      <section style={{ padding: '80px 0' }}>
        <Container>
          <Gallery>
            {blogSections.map((section, index) => (
              <div key={section.id} style={{ marginBottom: '60px' }}>
                <Card style={{ 
                  border: 'none', 
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  background: section.bgColor
                }}>
                  <Row className="g-0">
                    {index % 2 === 0 ? (
                      <>
                        <Col lg={8}>
                          <Card.Body style={{ padding: '50px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                              <div style={{ 
                                background: 'linear-gradient(135deg, #8B1538 0%, #6B1426 100%)',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '20px'
                              }}>
                                <i className={section.icon} style={{ color: 'white', fontSize: '24px' }}></i>
                              </div>
                              <div>
                                <h3 style={{ 
                                  fontSize: '32px', 
                                  fontWeight: '600', 
                                  color: '#2c3e50',
                                  marginBottom: '5px'
                                }}>
                                  {section.title}
                                </h3>
                                <span style={{ color: '#7f8c8d', fontSize: '14px', fontWeight: '500' }}>
                                  Section {section.id}
                                </span>
                              </div>
                            </div>
                            <div style={{ 
                              fontSize: '16px', 
                              lineHeight: '1.8', 
                              color: '#555',
                              fontWeight: '400'
                            }}>
                              {section.content.split('\n').map((paragraph, i) => (
                                <p key={i} style={{ marginBottom: '18px' }}>
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </Card.Body>
                        </Col>
                        <Col lg={4}>
                          <div style={{ 
                            height: '100%', 
                            minHeight: '400px',
                            background: 'linear-gradient(135deg, #8B1538 0%, #6B1426 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            <Item original={section.image} thumbnail={section.image} width={800} height={600}>
                              {({ ref, open }) => (
                                <img
                                  ref={ref}
                                  onClick={open}
                                  src={section.image}
                                  alt={section.title}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    cursor: 'pointer'
                                  }}
                                  onError={(e) => { 
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement.innerHTML = `
                                      <div style="text-align: center; color: white; padding: 60px 30px;">
                                        <i class="${section.icon}" style="font-size: 64px; margin-bottom: 20px; display: block;"></i>
                                        <h4 style="color: white; font-weight: 600; margin-bottom: 10px;">${section.title}</h4>
                                        <p style="color: rgba(255,255,255,0.8); font-size: 14px;">Image coming soon</p>
                                      </div>
                                    `;
                                  }}
                                />
                              )}
                            </Item>
                          </div>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col lg={4}>
                          <div style={{ 
                            height: '100%', 
                            minHeight: '400px',
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            <Item original={section.image} thumbnail={section.image} width={800} height={600}>
                              {({ ref, open }) => (
                                <img
                                  ref={ref}
                                  onClick={open}
                                  src={section.image}
                                  alt={section.title}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    cursor: 'pointer'
                                  }}
                                  onError={(e) => { 
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement.innerHTML = `
                                      <div style="text-align: center; color: white; padding: 60px 30px;">
                                        <i class="${section.icon}" style="font-size: 64px; margin-bottom: 20px; display: block;"></i>
                                        <h4 style="color: white; font-weight: 600; margin-bottom: 10px;">${section.title}</h4>
                                        <p style="color: rgba(255,255,255,0.8); font-size: 14px;">Image coming soon</p>
                                      </div>
                                    `;
                                  }}
                                />
                              )}
                            </Item>
                          </div>
                        </Col>
                        <Col lg={8}>
                          <Card.Body style={{ padding: '50px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                              <div style={{ 
                                background: 'linear-gradient(135deg, #6B1426 0%, #8B1538 100%)',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '20px'
                              }}>
                                <i className={section.icon} style={{ color: 'white', fontSize: '24px' }}></i>
                              </div>
                              <div>
                                <h3 style={{ 
                                  fontSize: '32px', 
                                  fontWeight: '600', 
                                  color: '#2c3e50',
                                  marginBottom: '5px'
                                }}>
                                  {section.title}
                                </h3>
                                <span style={{ color: '#7f8c8d', fontSize: '14px', fontWeight: '500' }}>
                                  Section {section.id}
                                </span>
                              </div>
                            </div>
                            <div style={{ 
                              fontSize: '16px', 
                              lineHeight: '1.8', 
                              color: '#555',
                              fontWeight: '400'
                            }}>
                              {section.content.split('\n').map((paragraph, i) => (
                                <p key={i} style={{ marginBottom: '18px' }}>
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </Card.Body>
                        </Col>
                      </>
                    )}
                  </Row>
                </Card>
              </div>
            ))}
          </Gallery>

          {/* Call to Action */}
          <Card style={{ 
            background: 'linear-gradient(135deg, #8B1538 0%, #6B1426 100%)',
            border: 'none',
            borderRadius: '20px',
            marginTop: '80px',
            color: 'white',
            textAlign: 'center'
          }}>
            <Card.Body style={{ padding: '80px 60px' }}>
              <div style={{ marginBottom: '30px' }}>
                <i className="fa fa-lightbulb" style={{ fontSize: '80px', opacity: '0.9' }}></i>
              </div>
              <h3 style={{ 
                fontSize: '42px', 
                fontWeight: '700', 
                marginBottom: '25px'
              }}>
                Ready to Join WICE 2025?
              </h3>
              <p style={{ 
                fontSize: '18px', 
                opacity: '0.9',
                marginBottom: '40px',
                maxWidth: '600px',
                margin: '0 auto 40px'
              }}>
                Dreams of Bangladesh continues to guide and support young innovators. 
                Be part of the next generation representing Bangladesh globally.
              </p>
              <a 
                href="/buy-ticket" 
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '18px 40px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Register Now <i className="fa fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              </a>
            </Card.Body>
          </Card>
        </Container>
      </section>

      <FooterV1 />
    </div>
  );
};

export default BlogDetails;