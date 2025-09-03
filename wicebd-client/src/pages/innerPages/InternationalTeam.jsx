import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import FooterV1 from '../../components/footer/FooterV1';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Gallery, Item } from 'react-photoswipe-gallery';

const internationalTeams = [
  {
    id: 1,
    teamName: "Mars Rover",
    category: "IT & Robotics",
    award: "Gold Medalist",
    members: ["Kaysan Ariz Zayan", "Team Member 2", "Team Member 3"],
    projectTitle: "Advanced Mars Exploration Rover",
    image: "/images/international-teams/mars-rover.jpg",
    gradient: "linear-gradient(135deg, #141e30 0%, #243b55 100%)"
  },
  {
    id: 2,
    teamName: "NIGMx",
    category: "IT & Robotics",
    award: "Gold Medalist",
    members: ["Shafi Bin Sultan", "Team Member 2", "Team Member 3"],
    projectTitle: "Next Generation Medical Technology",
    image: "/images/international-teams/nigmx.jpg",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: 3,
    teamName: "RiverGuard",
    category: "Innovative Social Science",
    award: "Gold Medalist",
    members: ["Aranya Abeer Khan Prapya", "Team Member 2", "Team Member 3"],
    projectTitle: "River Pollution Monitoring System",
    image: "/images/international-teams/riverguard.jpg",
    gradient: "linear-gradient(135deg, #42275a 0%, #734b6d 100%)"
  },
  {
    id: 4,
    teamName: "AeroHarvest",
    category: "Applied Life Science",
    award: "Gold Medalist",
    members: ["Rayan Alam", "Team Member 2", "Team Member 3"],
    projectTitle: "Aerial Agricultural Innovation",
    image: "/images/international-teams/aeroharvest.jpg",
    gradient: "linear-gradient(135deg, #0F2027 0%, #2C5364 100%)"
  },
  {
    id: 5,
    teamName: "Waste Management Vehicle",
    category: "Environmental Science",
    award: "Gold Medalist",
    members: ["Muhtasim Musfiq Mahi", "Team Member 2", "Team Member 3"],
    projectTitle: "Smart Waste Collection System",
    image: "/images/international-teams/waste-management.jpg",
    gradient: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
  }
];

const awardVariantMap = {
  'Gold Medalist': 'warning',
  'Silver Medalist': 'secondary',
  'Bronze Medalist': 'info',
  'Honorable Mention': 'success',
};

const getAwardIcon = (award) => {
  if (!award) return 'fa fa-certificate';
  if (award.includes('Gold')) return 'fa fa-trophy';
  if (award.includes('Silver')) return 'fa fa-medal';
  if (award.includes('Bronze')) return 'fa fa-award';
  return 'fa fa-certificate';
};

const InternationalTeam = () => {
  return (
    <div className="page-wrapper">
      <span className="header-span"></span>
      <HeaderV1 headerStyle="header-style-two" />
      <BreadCrumb title="International Team" breadCrumb="international-team" />

      {/* Hero Section */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)', 
        color: 'white' 
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="text-uppercase small opacity-75 mb-2">WICE 2025 Malaysia</div>
              <h1 className="display-4 fw-bold mb-3">
                🇧🇩 Team Bangladesh
              </h1>
              <p className="lead mb-4">
                Representing Bangladesh at the World Invention Competition and Exhibition 2025 in Malaysia. 
                These exceptional teams have qualified through rigorous national rounds and are ready to compete 
                on the global stage.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge bg="light" text="dark" className="border px-3 py-2">
                  <i className="fa fa-globe me-2"></i>WICE 2025 Malaysia
                </Badge>
                <Badge bg="light" text="dark" className="border px-3 py-2">
                  <i className="fa fa-users me-2"></i>5 Selected Teams
                </Badge>
                <Badge bg="light" text="dark" className="border px-3 py-2">
                  <i className="fa fa-flag me-2"></i>Bangladesh Representatives
                </Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Teams Section */}
      <section className="py-5">
        <Container>
          <div className="sec-title text-center mb-5">
            <span className="title">Our Champions</span>
            <h2>International Teams 2025</h2>
            <p className="text-muted">
              Meet the brilliant minds representing Bangladesh at WICE 2025 in Malaysia
            </p>
          </div>

          <Gallery>
            {internationalTeams.map((team, index) => (
              <div key={team.id} className="mb-5">
                <Card 
                  className="border-0 overflow-hidden shadow" 
                  style={{ borderRadius: 20 }}
                >
                  <Row className="g-0">
                    {/* Alternate layout for visual appeal */}
                    {index % 2 === 0 ? (
                      <>
                        <Col lg={8} className="order-2 order-lg-1">
                          <div className="p-4 p-lg-5">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h3 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                                  {team.teamName}
                                </h3>
                                <Badge bg="light" text="dark" className="border mb-2">
                                  <i className="fa fa-layer-group me-1"></i> {team.category}
                                </Badge>
                              </div>
                              <Badge
                                bg={awardVariantMap[team.award] || 'secondary'}
                                className="d-flex align-items-center gap-1"
                                style={{ borderRadius: '999px', padding: '8px 12px', fontWeight: 700 }}
                              >
                                <i className={getAwardIcon(team.award)}></i> {team.award}
                              </Badge>
                            </div>

                            <div className="mb-4">
                              <h5 className="fw-semibold mb-2" style={{ color: '#34495e' }}>
                                Project: {team.projectTitle}
                              </h5>
                            </div>

                            <div className="mb-4">
                              <h6 className="fw-semibold mb-2" style={{ color: '#7f8c8d' }}>Team Members:</h6>
                              <div className="d-flex flex-wrap gap-2">
                                {team.members.map((member, i) => (
                                  <Badge key={i} bg="light" text="dark" className="border px-3 py-2">
                                    <i className="fa fa-user me-1"></i> {member}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="d-flex gap-2">
                              <Badge bg="success" className="px-3 py-2">
                                <i className="fa fa-plane me-1"></i> Qualified for Malaysia
                              </Badge>
                              <Badge bg="info" className="px-3 py-2">
                                <i className="fa fa-trophy me-1"></i> National Champion
                              </Badge>
                            </div>
                          </div>
                        </Col>
                        <Col lg={4} className="order-1 order-lg-2">
                          <div 
                            className="position-relative h-100"
                            style={{ 
                              background: team.gradient,
                              minHeight: 400
                            }}
                          >
                            <Item original={team.image} thumbnail={team.image} width={800} height={600}>
                              {({ ref, open }) => (
                                <img
                                  ref={ref}
                                  onClick={open}
                                  src={team.image}
                                  alt={team.teamName}
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
                                    e.currentTarget.parentElement.innerHTML = `<div class="text-white text-center"><i class="fa fa-users fa-4x mb-3"></i><br/><h4>${team.teamName}</h4><p>${team.category}</p></div>`;
                                  }}
                                />
                              )}
                            </Item>
                            <div 
                              className="position-absolute bottom-0 start-0 end-0 p-3"
                              style={{ 
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                color: 'white'
                              }}
                            >
                              <div className="text-center">
                                <i className="fa fa-camera fa-lg mb-2"></i>
                                <div className="small">Click to view team photo</div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col lg={4}>
                          <div 
                            className="position-relative h-100"
                            style={{ 
                              background: team.gradient,
                              minHeight: 400
                            }}
                          >
                            <Item original={team.image} thumbnail={team.image} width={800} height={600}>
                              {({ ref, open }) => (
                                <img
                                  ref={ref}
                                  onClick={open}
                                  src={team.image}
                                  alt={team.teamName}
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
                                    e.currentTarget.parentElement.innerHTML = `<div class="text-white text-center"><i class="fa fa-users fa-4x mb-3"></i><br/><h4>${team.teamName}</h4><p>${team.category}</p></div>`;
                                  }}
                                />
                              )}
                            </Item>
                            <div 
                              className="position-absolute bottom-0 start-0 end-0 p-3"
                              style={{ 
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                color: 'white'
                              }}
                            >
                              <div className="text-center">
                                <i className="fa fa-camera fa-lg mb-2"></i>
                                <div className="small">Click to view team photo</div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col lg={8}>
                          <div className="p-4 p-lg-5">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h3 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                                  {team.teamName}
                                </h3>
                                <Badge bg="light" text="dark" className="border mb-2">
                                  <i className="fa fa-layer-group me-1"></i> {team.category}
                                </Badge>
                              </div>
                              <Badge
                                bg={awardVariantMap[team.award] || 'secondary'}
                                className="d-flex align-items-center gap-1"
                                style={{ borderRadius: '999px', padding: '8px 12px', fontWeight: 700 }}
                              >
                                <i className={getAwardIcon(team.award)}></i> {team.award}
                              </Badge>
                            </div>

                            <div className="mb-4">
                              <h5 className="fw-semibold mb-2" style={{ color: '#34495e' }}>
                                Project: {team.projectTitle}
                              </h5>
                            </div>

                            <div className="mb-4">
                              <h6 className="fw-semibold mb-2" style={{ color: '#7f8c8d' }}>Team Members:</h6>
                              <div className="d-flex flex-wrap gap-2">
                                {team.members.map((member, i) => (
                                  <Badge key={i} bg="light" text="dark" className="border px-3 py-2">
                                    <i className="fa fa-user me-1"></i> {member}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="d-flex gap-2">
                              <Badge bg="success" className="px-3 py-2">
                                <i className="fa fa-plane me-1"></i> Qualified for Malaysia
                              </Badge>
                              <Badge bg="info" className="px-3 py-2">
                                <i className="fa fa-trophy me-1"></i> National Champion
                              </Badge>
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

          {/* Journey to Malaysia Section */}
          <div className="mt-5">
            <Card 
              className="border-0 shadow-lg"
              style={{ 
                borderRadius: 20,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Card.Body className="p-5 text-center">
                <h3 className="fw-bold mb-3">
                  <i className="fa fa-plane me-3"></i>
                  Journey to Malaysia
                </h3>
                <p className="lead mb-4">
                  These exceptional teams are now preparing for the ultimate challenge - 
                  representing Bangladesh at WICE 2025 in Malaysia. With Dreams of Bangladesh's 
                  guidance and their innovative projects, they're ready to make our nation proud.
                </p>
                <div className="d-flex justify-content-center gap-4">
                  <div className="text-center">
                    <div className="h4 fw-bold">5</div>
                    <div className="small">Teams Selected</div>
                  </div>
                  <div className="text-center">
                    <div className="h4 fw-bold">15+</div>
                    <div className="small">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="h4 fw-bold">🇲🇾</div>
                    <div className="small">Malaysia 2025</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </section>

      <FooterV1 />
    </div>
  );
};

export default InternationalTeam;
