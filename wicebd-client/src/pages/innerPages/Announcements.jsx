import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import FooterV1 from '../../components/footer/FooterV1';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Gallery, Item } from 'react-photoswipe-gallery';

const announcements = [
  {
    id: 1,
    title: 'International Round Preparation Bootcamp',
    subtitle: 'WICE Bangladesh Presents',
    date: 'Monday, 11 August 2025',
    time: '4:00 PM',
    location: 'Grand Prince Thai & Chinese Restaurant, Paradise Plaza, Plot No. 6 & 11, Mirpur-1, Dhaka',
    highlight: 'Grand Gala Dinner Night with leadership and participants',
    image: '/images/announcements/bootcamp-2.jpeg',
    poster: '/images/announcements/bootcamp-1.jpeg',
    tags: ['WICE 2025', 'Preparation', 'Bootcamp']
  }
];

const Announcements = () => {
  return (
    <div className="page-wrapper">
      <span className="header-span"></span>
      <HeaderV1 headerStyle="header-style-two" />
      <BreadCrumb title="Announcements" breadCrumb="announcements" />

      <section className="py-5">
        <Container>
          <div className="sec-title text-center mb-4">
            <span className="title">WICE Bangladesh</span>
            <h2>Latest Announcements</h2>
          </div>

          <Gallery>
            <Row className="g-4">
              {announcements.map((a) => (
                <Col md={12} key={a.id}>
                  <Card className="border-0 shadow overflow-hidden" style={{ borderRadius: 16 }}>
                    <div
                      className="w-100"
                      style={{
                        background: 'linear-gradient(135deg, #531616 0%, #2b0e0e 100%)',
                        color: 'white'
                      }}
                    >
                      <Row className="g-0 align-items-center">
                        <Col lg={6} className="order-2 order-lg-1">
                          <div className="p-4 p-lg-5">
                            <div className="text-uppercase small opacity-75 mb-1">{a.subtitle}</div>
                            <h3 className="fw-bold mb-2">{a.title}</h3>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {a.tags.map((t) => (
                                <Badge key={t} bg="light" text="dark" className="border" style={{ fontWeight: 600 }}>{t}</Badge>
                              ))}
                            </div>
                            <ul className="mb-3" style={{ lineHeight: 1.6 }}>
                              <li><i className="fa fa-calendar me-2"></i>{a.date}</li>
                              <li><i className="fa fa-clock me-2"></i>{a.time}</li>
                              <li><i className="fa fa-map-marker-alt me-2"></i>{a.location}</li>
                            </ul>
                            <div className="opacity-100 mb-3">
                              <i className="fa fa-star me-2"></i>
                              <strong>Special Highlight:</strong> {a.highlight}
                            </div>

                            <div className="d-flex gap-2">
                              <Item original={a.poster} thumbnail={a.poster} width={1200} height={1697}>
                                {({ ref, open }) => (
                                  <Button ref={ref} onClick={open} variant="light" className="border fw-semibold">
                                    View Details Poster
                                  </Button>
                                )}
                              </Item>
                              <Item original={a.image} thumbnail={a.image} width={1200} height={1200}>
                                {({ ref, open }) => (
                                  <Button ref={ref} onClick={open} variant="outline-light" className="fw-semibold">
                                    View Cover
                                  </Button>
                                )}
                              </Item>
                            </div>
                          </div>
                        </Col>
                        <Col lg={6} className="order-1 order-lg-2">
                          <div className="position-relative" style={{ minHeight: 300 }}>
                            <Item original={a.image} thumbnail={a.image} width={1200} height={1200}>
                              {({ ref, open }) => (
                                <img
                                  ref={ref}
                                  onClick={open}
                                  src={a.image}
                                  alt={a.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                            </Item>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Gallery>

          {/* Poster gallery grid */}
          <div className="mt-5">
            <h4 className="mb-3">Posters & Media</h4>
            <Gallery>
              <Row className="g-4">
                {announcements.map((a) => (
                  <Col md={6} key={`media-${a.id}`}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
                      <Item original={a.poster} thumbnail={a.poster} width={1200} height={1697}>
                        {({ ref, open }) => (
                          <img
                            ref={ref}
                            onClick={open}
                            src={a.poster}
                            alt={`${a.title} Poster`}
                            style={{ width: '100%', height: 380, objectFit: 'cover', cursor: 'pointer' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                      </Item>
                      <Card.Body>
                        <div className="fw-semibold">{a.title}</div>
                        <div className="text-muted small">Tap to view full poster</div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Gallery>
          </div>
        </Container>
      </section>

      <FooterV1 />
    </div>
  );
};

export default Announcements;


