import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  // Business info - would come from context or environment in a real app
  const businessInfo = {
    name: 'E-commerce Cameroon',
    phone: '+237000000000',
    whatsapp: '+237000000000',
    email: 'contact@business.cm',
    address: 'Yaoundé, Cameroon'
  };
  
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>{businessInfo.name}</h5>
            <p className="text-muted">
              Your trusted online marketplace connecting Cameroon to quality products and exceptional service.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="https://facebook.com" className="text-white" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="https://instagram.com" className="text-white" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a 
                href={`https://wa.me/${businessInfo.whatsapp.replace(/[^0-9]/g, '')}`} 
                className="text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
            </div>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/products" className="text-decoration-none text-muted">Products</Link></li>
              <li><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted">Contact</Link></li>
              <li><Link to="/terms" className="text-decoration-none text-muted">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-decoration-none text-muted">Privacy Policy</Link></li>
              <li><Link to="/admin-access" className="text-decoration-none text-muted">Admin Access</Link></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                {businessInfo.address}
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                {businessInfo.phone}
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faWhatsapp} className="me-2" />
                {businessInfo.whatsapp}
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                {businessInfo.email}
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col className="text-center text-muted">
            <p className="mb-0">&copy; {currentYear} {businessInfo.name}. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;