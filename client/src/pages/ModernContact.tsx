import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';

const ModernContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setAlertMessage('Message sent successfully! We will get back to you soon.');
        setAlertVariant('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setAlertMessage('Failed to send message. Please try again.');
        setAlertVariant('danger');
      }
    } catch (error) {
      setAlertMessage('Failed to send message. Please try again.');
      setAlertVariant('danger');
    }
    
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const contactInfo = [
    {
      icon: faPhone,
      title: 'Phone',
      details: ['+237 678 830 036', 'Available 24/7'],
      color: 'success',
    },
    {
      icon: faEnvelope,
      title: 'Email',
      details: ['emmanuelanjoh2016@gmail.com', 'Quick response'],
      color: 'primary',
    },
    {
      icon: faMapMarkerAlt,
      title: 'Address',
      details: ['Douala, Cameroon', 'Yaoundé, Cameroon'],
      color: 'warning',
    },
    {
      icon: faWhatsapp,
      title: 'WhatsApp',
      details: ['+237 678 830 036', 'Instant messaging'],
      color: 'success',
    },
  ];

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
            <p className="lead">We're here to help! Get in touch with us for any questions or support.</p>
          </motion.div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        <Row className="g-4">
          {/* Contact Form */}
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-lg border-0 h-100">
                <Card.Header className="bg-primary text-white">
                  <h3 className="mb-0">
                    <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                    Send us a Message
                  </h3>
                </Card.Header>
                <Card.Body className="p-4">
                  {showAlert && (
                    <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
                      {alertMessage}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            size="lg"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            required
                            size="lg"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Subject</Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="What's this about?"
                            required
                            size="lg"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={6}
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us more about your inquiry..."
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Button type="submit" variant="primary" size="lg" className="w-100">
                          <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                          Send Message
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Contact Information */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="h-100"
            >
              <div className="d-flex flex-column gap-3 h-100">
                <h3 className="text-primary fw-bold mb-3">Get in Touch</h3>
                
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-start">
                        <div className={`bg-${info.color} text-white rounded-circle p-3 me-3 flex-shrink-0`}>
                          <FontAwesomeIcon icon={info.icon} size="lg" />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">{info.title}</h6>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted small mb-0">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}

                {/* Business Hours */}
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-start">
                      <div className="bg-info text-white rounded-circle p-3 me-3 flex-shrink-0">
                        <FontAwesomeIcon icon={faClock} size="lg" />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-2">Business Hours</h6>
                        <p className="text-muted small mb-1">Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p className="text-muted small mb-1">Saturday: 9:00 AM - 4:00 PM</p>
                        <p className="text-muted small mb-0">Sunday: Closed</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Social Media */}
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <h6 className="fw-bold mb-3">Follow Us</h6>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm" className="rounded-circle p-2">
                        <FontAwesomeIcon icon={faFacebook} />
                      </Button>
                      <Button variant="outline-info" size="sm" className="rounded-circle p-2">
                        <FontAwesomeIcon icon={faTwitter} />
                      </Button>
                      <Button variant="outline-danger" size="sm" className="rounded-circle p-2">
                        <FontAwesomeIcon icon={faInstagram} />
                      </Button>
                      <Button variant="outline-success" size="sm" className="rounded-circle p-2">
                        <FontAwesomeIcon icon={faWhatsapp} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Map Section */}
        <Row className="mt-5">
          <Col xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4 text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
                  </div>
                  <h3 className="fw-bold mb-3">Find Us</h3>
                  <p className="text-muted mb-0">We're located in the heart of Cameroon's major cities</p>
                  <div className="bg-light rounded p-5 mt-4">
                    <p className="text-muted mb-0">Interactive map coming soon...</p>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ModernContact;