import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const AdminAccess: React.FC = () => {
  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Header className="bg-primary text-white text-center">
                <h3><FontAwesomeIcon icon={faLock} className="me-2" /> Admin Access</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <p className="lead">Welcome to the admin area</p>
                  <p>To access the admin dashboard, please log in with your admin credentials.</p>
                </div>
                
                <Card className="bg-light mb-4">
                  <Card.Body>
                    <h5>How to access the admin dashboard:</h5>
                    <ol>
                      <li>Go to the <Link to="/login">login page</Link></li>
                      <li>Enter your admin username and password</li>
                      <li>Click "Sign In" to access the dashboard</li>
                    </ol>
                  </Card.Body>
                </Card>
                
                <div className="d-grid gap-2">
                  <Link to="/login">
                    <Button variant="primary" className="w-100">
                      <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                      Go to Login Page
                    </Button>
                  </Link>
                </div>
              </Card.Body>
              <Card.Footer className="text-center text-muted">
                <small>If you don't have admin credentials, please contact the system administrator.</small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default AdminAccess;