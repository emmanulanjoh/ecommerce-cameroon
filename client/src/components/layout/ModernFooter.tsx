import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const ModernFooter: React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      <Container className="py-4">
        <Row className="g-4">
          {/* Company Info */}
          <Col md={4}>
            <h5 className="fw-bold text-primary mb-3">FindAll Sourcing</h5>
            <p className="small text-white-50 mb-3">Your trusted partner for quality products in Cameroon.</p>
            
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-primary" />
                <small>+237 678 830 036</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                <small>emmanuelanjoh2016@gmail.com</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                <small>Douala, Cameroon</small>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={4}>
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/" className="text-white-50 text-decoration-none small">Home</Link>
              <Link to="/products" className="text-white-50 text-decoration-none small">Products</Link>
              <Link to="/about" className="text-white-50 text-decoration-none small">About Us</Link>
              <Link to="/contact" className="text-white-50 text-decoration-none small">Contact</Link>
              <Link to="/faq" className="text-white-50 text-decoration-none small">FAQ</Link>
            </div>
          </Col>

          {/* Social Media */}
          <Col md={4}>
            <h6 className="fw-bold mb-3">Follow Us</h6>
            <div className="d-flex gap-3 mb-3">
              <a href="#" className="text-primary">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#" className="text-info">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="text-danger">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="https://wa.me/237678830036" className="text-success">
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
            </div>
            <p className="small text-white-50 mb-0">Stay connected for updates and offers</p>
          </Col>
        </Row>

        {/* Copyright */}
        <hr className="my-4 border-secondary" />
        <Row>
          <Col className="text-center">
            <small className="text-white-50">
              © 2024 FindAll Sourcing. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default ModernFooter;