import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faClock, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';

const ModernContact: React.FC = () => {

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
            <h1 className="display-4 fw-bold mb-3">Contact Information</h1>
            <p className="lead">Professional e-commerce solutions for Cameroon. Reach out to us through any of the channels below.</p>
          </motion.div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        <Row className="g-4">
          {/* Company Information */}
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-lg border-0 h-100">
                <Card.Header className="bg-primary text-white">
                  <h3 className="mb-0">
                    <FontAwesomeIcon icon={faBuilding} className="me-2" />
                    About Our Business
                  </h3>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <h5 className="text-primary fw-bold mb-3">E-commerce Cameroon</h5>
                    <p className="text-muted mb-3">
                      We are a leading e-commerce platform serving customers across Cameroon with quality products 
                      and exceptional service. Our commitment to excellence has made us a trusted name in online retail.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold mb-2">Our Services</h6>
                    <ul className="text-muted">
                      <li>Wide range of quality products</li>
                      <li>Fast and reliable delivery</li>
                      <li>Secure payment processing</li>
                      <li>Customer support in English and French</li>
                      <li>WhatsApp ordering for convenience</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold mb-2">Why Choose Us</h6>
                    <ul className="text-muted">
                      <li>Local expertise with international standards</li>
                      <li>Competitive pricing and regular promotions</li>
                      <li>Warranty support on all products</li>
                      <li>Easy returns and exchanges</li>
                      <li>Multilingual customer service</li>
                    </ul>
                  </div>
                  
                  <div className="bg-light rounded p-3">
                    <h6 className="fw-bold mb-2">Get in Touch</h6>
                    <p className="text-muted mb-0">
                      For inquiries, orders, or support, please use any of the contact methods listed on this page. 
                      We're here to serve you better.
                    </p>
                  </div>
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