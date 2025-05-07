import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Registration = () => {
  const [formData, setFormData] = useState({
    participantCategory: '',
    country: '',
    competitionCategory: '',
    projectSubcategory: '',
    categories: '',
    crRefrence:'',
    leader: '',
    institution: '',
    leaderPhone: '',
    leaderWhatsApp: '',
    leaderEmail: '',
    tshirtSizeLeader: '',
    member2: '',
    institution2: '',
    tshirtSize2: '',
    member3: '',
    institution3: '',
    tshirtSize3: '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "competitionCategory" && value !== "Science"
        ? { projectSubcategory: "" } // Reset subcategory if not Project
        : {}),
    }));
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
      const saveRes = await axios.post('https://wicebd.onrender.com/api/registration/temp-save', formData, {
        withCredentials: true
      });

      if (saveRes.status === 200) {
        const payRes = await axios.post('https://wicebd.onrender.com/api/payment/initiate', {}, {
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
    <Container className="mt-5 mb-5">
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


        <Row>
          <Col md={6}>
            <Form.Group controlId="competitionCategory">
              <Form.Label>Segment</Form.Label>
              <Form.Select
                name="competitionCategory"
                value={formData.competitionCategory}
                onChange={handleChange}
                required
              >
                <option value="">--Choose Category Competition--</option>
                <option value="Science">Project</option>
                <option value="Technology">Wall Magazine</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a Segment.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {formData.competitionCategory === "Science" && (
            <Col md={6}>
              <Form.Group controlId="projectSubcategory">
                <Form.Label>Project Subcategory</Form.Label>
                <Form.Select
                  name="projectSubcategory"
                  value={formData.projectSubcategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Choose a Subcategory--</option>
                  <option value="IT and Robotics">IT and Robotics</option>
                  <option value="Environmental science">Environmental science</option>
                  <option value="Innovative social science">Innovative social science</option>
                  <option value="Applied Physics and engineering">Applied Physics and engineering</option>
                  <option value="Applied life science">Applied life science</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a subcategory.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          )}
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="categories">
              <Form.Label>Categories</Form.Label>
              <Form.Select
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                required
              >
                <option value="">--Choose Categories--</option>
                <option value="High School">Elementary || Class 1 to 5</option>
                <option value="Undergraduate">High School ||  Class 6 to 10</option>
                <option value="Postgraduate">College || Class 11 to 12</option>
                <option value="University">University</option>
                {/* Add more options as needed */}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a Categories.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="crRefrence">
              <Form.Label>CR Refrence</Form.Label>
              <Form.Control
                type="text"
                name="crRefrence"
                value={formData.crRefrence}
                onChange={handleChange}
                placeholder="Enter CR Refrence"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide your CR Name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>


        {/*Leader and team member section*/}


        <h4>Team Leader Information</h4>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="leader">
              <Form.Label>Team Leader Name</Form.Label>
              <Form.Control
                type="text"
                name="leader"
                value={formData.leader}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter team leader name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="institution">
              <Form.Label>Institution</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter institute name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="leaderWhatsApp">
              <Form.Label>Leader WhatsApp Number</Form.Label>
              <Form.Control
                type="text"
                name="leaderWhatsApp"
                value={formData.leaderWhatsApp}
                onChange={handleChange}
                placeholder="e.g., +880 171660xxxx"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter the leader's WhatsApp number.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
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
          </Col>
        </Row>













        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="leaderPhone">
              <Form.Label>Leader Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="leaderPhone"
                value={formData.leaderPhone}
                onChange={handleChange}
                placeholder="e.g., +880 171660xxxx"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter the leader's phone number.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="tshirtSizeLeader" className="mb-3">
              <Form.Label>T-Shirt Size (Leader)</Form.Label>
              <Form.Select
                name="tshirtSizeLeader"
                value={formData.tshirtSizeLeader}
                onChange={handleChange}
                required
              >
                <option value="">--Select Size--</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a T-Shirt size.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>



        {/* Team Member */}
        <h4>Team Member's Information</h4>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="member2">
              <Form.Label>2nd Team Member Name</Form.Label>
              <Form.Control
                type="text"
                name="member2"
                value={formData.member2}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter 2nd team member name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="institution2">
              <Form.Label>Institution</Form.Label>
              <Form.Control
                type="text"
                name="institution2"
                value={formData.institution2}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter institute name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Col md={6}>
          <Form.Group controlId="tshirtSize2" className="mb-3">
            <Form.Label>T-Shirt Size (2nd Member)</Form.Label>
            <Form.Select
              name="tshirtSize2"
              value={formData.tshirtSize2}
              onChange={handleChange}
              required
            >
              <option value="">--Select Size--</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a T-Shirt size.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="member3">
              <Form.Label>3rd Team Member Name</Form.Label>
              <Form.Control
                type="text"
                name="member3"
                value={formData.member3}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter 3rd team member name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="institution3">
              <Form.Label>Institution</Form.Label>
              <Form.Control
                type="text"
                name="institution3"
                value={formData.institution3}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter institute name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Col md={6}>
          <Form.Group controlId="tshirtSize3" className="mb-3">
            <Form.Label>T-Shirt Size (3rd Member)</Form.Label>
            <Form.Select
              name="tshirtSize3"
              value={formData.tshirtSize3}
              onChange={handleChange}
              required
            >
              <option value="">--Select Size--</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </Form.Select>
          </Form.Group>
        </Col>








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
            Submit and proceed for payment.
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Registration;
