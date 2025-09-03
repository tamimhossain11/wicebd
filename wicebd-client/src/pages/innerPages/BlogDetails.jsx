import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import FooterV1 from '../../components/footer/FooterV1';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Gallery, Item } from 'react-photoswipe-gallery';

const blogSections = [
  {
    id: 1,
    title: "Introduction",
    content: "Among global competitions based on science, technology, and innovation, the World Invention Competition and Exhibition (WICE) stands out as a prestigious platform. Talented young innovators from around the world showcase their research, creative thinking, and technological solutions here.\n\nFor years, Dreams of Bangladesh (DoB) has been relentlessly working to highlight the talents of Bangladeshi youth on this international stage. In 2023 and 2024, Dreams of Bangladesh consecutively won Gold Medals, proving that with proper guidance, hard work, and dedication, Bangladeshi students can excel in global competitions.\n\nFollowing this tradition, in 2025, a special Boot Camp was organized to further prepare selected teams for international participation.",
    image: "/images/blog/introduction.jpg",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: 2,
    title: "WICE National Round",
    content: "On May 30, 2025, Dreams of Bangladesh successfully organized the WICE National Round Bangladesh. Teams from across the country presented their innovative projects, competing for the top positions.\n\nFrom this national round, a select few highly promising teams were chosen to represent Bangladesh at WICE 2025 in Malaysia. However, the goal was not just selection; Dreams of Bangladesh aimed to prepare each team to achieve Gold Medal-worthy projects at the international level.",
    image: "/images/blog/national-round.jpg",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    id: 3,
    title: "Purpose of the Boot Camp",
    content: "Participating in an international competition requires more than just creating a project. Teams must also:\n\n• Present their projects effectively\n• Prepare documentation\n• Answer judges' questions confidently\n• Showcase the project's functionality\n\nTo guide the teams on these aspects, Dreams of Bangladesh organized a Boot Camp:\n\nDate: August 11, 2025\nVenue: Convention Hall, Mirpur\nTime: 4 PM – 8 PM",
    image: "/images/blog/bootcamp-purpose.jpg",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  {
    id: 4,
    title: "Preparation and Effort",
    content: "To ensure the Boot Camp's success, the executives and organizers of Dreams of Bangladesh worked tirelessly for 3–4 days.\n\n• Each team received formal invitations\n• Guardian permissions were obtained\n• The venue was arranged with all necessary technical equipment for project presentations\n\nThe event was more than just a program; it became a platform to prepare the future innovators of Bangladesh.",
    image: "/images/blog/preparation.jpg",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
  },
  {
    id: 5,
    title: "Boot Camp Activities",
    content: "The Boot Camp began officially at 4 PM, attended by all DoB executives, organizers, participating teams, and their guardians.\n\nKey activities included:\n\n1. Motivational Session – Inspiring young innovators\n2. Project Guidance – How to elevate a project to international standards\n3. Q&A Session – Helping participants resolve project-related challenges\n4. Experience Sharing – Learning from past Gold Medal winners\n5. Networking – Building connections between teams and guardians",
    image: "/images/blog/activities.jpg",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  },
  {
    id: 6,
    title: "Executive Director's Guidance",
    content: "Executive Director Mahadir Islam played a pivotal role in the Boot Camp. He provided detailed guidance to each team, covering:\n\n• How to make a project Gold Medal-worthy\n• Strategies for presenting projects to international judges\n• Importance of teamwork and time management\n• Making innovation solution-oriented",
    image: "/images/blog/executive-guidance.jpg",
    gradient: "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)"
  },
  {
    id: 7,
    title: "President's Experience Sharing",
    content: "President Moin Uddin shared his experiences with the participants, explaining how Dreams of Bangladesh won consecutive Gold Medals in WICE 2023 and 2024.\n\nThrough his session, teams learned:\n\n• How competitions at the international level are conducted\n• Types of questions judges might ask\n• How to prepare mentally for success",
    image: "/images/blog/president-sharing.jpg",
    gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
  },
  {
    id: 8,
    title: "Participant Reactions",
    content: "The participating teams were highly enthusiastic about the Boot Camp.\n\n• Many were attending an international platform for the first time, making the experience life-changing\n• Guardians expressed satisfaction, seeing their children engage in a professional, safe, and organized environment",
    image: "/images/blog/participant-reactions.jpg",
    gradient: "linear-gradient(135deg, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)"
  },
  {
    id: 9,
    title: "Executive Director's Malaysia Trip Cost Details",
    content: "During the Boot Camp, Executive Director Mahadir Islam provided detailed guidance on the cost of participating in WICE 2025 in Malaysia. He informed that each team member's total cost is approximately BDT 155,000. This includes:\n\n• Flight: Return ticket from Dhaka to Kuala Lumpur\n• Accommodation: 4–5 nights in comfortable hotels\n• Food and Local Travel: Three meals a day plus transportation\n• Project Presentation Materials: Stall setup and display requirements\n• Miscellaneous Costs: Visa, insurance, health protocols, and other expenses\n\nMahadir Islam emphasized that the costs were planned to allow each team to participate comfortably without financial burden.",
    image: "/images/blog/malaysia-trip.jpg",
    gradient: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)"
  },
  {
    id: 10,
    title: "Future Plans",
    content: "Dreams of Bangladesh does not intend to stop with the Boot Camp. Future initiatives include:\n\n• Regular online mentoring sessions\n• Specialized coaching for each team\n• Resource sharing platforms to help teams refine their projects\n\nThese measures aim to ensure that Bangladeshi teams are well-prepared and confident to represent the country at WICE 2025 in Malaysia.",
    image: "/images/blog/future-plans.jpg",
    gradient: "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 1%, #f5f7fa 100%)"
  },
  {
    id: 11,
    title: "Conclusion",
    content: "The Dreams of Bangladesh Boot Camp was a unique initiative. It not only provided project guidance but also instilled hope, inspiration, and vision among participants and their guardians.\n\nThe knowledge and motivation gained from this Boot Camp will guide the teams not only at WICE 2025 but also throughout their lives.\n\nDreams of Bangladesh firmly believes that Bangladesh's youth will illuminate the global stage with their talent, innovation, and confidence.",
    image: "/images/blog/conclusion.jpg",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }
];

const BlogDetails = () => {
  return (
    <div className="page-wrapper">
      <span className="header-span"></span>
      <HeaderV1 headerStyle="header-style-two" />
      <BreadCrumb title="Blog Details" breadCrumb="blog-details" />

      {/* Hero Section */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white' 
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="text-uppercase small opacity-75 mb-2">Dreams of Bangladesh</div>
              <h1 className="display-4 fw-bold mb-3">
                ✨ Guiding the Innovators of Tomorrow: Dreams of Bangladesh WICE Boot Camp 2025
              </h1>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge bg="light" text="dark" className="border px-3 py-2">
                  <i className="fa fa-calendar me-2"></i>August 11, 2025
                </Badge>
                <Badge bg="light" text="dark" className="border px-3 py-2">
                  <i className="fa fa-map-marker-alt me-2"></i>Convention Hall, Mirpur
                </Badge>
                <Badge bg="light" text="dark" className="border px-3 py-2">
                  <i className="fa fa-trophy me-2"></i>WICE 2025
                </Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog Content */}
      <section className="py-5">
        <Container>
          <Gallery>
            {blogSections.map((section, index) => (
              <div key={section.id} className="mb-5">
                <Card 
                  className="border-0 overflow-hidden shadow-sm" 
                  style={{ borderRadius: 16 }}
                >
                  <Row className="g-0">
                    {/* Alternate layout for even/odd sections */}
                    {index % 2 === 0 ? (
                      <>
                        <Col lg={8} className="order-2 order-lg-1">
                          <div className="p-4 p-lg-5">
                            <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
                              {section.title}
                            </h3>
                            <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#555' }}>
                              {section.content.split('\n').map((paragraph, i) => (
                                <p key={i} className="mb-3">{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </Col>
                        <Col lg={4} className="order-1 order-lg-2">
                          <div 
                            className="position-relative h-100"
                            style={{ 
                              background: section.gradient,
                              minHeight: 300
                            }}
                          >
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
                                    cursor: 'pointer',
                                    opacity: 0.9
                                  }}
                                  onError={(e) => { 
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement.style.display = 'flex';
                                    e.currentTarget.parentElement.style.alignItems = 'center';
                                    e.currentTarget.parentElement.style.justifyContent = 'center';
                                    e.currentTarget.parentElement.innerHTML = `<div class="text-white text-center"><i class="fa fa-image fa-3x mb-3"></i><br/>${section.title}</div>`;
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
                          <div 
                            className="position-relative h-100"
                            style={{ 
                              background: section.gradient,
                              minHeight: 300
                            }}
                          >
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
                                    cursor: 'pointer',
                                    opacity: 0.9
                                  }}
                                  onError={(e) => { 
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement.style.display = 'flex';
                                    e.currentTarget.parentElement.style.alignItems = 'center';
                                    e.currentTarget.parentElement.style.justifyContent = 'center';
                                    e.currentTarget.parentElement.innerHTML = `<div class="text-white text-center"><i class="fa fa-image fa-3x mb-3"></i><br/>${section.title}</div>`;
                                  }}
                                />
                              )}
                            </Item>
                          </div>
                        </Col>
                        <Col lg={8}>
                          <div className="p-4 p-lg-5">
                            <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
                              {section.title}
                            </h3>
                            <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#555' }}>
                              {section.content.split('\n').map((paragraph, i) => (
                                <p key={i} className="mb-3">{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Card>
              </div>
            ))}
          </Gallery>
        </Container>
      </section>

      <FooterV1 />
    </div>
  );
};

export default BlogDetails;
