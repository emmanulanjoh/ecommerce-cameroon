import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Button, Badge, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faShoppingBag, faCog, faSignOutAlt, 
  faBox, faClock, faCheckCircle, faTruck 
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../features/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Order {
  _id: string;
  items: Array<{
    product: {
      _id: string;
      nameEn: string;
      nameFr?: string;
      images: string[];
      price: number;
    };
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  trackingNumber?: string;
}

const UserDashboard: React.FC = () => {
  const { user, logout, updateProfile, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      region: user?.address?.region || '',
      country: user?.address?.country || 'Cameroon'
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (err: any) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfile(profileData);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'warning', icon: faClock, text: 'Pending' },
      confirmed: { variant: 'info', icon: faCheckCircle, text: 'Confirmed' },
      processing: { variant: 'primary', icon: faBox, text: 'Processing' },
      shipped: { variant: 'info', icon: faTruck, text: 'Shipped' },
      delivered: { variant: 'success', icon: faCheckCircle, text: 'Delivered' },
      cancelled: { variant: 'danger', icon: faBox, text: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge bg={config.variant}>
        <FontAwesomeIcon icon={config.icon} className="me-1" />
        {config.text}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faUser} size="3x" className="text-primary" />
              </div>
              <h5>{user?.name}</h5>
              <p className="text-muted">{user?.email}</p>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Tab.Container defaultActiveKey="orders">
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="orders">
                  <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                  My Orders ({orders.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="profile">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  Profile Settings
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="orders">
                {error && <Alert variant="danger">{error}</Alert>}
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <Card className="text-center py-5">
                    <Card.Body>
                      <FontAwesomeIcon icon={faShoppingBag} size="3x" className="text-muted mb-3" />
                      <h5>No Orders Yet</h5>
                      <p className="text-muted">Start shopping to see your orders here!</p>
                      <Button variant="primary" onClick={() => navigate('/products')}>
                        Browse Products
                      </Button>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order._id} className="mb-3">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Order #{order._id.slice(-8)}</strong>
                            <small className="text-muted ms-2">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {getStatusBadge(order.status)}
                            <strong>{formatPrice(order.totalAmount)}</strong>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            {order.items.map((item, index) => {
                              // Handle deleted products gracefully
                              const product = item.product;
                              const productName = product?.nameEn || item.name || 'Product Unavailable';
                              const productImage = product?.images?.[0] || item.image || '/placeholder.jpg';
                              const productPrice = item.price || product?.price || 0;
                              
                              return (
                                <Col md={6} key={index} className="mb-3">
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={productImage}
                                      alt={productName}
                                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                      className="rounded me-3"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                      }}
                                    />
                                    <div>
                                      <h6 className="mb-1">
                                        {productName}
                                        {!product && (
                                          <Badge bg="secondary" className="ms-2" style={{fontSize: '0.7em'}}>
                                            Unavailable
                                          </Badge>
                                        )}
                                      </h6>
                                      <small className="text-muted">
                                        Qty: {item.quantity} × {formatPrice(productPrice)}
                                      </small>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>
                          {order.trackingNumber && (
                            <div className="mt-2">
                              <small className="text-muted">
                                Tracking: <strong>{order.trackingNumber}</strong>
                              </small>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="profile">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Profile Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleProfileUpdate}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <h6 className="mt-4 mb-3">Address Information</h6>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Street Address</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.address.street}
                              onChange={(e) => setProfileData({
                                ...profileData, 
                                address: {...profileData.address, street: e.target.value}
                              })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.address.city}
                              onChange={(e) => setProfileData({
                                ...profileData, 
                                address: {...profileData.address, city: e.target.value}
                              })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Region</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.address.region}
                              onChange={(e) => setProfileData({
                                ...profileData, 
                                address: {...profileData.address, region: e.target.value}
                              })}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button type="submit" variant="primary">
                        Update Profile
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;