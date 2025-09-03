import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import FooterV1 from '../../components/footer/FooterV1';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Gallery, Item } from 'react-photoswipe-gallery';

const internationalTeams = [
  {
    id: 1,
    teamName: "BUBT (Agro Doctor)",
    members: ["Kamrul Islam", "Fazla Rabbi"],
    mentors: ["Tamim Hossain"],
    guardians: [],
    image: "/images/international-teams/bubt-agro-doctor.jpg",
    gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)"
  },
  {
    id: 2,
    teamName: "DeltaVolt",
    members: ["MD. Musfiqur Rahman Nafis (Leader)", "Md Abu Rayhan"],
    mentors: ["Dewan Md Mutasim Billah"],
    guardians: [],
    image: "/images/international-teams/deltavolt.jpg",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: 3,
    teamName: "Rescue Rover",
    members: ["M. Adiyat Yeamim Rayan (Leader)", "Tahmid Bin Alam Ayat"],
    mentors: [],
    guardians: ["MD.Razu Miah", "Kazi Zakia Haque"],
    image: "/images/international-teams/rescue-rover.jpg",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)"
  },
  {
    id: 4,
    teamName: "Therabot",
    members: ["Divyajyoti Saha", "Safwan Syed Ahmed"],
    mentors: ["Mahadi Hassan"],
    guardians: ["Dipankar Saha", "Shamsher Tauhid Ahmed"],
    image: "/images/international-teams/therabot.jpg",
    gradient: "linear-gradient(135deg, #48cae4 0%, #023e8a 100%)"
  },
  {
    id: 5,
    teamName: "Young Sparks of Bangladesh",
    members: ["Ahnaf Bin Ashraf Nabil", "Ayaan Islam Ariyan", "Labib Islam"],
    mentors: ["Sunjim Hossain"],
    guardians: ["Nayena Akter"],
    image: "/images/international-teams/young-sparks.jpg",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    id: 6,
    teamName: "Hollow AI",
    members: ["Faiyaz Bin Iqbal (Leader)"],
    mentors: [],
    guardians: [],
    image: "/images/international-teams/hollow-ai.jpg",
    gradient: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)"
  },
  {
    id: 7,
    teamName: "RV14k",
    members: ["MD Ahnaf Abedin (Leader)", "Samnun Siam", "Ifraaz Mahmud", "Pranchoy Tarafder"],
    mentors: ["Saadman sayed"],
    guardians: [],
    image: "/images/international-teams/rv14k.jpg",
    gradient: "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)"
  },
  {
    id: 8,
    teamName: "Ember Knight",
    members: ["Mohammad Zarif Bin Salek (Leader)", "Sasmit Banik", "Mohammed Mashrur Arefin Bhuiyan"],
    mentors: [],
    guardians: ["Mohammed Abul Bashar Bhuiyan"],
    image: "/images/international-teams/ember-knight.jpg",
    gradient: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)"
  },
  {
    id: 9,
    teamName: "Mars Rover",
    members: ["Kaysan Ariz Zayan (Leader)", "Rahmatullah Khan Ayman", "Muhammad Muntasir Rahman"],
    mentors: ["S M MOHSIN"],
    guardians: ["Umme Salma Sultana Mitu", "Ferdous Ara Alo", "Rina Akhter", "Al Mehdi Muhaammad Mustafizur Rhaman"],
    image: "/images/international-teams/mars-rover.jpg",
    gradient: "linear-gradient(135deg, #141e30 0%, #243b55 100%)"
  },
  {
    id: 10,
    teamName: "Deligo",
    members: ["MD Samin Yeasar Siddique Rafid (Leader)", "Ridwan Abrar Shayan", "Minhaz Islam Nafi", "MD Omer Faruk Avin"],
    mentors: [],
    guardians: ["Md. Fouad Hasan Siddique"],
    supervisors: ["Tariqul Islam"],
    image: "/images/international-teams/deligo.jpg",
    gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
  },
  {
    id: 11,
    teamName: "Hexaguard Rover",
    members: ["MD ZAHID HASAN ZIHAD (Leader)", "MD TOHA BIN ASAD DIP"],
    mentors: [],
    guardians: [],
    image: "/images/international-teams/hexaguard-rover.jpg",
    gradient: "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)"
  },
  {
    id: 12,
    teamName: "Ongona",
    members: ["Tashahud Bin Wahid (Leader)", "Md. Samin Yasir"],
    mentors: ["Fahim Muntasir Galib"],
    guardians: [],
    image: "/images/international-teams/ongona.jpg",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
  },
  {
    id: 13,
    teamName: "Aquabot 2.0",
    members: ["Ahnaf Safwan Islam", "Md. Ayaan Rahman", "ANISA BEGUM"],
    mentors: [],
    guardians: [],
    image: "/images/international-teams/aquabot.jpg",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  {
    id: 14,
    teamName: "River Guard",
    members: ["Aranya Abeer Khan Prapya (Leader)", "Mohammad Tousif Ahnaf", "Sabrin Mahmud Ethan", "Abrar Sadiq Raha"],
    mentors: [],
    guardians: [],
    image: "/images/international-teams/river-guard.jpg",
    gradient: "linear-gradient(135deg, #42275a 0%, #734b6d 100%)"
  },
  {
    id: 15,
    teamName: "Team Akash Pathabo",
    members: ["Shafi Bin sultan (Leader)", "Sabik Bin sultan", "Safwan Sadad"],
    mentors: ["Sadekul Islam"],
    guardians: [],
    image: "/images/international-teams/akash-pathabo.jpg",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: 16,
    teamName: "Phantom Forge",
    members: ["Muhammd Safwan Anwar", "Md Sifayet Hossan Rohan", "Mehedi Hasan Robin", "MD NAIEEM HOSSEN"],
    mentors: ["Md Moin Uddin"],
    guardians: [],
    image: "/images/international-teams/phantom-forge.jpg",
    gradient: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
  },
  {
    id: 17,
    teamName: "Quantum Sparks",
    members: ["Dewan Md Foyzullah Munim", "Abdur Rahman Sadek Akonda", "Mashiya Rahamam"],
    mentors: [],
    guardians: ["Fatema Yesmin"],
    image: "/images/international-teams/quantum-sparks.jpg",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  },
  {
    id: 18,
    teamName: "InnoVengers",
    members: ["MD.NIYAJ MORSHED SAYEM", "Joburaj Sikdar"],
    mentors: [],
    guardians: ["Mosammat Liza Begum"],
    image: "/images/international-teams/innovengers.jpg",
    gradient: "linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)"
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
        background: 'linear-gradient(135deg,rgb(106, 41, 41) 0%,rgb(164, 83, 83) 100%)', 
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
                  <i className="fa fa-users me-2"></i>18 Selected Teams
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
                            <div className="mb-3">
                              <h3 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                                {team.teamName}
                              </h3>
                              <Badge bg="light" text="dark" className="border mb-2">
                                <i className="fa fa-users me-1"></i> Team #{team.id}
                              </Badge>
                            </div>

                            <div className="mb-4">
                              <h6 className="fw-semibold mb-2" style={{ color: '#7f8c8d' }}>Team Details:</h6>
                              
                              {/* Members */}
                              {team.members.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">Members:</small>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    {team.members.map((member, i) => (
                                      <Badge key={i} bg="primary" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa fa-user me-1"></i> {member}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Mentors */}
                              {team.mentors && team.mentors.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">Mentors:</small>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    {team.mentors.map((mentor, i) => (
                                      <Badge key={i} bg="success" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa fa-graduation-cap me-1"></i> {mentor}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Guardians */}
                              {team.guardians && team.guardians.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">Guardians:</small>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    {team.guardians.map((guardian, i) => (
                                      <Badge key={i} bg="warning" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa fa-shield-alt me-1"></i> {guardian}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Supervisors */}
                              {team.supervisors && team.supervisors.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">Supervisors:</small>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    {team.supervisors.map((supervisor, i) => (
                                      <Badge key={i} bg="info" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa fa-eye me-1"></i> {supervisor}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
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
                            <div className="mb-3">
                              <h3 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                                {team.teamName}
                              </h3>
                              <Badge bg="light" text="dark" className="border mb-2">
                                <i className="fa fa-users me-1"></i> Team #{team.id}
                              </Badge>
                            </div>

                            <div className="mb-4">
                              <h6 className="fw-semibold mb-2" style={{ color: '#7f8c8d' }}>Team Details:</h6>
                              
                              {/* Members */}
                              {team.members.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">Members:</small>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    {team.members.map((member, i) => (
                                      <Badge key={i} bg="primary" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa fa-user me-1"></i> {member}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Mentors */}
                              {team.mentors && team.mentors.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">Mentors:</small>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    {team.mentors.map((mentor, i) => (
                                      <Badge key={i} bg="success" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa fa-graduation-cap me-1"></i> {mentor}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Guardians */}
                              {team.guardians && team.guardians.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">Guardians:</small>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    {team.guardians.map((guardian, i) => (
                                      <Badge key={i} bg="warning" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa fa-shield-alt me-1"></i> {guardian}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Supervisors */}
                              {team.supervisors && team.supervisors.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">Supervisors:</small>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    {team.supervisors.map((supervisor, i) => (
                                      <Badge key={i} bg="info" className="px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="fa fa-eye me-1"></i> {supervisor}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
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
                    <div className="h4 fw-bold">18</div>
                    <div className="small">Teams Selected</div>
                  </div>
                  <div className="text-center">
                    <div className="h4 fw-bold">60+</div>
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
