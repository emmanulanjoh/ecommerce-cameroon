import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminAccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg border-0 text-center">
              <Card.Body className="p-5">
                <FontAwesomeIcon 
                  icon={faUserShield} 
                  size="4x" 
                  className="text-primary mb-4"
                />
                <h2 className="fw-bold mb-3">Admin Dashboard Access</h2>
                <p className="text-muted mb-4">
                  Access the full admin dashboard to manage products, orders, and users.
                </p>
                
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/admin/login')}
                  className="px-4 py-3"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                  Go to Admin Dashboard
                </Button>
                
                <div className="mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Requires admin credentials to access
                  </small>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAccess;