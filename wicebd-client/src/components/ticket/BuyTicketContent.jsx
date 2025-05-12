import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Registration = () => {
  const [formData, setFormData] = useState({
    competitionCategory: '',
    projectSubcategory: '',
    categories: '',
    crRefrence: '',
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
  const [fieldErrors, setFieldErrors] = useState({
    leaderPhone: false,
    leaderWhatsApp: false,
    leaderEmail: false,
    socialMedia: false,
    crRefrence: false,
    leader: false,
    institution: false,
    projectTitle: false,
    projectCategory: false,
    participatedBefore: false,
    infoSource: false
  });

  // Get backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Validation functions
  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 11;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateURL = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'leaderPhone':
      case 'leaderWhatsApp':
        return validatePhone(value);
      case 'leaderEmail':
        return validateEmail(value);
      case 'socialMedia':
        return validateURL(value);
      default:
        return value !== '';
    }
  };

  // Real-time validation feedback
  useEffect(() => {
    const validateFields = () => {
      const newFieldErrors = {};
      Object.keys(formData).forEach(key => {
        if (key in fieldErrors) {
          newFieldErrors[key] = !validateField(key, formData[key]);
        }
      });
      setFieldErrors(newFieldErrors);
    };
    validateFields();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "competitionCategory" && value !== "Project" 
        ? { projectSubcategory: "" } 
        : {}),
      ...(name === "participatedBefore" && value === "No" 
        ? { previousCompetition: "" } 
        : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    // Validate all fields
    let formIsValid = true;
    const newFieldErrors = {...fieldErrors};
    
    Object.keys(fieldErrors).forEach(key => {
      newFieldErrors[key] = !validateField(key, formData[key]);
      if (newFieldErrors[key]) formIsValid = false;
    });

    setFieldErrors(newFieldErrors);
    setValidated(true);

    if (!formIsValid) {
      toast.error('Please correct the errors in the form');
      return;
    }

    try {
      const saveRes = await axios.post(`${backendUrl}/api/registration/start`, formData);
      const { paymentID } = saveRes.data;

      if (!paymentID) {
        toast.error('Failed to get payment ID');
        return;
      }

      const payRes = await axios.post(`${backendUrl}/api/payment/initiate`, {
        paymentID,
        formData,
      });

      const { bkashURL, paymentID: bkashPaymentID } = payRes.data;

      if (bkashURL && bkashPaymentID) {
        sessionStorage.setItem("bkashPaymentID", bkashPaymentID);
        window.location.href = bkashURL;
      } else {
        toast.error('bKash payment URL or ID not received');
      }
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <ToastContainer />
      <h2 className="mb-4 text-center">WICE 2025 Registration Form</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {/* Biodata Section */}
        <h4>Biodata</h4>
        <Row>
          <Col md={6}>
            <Form.Group controlId="competitionCategory">
              <Form.Label>Segment</Form.Label>
              <Form.Select
                name="competitionCategory"
                value={formData.competitionCategory}
                onChange={handleChange}
                required
                isInvalid={validated && !formData.competitionCategory}
              >
                <option value="">--Choose Category Competition--</option>
                <option value="Project">Project</option>
                <option value="Megazine">Wall Magazine</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a Segment.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {formData.competitionCategory === "Project" && (
            <Col md={6}>
              <Form.Group controlId="projectSubcategory">
                <Form.Label>Project Subcategory</Form.Label>
                <Form.Select
                  name="projectSubcategory"
                  value={formData.projectSubcategory}
                  onChange={handleChange}
                  required
                  isInvalid={validated && !formData.projectSubcategory}
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
                isInvalid={validated && !formData.categories}
              >
                <option value="">--Choose Categories--</option>
                <option value="Primary School">Elementary || Class 1 to 5</option>
                <option value="High School">High School || Class 6 to 10</option>
                <option value="college">College || Class 11 to 12</option>
                <option value="University">University</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a category.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="crRefrence">
              <Form.Label>CR Reference</Form.Label>
              <Form.Control
                type="text"
                name="crRefrence"
                value={formData.crRefrence}
                onChange={handleChange}
                placeholder="Enter CR Reference"
                required
                isInvalid={fieldErrors.crRefrence}
              />
              <Form.Control.Feedback type="invalid">
                Please provide your CR Name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Team Leader Information */}
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
                isInvalid={fieldErrors.leader}
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
                isInvalid={fieldErrors.institution}
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
                placeholder="e.g., 0171660xxxxx"
                required
                isInvalid={fieldErrors.leaderWhatsApp}
              />
              <Form.Control.Feedback type="invalid">
                {formData.leaderWhatsApp ? 
                  'Must be 11 digits (e.g., 0171660xxxxx)' : 
                  'WhatsApp number is required'}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="leaderEmail">
              <Form.Label>Leader Email Address</Form.Label>
              <Form.Control
                type="email"
                name="leaderEmail"
                value={formData.leaderEmail}
                onChange={handleChange}
                placeholder="Enter leader's email"
                required
                isInvalid={fieldErrors.leaderEmail}
              />
              <Form.Control.Feedback type="invalid">
                {formData.leaderEmail ? 
                  'Please enter a valid email' : 
                  'Email is required'}
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
                placeholder="e.g., 0171660xxxxx"
                required
                isInvalid={fieldErrors.leaderPhone}
              />
              <Form.Control.Feedback type="invalid">
                {formData.leaderPhone ? 
                  'Must be 11 digits (e.g., 0171660xxxxx)' : 
                  'Phone number is required'}
              </Form.Control.Feedback>
              <Form.Text muted>Enter 11 digit Bangladesh number without +88 or spaces</Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="tshirtSizeLeader">
              <Form.Label>T-Shirt Size (Leader)</Form.Label>
              <Form.Select
                name="tshirtSizeLeader"
                value={formData.tshirtSizeLeader}
                onChange={handleChange}
                required
                isInvalid={validated && !formData.tshirtSizeLeader}
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

        {/* Team Members Section */}
        <h4>Team Member's Information (Optional)</h4>
        {/* Member 2 */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="member2">
              <Form.Label>2nd Team Member Name</Form.Label>
              <Form.Control
                type="text"
                name="member2"
                value={formData.member2}
                onChange={handleChange}
              />
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
              />
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

        {/* Member 3 */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="member3">
              <Form.Label>3rd Team Member Name</Form.Label>
              <Form.Control
                type="text"
                name="member3"
                value={formData.member3}
                onChange={handleChange}
              />
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
              />
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

        {/* Project Details */}
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
            isInvalid={fieldErrors.projectTitle}
          />
          <Form.Text muted>{formData.projectTitle.length}/160 characters</Form.Text>
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
            isInvalid={fieldErrors.projectCategory}
          >
            <option value="">--Choose Category--</option>
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
            isInvalid={fieldErrors.participatedBefore}
          >
            <option value="">--Choose--</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select an option.
          </Form.Control.Feedback>
        </Form.Group>

        {formData.participatedBefore === "Yes" && (
          <Form.Group className="mb-3" controlId="previousCompetition">
            <Form.Label>Which competition?</Form.Label>
            <Form.Control
              type="text"
              name="previousCompetition"
              value={formData.previousCompetition}
              onChange={handleChange}
              placeholder="Enter competition name"
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="socialMedia">
          <Form.Label>Social Media Account (if no WhatsApp)</Form.Label>
          <Form.Control
            type="text"
            name="socialMedia"
            value={formData.socialMedia}
            onChange={handleChange}
            placeholder="e.g., https://instagram.com/username"
            isInvalid={fieldErrors.socialMedia}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid URL (include http:// or https://)
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="infoSource">
          <Form.Label>How did you hear about WICE 2025?</Form.Label>
          <Form.Control
            type="text"
            name="infoSource"
            value={formData.infoSource}
            onChange={handleChange}
            placeholder="e.g., Facebook, Friend, Teacher etc."
            required
            isInvalid={fieldErrors.infoSource}
          />
          <Form.Control.Feedback type="invalid">
            Please tell us how you heard about the competition.
          </Form.Control.Feedback>
        </Form.Group>

        <div className="text-center">
          <Button className="btn-gradient" type="submit">
            Submit and Proceed to Payment
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default Registration;