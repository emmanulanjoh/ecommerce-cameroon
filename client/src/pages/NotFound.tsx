import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';

const NotFound: React.FC = () => {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead text-muted mb-5">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <Link to="/" className="btn btn-primary">
              <FontAwesomeIcon icon={faHome} className="me-2" /> Back to Home
            </Link>
            <Link to="/products" className="btn btn-outline-primary">
              <FontAwesomeIcon icon={faSearch} className="me-2" /> Browse Products
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;