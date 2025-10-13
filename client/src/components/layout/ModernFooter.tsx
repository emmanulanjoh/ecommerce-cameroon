import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const ModernFooter: React.FC = () => {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/products/');
  
  // Hide footer completely on product pages
  if (isProductPage) {
    return null;
  }

  // Full footer for other pages
  return (
    <footer className="bg-dark text-white mt-auto">
      <Container className="py-4">
        <Row className="g-4">
          <Col md={4}>
            <h5 className="fw-bold text-primary mb-3">FindAll Sourcing</h5>
            <p className="small text-white-50 mb-3">Your trusted partner for quality products in Cameroon.</p>
            
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-primary" />
                <small>+237 678 830 036</small>
              </div>
            </div>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/" className="text-white-50 text-decoration-none small">Home</Link>
              <Link to="/products" className="text-white-50 text-decoration-none small">Products</Link>
              <Link to="/about" className="text-white-50 text-decoration-none small">About Us</Link>
              <Link to="/contact" className="text-white-50 text-decoration-none small">Contact</Link>
            </div>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold mb-3">Contact</h6>
            <a href="https://wa.me/237678830036" className="text-success text-decoration-none">
              <FontAwesomeIcon icon={faWhatsapp} size="lg" className="me-2" />
              WhatsApp Us
            </a>
          </Col>
        </Row>

        <hr className="my-3 border-secondary" />
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