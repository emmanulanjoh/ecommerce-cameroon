import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Tab, Nav, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faStore, faCreditCard, faShippingFast, faEnvelope, faUsers } from '@fortawesome/free-solid-svg-icons';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('store');
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };
  
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">Settings</Card.Header>
      <Card.Body>
        <Tab.Container activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)}>
          <Row>
            <Col md={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="store">
                    <FontAwesomeIcon icon={faStore} className="me-2" /> Store Information
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="payment">
                    <FontAwesomeIcon icon={faCreditCard} className="me-2" /> Payment Methods
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="shipping">
                    <FontAwesomeIcon icon={faShippingFast} className="me-2" /> Shipping Options
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="email">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" /> Email Templates
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users">
                    <FontAwesomeIcon icon={faUsers} className="me-2" /> User Management
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col md={9}>
              {success && <Alert variant="success">{success}</Alert>}
              
              <Tab.Content>
                <Tab.Pane eventKey="store">
                  <h4 className="mb-4">Store Information</h4>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Store Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            defaultValue="Findall sourcing" 
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control 
                            type="email" 
                            defaultValue="emmanuelanjoh2016@gmail.com" 
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control 
                            type="text" 
                            defaultValue="+237678830036" 
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>WhatsApp Number</Form.Label>
                          <Form.Control 
                            type="text" 
                            defaultValue="+237678830036" 
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        defaultValue="Mimboman petit marche, Yaoundé, Cameroon" 
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Default Language</Form.Label>
                          <Form.Select defaultValue="en">
                            <option value="en">English</option>
                            <option value="fr">French</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Currency</Form.Label>
                          <Form.Select defaultValue="XAF">
                            <option value="XAF">CFA Franc (XAF)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Button type="submit" variant="primary">
                      <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane eventKey="payment">
                  <h4 className="mb-4">Payment Methods</h4>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="cash-on-delivery"
                        label="Cash on Delivery"
                        defaultChecked
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="mobile-money"
                        label="Mobile Money"
                        defaultChecked
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Check 
                        type="switch"
                        id="bank-transfer"
                        label="Bank Transfer"
                      />
                    </Form.Group>
                    
                    <Button type="submit" variant="primary">
                      <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane eventKey="shipping">
                  <h4 className="mb-4">Shipping Options</h4>
                  <p className="text-muted">Configure your shipping methods and rates.</p>
                  <Form onSubmit={handleSubmit}>
                    <Card className="mb-3">
                      <Card.Header>Local Delivery</Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="local-delivery"
                            label="Enable Local Delivery"
                            defaultChecked
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Delivery Fee (XAF)</Form.Label>
                          <Form.Control 
                            type="number" 
                            defaultValue="1500" 
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                    
                    <Card className="mb-4">
                      <Card.Header>National Shipping</Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="national-shipping"
                            label="Enable National Shipping"
                            defaultChecked
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Base Shipping Fee (XAF)</Form.Label>
                          <Form.Control 
                            type="number" 
                            defaultValue="3000" 
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                    
                    <Button type="submit" variant="primary">
                      <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane eventKey="email">
                  <h4 className="mb-4">Email Templates</h4>
                  <p className="text-muted">Configure email templates for various notifications.</p>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Order Confirmation Template</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={5} 
                        defaultValue="Thank you for your order! Your order number is {{orderNumber}}. We will process it shortly." 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Shipping Confirmation Template</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={5} 
                        defaultValue="Your order {{orderNumber}} has been shipped! You can track it using the following information: {{trackingInfo}}." 
                      />
                    </Form.Group>
                    
                    <Button type="submit" variant="primary">
                      <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane eventKey="users">
                  <h4 className="mb-4">User Management</h4>
                  <p className="text-muted">Manage admin users and permissions.</p>
                  <Button variant="primary" className="mb-4">Add New Admin User</Button>
                  
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>admin</td>
                        <td>emmanuelanjoh2016@gmail.com</td>
                        <td>Super Admin</td>
                        <td>Today</td>
                        <td>
                          <Button variant="outline-primary" size="sm">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default Settings;