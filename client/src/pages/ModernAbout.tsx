import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faShippingFast, faStar, faUsers, faBuilding, faClock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const ModernAbout: React.FC = () => {
  const values = [
    {
      icon: faShieldAlt,
      title: 'Trust & Security',
      description: 'Your security is our priority with encrypted transactions and secure data handling.',
      color: 'success',
    },
    {
      icon: faShippingFast,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery across Cameroon with real-time tracking.',
      color: 'primary',
    },
    {
      icon: faStar,
      title: 'Quality Products',
      description: 'Carefully curated products from trusted suppliers and brands.',
      color: 'warning',
    },
    {
      icon: faUsers,
      title: 'Customer First',
      description: '24/7 customer support with personalized service and care.',
      color: 'info',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: faUsers, color: 'primary' },
    { number: '5,000+', label: 'Products', icon: faBuilding, color: 'success' },
    { number: '50+', label: 'Cities Served', icon: faShippingFast, color: 'info' },
    { number: '99%', label: 'Satisfaction Rate', icon: faStar, color: 'warning' },
  ];

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div style={{ backgroundColor: '#232F3E', color: 'white', padding: '60px 0' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 style={{ fontSize: '3rem', fontWeight: 400, marginBottom: '1rem' }}>About FindAll Sourcing</h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Your trusted partner for online shopping in Cameroon, connecting you with quality products and exceptional service.</p>
          </motion.div>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="py-5">
        <Row className="g-4">
          {stats.map((stat, index) => (
            <Col key={index} xs={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-100"
              >
                <Card className="text-center border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div style={{ 
                      backgroundColor: '#FF9900', 
                      color: '#0F1111', 
                      borderRadius: '50%', 
                      width: '60px', 
                      height: '60px', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1rem' 
                    }}>
                      <FontAwesomeIcon icon={stat.icon} size="lg" />
                    </div>
                    <h3 style={{ fontWeight: 'bold', color: '#0F1111', marginBottom: '0.5rem' }}>{stat.number}</h3>
                    <p className="text-muted mb-0 small">{stat.label}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Our Story */}
      <Container className="py-5">
        <Row className="align-items-center g-4">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="d-flex align-items-center mb-4">
                <div style={{ 
                  backgroundColor: '#FF9900', 
                  color: '#0F1111', 
                  borderRadius: '50%', 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginRight: '1rem' 
                }}>
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <h2 style={{ fontWeight: 'bold', color: '#0F1111', margin: 0 }}>Our Story</h2>
              </div>
              
              <div className="d-flex flex-column gap-3">
                <p className="text-muted">
                  Founded in 2020, FindAll Sourcing began with a simple mission: to make quality products accessible to everyone across Cameroon through a seamless online shopping experience.
                </p>
                <p className="text-muted">
                  What started as a small team with big dreams has grown into Cameroon's trusted e-commerce platform, serving thousands of customers with dedication and innovation.
                </p>
                <p className="text-muted">
                  Today, we continue to evolve, embracing new technologies and expanding our reach to serve you better.
                </p>
              </div>
            </motion.div>
          </Col>
          
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ 
                backgroundColor: '#232F3E', 
                borderRadius: '16px', 
                height: '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white' 
              }}>
                <div className="text-center">
                  <FontAwesomeIcon icon={faBuilding} size="4x" style={{ marginBottom: '1rem' }} />
                  <h4>Our Journey</h4>
                  <p style={{ margin: 0 }}>Building Cameroon's Future</p>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Why Choose Us Section */}
      <div className="bg-white py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <h2 className="fw-bold mb-3">Why Choose Us</h2>
            <p className="text-muted">Your satisfaction is our priority</p>
          </motion.div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 * 0.1 }}
                className="h-100"
              >
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 text-center">
                    <div style={{ 
                      backgroundColor: '#FF9900', 
                      color: '#0F1111', 
                      borderRadius: '50%', 
                      width: '60px', 
                      height: '60px', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1rem' 
                    }}>
                      <FontAwesomeIcon icon={faShieldAlt} size="lg" />
                    </div>
                    <h5 className="fw-bold mb-3">100% Authentic</h5>
                    <p className="text-muted small mb-0">Original products with quality guarantee</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.1 }}
                className="h-100"
              >
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 text-center">
                    <div style={{ 
                      backgroundColor: '#FF9900', 
                      color: '#0F1111', 
                      borderRadius: '50%', 
                      width: '60px', 
                      height: '60px', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1rem' 
                    }}>
                      <FontAwesomeIcon icon={faShippingFast} size="lg" />
                    </div>
                    <h5 className="fw-bold mb-3">Fast Delivery</h5>
                    <p className="text-muted small mb-0">Quick delivery across Cameroon</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 * 0.1 }}
                className="h-100"
              >
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 text-center">
                    <div style={{ 
                      backgroundColor: '#FF9900', 
                      color: '#0F1111', 
                      borderRadius: '50%', 
                      width: '60px', 
                      height: '60px', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1rem' 
                    }}>
                      <FontAwesomeIcon icon={faShieldAlt} size="lg" />
                    </div>
                    <h5 className="fw-bold mb-3">Secure Payment</h5>
                    <p className="text-muted small mb-0">Pay after verification</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3 * 0.1 }}
                className="h-100"
              >
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 text-center">
                    <div style={{ 
                      backgroundColor: '#FF9900', 
                      color: '#0F1111', 
                      borderRadius: '50%', 
                      width: '60px', 
                      height: '60px', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1rem' 
                    }}>
                      <FontAwesomeIcon icon={faUsers} size="lg" />
                    </div>
                    <h5 className="fw-bold mb-3">24/7 Support</h5>
                    <p className="text-muted small mb-0">Round-the-clock assistance</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Our Values */}
      <div className="bg-light py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <h2 className="fw-bold mb-3">Our Values</h2>
            <p className="text-muted">The principles that guide everything we do and shape our commitment to excellence.</p>
          </motion.div>

          <Row className="g-4">
            {values.map((value, index) => (
              <Col key={index} md={6} lg={3}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-100"
                >
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-4 text-center">
                      <div style={{ 
                        backgroundColor: '#FF9900', 
                        color: '#0F1111', 
                        borderRadius: '50%', 
                        width: '60px', 
                        height: '60px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginBottom: '1rem' 
                      }}>
                        <FontAwesomeIcon icon={value.icon} size="lg" />
                      </div>
                      <h5 className="fw-bold mb-3">{value.title}</h5>
                      <p className="text-muted small mb-0">{value.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Mission Statement */}
      <div style={{ backgroundColor: '#232F3E', color: 'white', padding: '60px 0' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 style={{ fontWeight: 'bold', marginBottom: '2rem' }}>Our Mission</h2>
            <blockquote style={{ fontSize: '1.25rem', fontStyle: 'italic', margin: 0 }}>
              "To revolutionize e-commerce in Cameroon by providing a seamless, secure, and delightful shopping experience that connects customers with quality products and exceptional service."
            </blockquote>
          </motion.div>
        </Container>
      </div>
    </div>
  );
};

export default ModernAbout;