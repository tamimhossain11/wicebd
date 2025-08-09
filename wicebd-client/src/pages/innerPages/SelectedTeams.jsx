import React, { useMemo } from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import FooterV1 from '../../components/footer/FooterV1';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import selectedTeams from '../../jsonData/selected/SelectedTeams.json';

const awardVariantMap = {
  'Gold Medalist': 'warning',
  'Silver Medalist': 'secondary',
  'Bronze Medalist': 'info',
  'Honorable Mention': 'success',
};

const categoryGradientMap = {
  'IT & Robotics': 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  'Innovative Social Science': 'linear-gradient(135deg, #42275a 0%, #734b6d 100%)',
  'Environmental Science': 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
  'Applied Life Science': 'linear-gradient(135deg, #0F2027 0%, #2C5364 100%)',
  'Applied Physics': 'linear-gradient(135deg, #1f1c2c 0%, #928DAB 100%)',
  'Honorable Mention': 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
};

const getAwardIcon = (award) => {
  if (!award) return 'fa fa-certificate';
  if (award.includes('Gold')) return 'fa fa-trophy';
  if (award.includes('Silver')) return 'fa fa-medal';
  if (award.includes('Bronze')) return 'fa fa-award';
  return 'fa fa-certificate';
};

const SelectedTeams = () => {
  const grouped = useMemo(() => {
    const byCategory = {};
    selectedTeams.forEach((item) => {
      if (!byCategory[item.category]) byCategory[item.category] = [];
      byCategory[item.category].push(item);
    });
    return byCategory;
  }, []);

  const categoriesInOrder = [
    'IT & Robotics',
    'Innovative Social Science',
    'Environmental Science',
    'Applied Life Science',
    'Applied Physics',
    'Honorable Mention',
  ].filter((c) => grouped[c] && grouped[c].length > 0);

  return (
    <div className="page-wrapper">
      <span className="header-span"></span>
      <HeaderV1 headerStyle="header-style-two" />
      <BreadCrumb title="Selected Teams" breadCrumb="selected-teams" />

      <section className="py-5">
        <Container>
          <div className="sec-title text-center mb-4">
            <span className="title">WICE Bangladesh</span>
            <h2>Selected Teams</h2>
          </div>

          {categoriesInOrder.map((category) => (
            <div key={category} className="mb-5">
              <h3 className="mb-3 d-flex align-items-center gap-2">
                <i className="fa fa-layer-group text-muted"></i> {category}
              </h3>
              <Row className="g-4">
                {grouped[category].map((team, idx) => (
                  <Col key={`${category}-${idx}`} lg={4} md={6} sm={12}>
                    <Card className="h-100 border-0 overflow-hidden shadow" style={{ borderRadius: '16px' }}>
                      <div
                        style={{
                          background: categoryGradientMap[category] || 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
                          color: '#fff',
                          padding: '18px 20px',
                          position: 'relative'
                        }}
                      >
                        <div className="fw-bold" style={{ fontSize: '1.05rem' }}>{team.teamName}</div>
                        {team.award && (
                          <Badge
                            bg={awardVariantMap[team.award] || 'secondary'}
                            className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1"
                            style={{ borderRadius: '999px', padding: '6px 10px', fontWeight: 700 }}
                          >
                            <i className={getAwardIcon(team.award)}></i> {team.award}
                          </Badge>
                        )}
                      </div>

                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg="light" text="dark" className="border" style={{ fontWeight: 600 }}>
                            <i className="fa fa-tags me-1"></i> {team.segment || 'Project'}
                          </Badge>
                          <Badge bg="light" text="dark" className="border" style={{ fontWeight: 600 }}>
                            <i className="fa fa-calendar me-1"></i> WICE 2025
                          </Badge>
                        </div>

                        {/* Members list (no leader designation) */}
                        {((team.members && team.members.length) || team.name) && (
                          <div className="mt-3">
                            {(
                              team.members && team.members.length
                                ? team.members
                                : (team.name ? [team.name] : [])
                            ).map((member, mi) => (
                              <div key={mi} style={{ lineHeight: 1.5 }}>{member}</div>
                            ))}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Container>
      </section>

      <FooterV1 />
    </div>
  );
};

export default SelectedTeams;



