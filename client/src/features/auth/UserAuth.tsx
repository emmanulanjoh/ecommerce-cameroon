import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const UserAuth: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register } = useUser();
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginData.email, loginData.password);
      setSuccess('Login successful!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password
      });
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h3 className="mb-0">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Account Access
              </h3>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'login')}>
                <Nav variant="pills" className="justify-content-center mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="login">Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="register">Register</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="login">
                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          required
                          placeholder="Enter your email"
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>
                          <FontAwesomeIcon icon={faLock} className="me-2" />
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          required
                          placeholder="Enter your password"
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </Button>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="register">
                    <Form onSubmit={handleRegister}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                          required
                          placeholder="Enter your full name"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          required
                          placeholder="Enter your email"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faPhone} className="me-2" />
                          Phone Number (Optional)
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                          placeholder="Enter your phone number"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faLock} className="me-2" />
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          required
                          minLength={6}
                          placeholder="Enter your password"
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>
                          <FontAwesomeIcon icon={faLock} className="me-2" />
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          required
                          placeholder="Confirm your password"
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="success"
                        size="lg"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserAuth;