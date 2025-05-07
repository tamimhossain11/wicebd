import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Registration = () => {
  const [formData, setFormData] = useState({
    participantCategory: '',
    competitionCategory: '',
    teamMembers: '',
    leaderWhatsApp: '',
    phoneCode: '',
    leaderEmail: '',
    schoolName: '',
    grade: '',
    country: '',
    supervisorName: '',
    supervisorWhatsApp: '',
    supervisorEmail: '',
    projectTitle: '',
    projectCategory: '',
    participatedBefore: '',
    previousCompetition: '',
    socialMedia: '',
    infoSource: '',
  });

  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
  
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
  
    try {
      const saveRes = await axios.post('http://localhost:5000/api/registration/temp-save', formData, {
        withCredentials: true
      });
      
      if (saveRes.status === 200) {
        const payRes = await axios.post('http://localhost:5000/api/payment/initiate', {}, {
          withCredentials: true
        });        
        if (payRes.data?.bkashURL) {
          window.location.href = payRes.data.bkashURL;
        } else {
          toast.error('Payment link not received');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };
  
  return (
    <Container className="mt-5">
      <ToastContainer />
      <h2 className="mb-4 text-center">WICE 2025 Registration Form</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {/* Biodata Section */}
        <h4>Biodata</h4>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="participantCategory">
              <Form.Label>Participant Category</Form.Label>
              <Form.Select
                name="participantCategory"
                value={formData.participantCategory}
                onChange={handleChange}
                required
              >
                <option value="">--Select--</option>
                <option value="International">International Participant</option>
                <option value="National">National Participant</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a participant category.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="competitionCategory">
              <Form.Label>Competition Category</Form.Label>
              <Form.Select
                name="competitionCategory"
                value={formData.competitionCategory}
                onChange={handleChange}
                required
              >
                <option value="">--Choose Category Competition--</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Engineering">Engineering</option>
                <option value="Mathematics">Mathematics</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a competition category.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="teamMembers">
          <Form.Label>Name of Leader & Team Members</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="teamMembers"
            value={formData.teamMembers}
            onChange={handleChange}
            maxLength={180}
            placeholder="Input the name of the team leader and team members with the team leader's name at the beginning."
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter team members' names.
          </Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="leaderWhatsApp">
              <Form.Label>Leader WhatsApp Number</Form.Label>
              <Form.Control
                type="text"
                name="leaderWhatsApp"
                value={formData.leaderWhatsApp}
                onChange={handleChange}
                placeholder="e.g., +62 8177091xxxx"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter the leader's WhatsApp number.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="phoneCode">
              <Form.Label>Phone Code</Form.Label>
              <Form.Select
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleChange}
                required
              >
                <option value="">--Choose Phone Code--</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+62">+62</option>
                {/* Add more options as needed */}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a phone code.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="leaderEmail">
          <Form.Label>Leader Email Address</Form.Label>
          <Form.Control
            type="email"
            name="leaderEmail"
            value={formData.leaderEmail}
            onChange={handleChange}
            placeholder="Enter leader's email"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        {/* School Data Section */}
        <h4>School Data</h4>
        <Form.Group className="mb-3" controlId="schoolName">
          <Form.Label>Name of School/University</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            maxLength={500}
            placeholder="If all members are in the same institution, write only 1 institution. If not, list each with the member's name."
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter the school/university name(s).
          </Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="grade">
              <Form.Label>Grade</Form.Label>
              <Form.Select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                <option value="">--Choose Grade--</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                {/* Add more options as needed */}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a grade.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Your Country"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your country.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Project Details Section */}
        <h4>Project Details</h4>
        <Form.Group className="mb-3" controlId="projectTitle">
          <Form.Label>Project Title</Form.Label>
          <Form.Control
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            placeholder="Enter your project title"
            maxLength={160}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter your project title.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="projectCategory">
          <Form.Label>Project Category</Form.Label>
          <Form.Select
            name="projectCategory"
            value={formData.projectCategory}
            onChange={handleChange}
            required
          >
            <option value="">--Choose Categories--</option>
            <option value="Innovation">Innovation</option>
            <option value="Research">Research</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please choose a category.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="participatedBefore">
          <Form.Label>Has this project participated before?</Form.Label>
          <Form.Select
            name="participatedBefore"
            value={formData.participatedBefore}
            onChange={handleChange}
            required
          >
            <option value="">--Choose--</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select an option.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="previousCompetition">
          <Form.Label>If yes, which competition?</Form.Label>
          <Form.Control
            type="text"
            name="previousCompetition"
            value={formData.previousCompetition}
            onChange={handleChange}
            placeholder="Enter the name of the competition"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="socialMedia">
          <Form.Label>Social Media Account (if no WhatsApp)</Form.Label>
          <Form.Control
            type="text"
            name="socialMedia"
            value={formData.socialMedia}
            onChange={handleChange}
            placeholder="e.g., https://instagram.com/username"
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="infoSource">
          <Form.Label>WICE 2025 Info Source</Form.Label>
          <Form.Control
            type="text"
            name="infoSource"
            value={formData.infoSource}
            onChange={handleChange}
            placeholder="How did you hear about the competition?"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter an info source.
          </Form.Control.Feedback>
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit">
            Submit Registration
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Registration;
