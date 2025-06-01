import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../../assets/css/OlympiadForm.css';

const OlympiadForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    institution: '',
    crReference: ''
  });

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      toast.error('Please fill all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendUrl}/api/olympiad/register`, formData);

      if (response.data.success) {
        toast.success('Registration submitted successfully!');
        // Reset form after successful submission
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          institution: '',
          crReference: ''
        });
        setValidated(false);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="olympiad-form-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="olympiad-form-card shadow-lg">
              <Card.Header className="olympiad-form-header text-center py-4">
                <h2 className="mb-0">WICE Olympiad Registration</h2>
                <p className="mb-0">Join our prestigious academic competition</p>
              </Card.Header>

              <Card.Body className="p-4 p-md-5 text-center">
                <h4 className="text-danger mb-3">Registration Closed</h4>
                <p className="mb-0">
                  We are sorry to say that the registration for the WICE Olympiad has been closed.
                  You cannot participate anymore.
                </p>
              </Card.Body>


              {/*<Card.Body className="p-4 p-md-5">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-4 olympiad-form-group">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="olympiad-form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide your full name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 olympiad-form-group">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                      className="olympiad-form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email address.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 olympiad-form-group">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{11}"
                      placeholder="01XXXXXXXXX (11 digits)"
                      className="olympiad-form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid 11-digit phone number.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 olympiad-form-group">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Your full address"
                      className="olympiad-form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide your address.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 olympiad-form-group">
                    <Form.Label>Institution *</Form.Label>
                    <Form.Control
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                      placeholder="School/College/University name"
                      className="olympiad-form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide your institution name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 olympiad-form-group">
                    <Form.Label>CR Reference</Form.Label>
                    <Form.Control
                      type="text"
                      name="crReference"
                      value={formData.crReference}
                      onChange={handleChange}
                      placeholder="If referred by a CR (optional)"
                      className="olympiad-form-control"
                    />
                  </Form.Group>

                  <div className="text-center mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="olympiad-submit-btn px-4 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          {' Submitting...'}
                        </>
                      ) : 'Submit Registration'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              */}
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default OlympiadForm;