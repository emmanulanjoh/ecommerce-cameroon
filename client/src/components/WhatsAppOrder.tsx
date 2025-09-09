import React, { useState } from 'react';
import { Button, Modal, Alert, Form } from 'react-bootstrap';
import { useUser } from '../features/auth/UserContext';
import axios from 'axios';

interface WhatsAppOrderProps {
  product: any;
  quantity: number;
}

const WhatsAppOrder: React.FC<WhatsAppOrderProps> = ({ product, quantity }) => {
  const { user, isAuthenticated } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWhatsAppOrder = async () => {
    if (!isAuthenticated || !user) {
      setError('Please login to place an order');
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      // Create order in database first
      const orderData = {
        items: [{
          product: product._id,
          quantity,
          price: product.price
        }],
        shippingAddress: user.address || {},
        notes: 'WhatsApp Order'
      };

      await axios.post('/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Generate WhatsApp message
      const message = `Hello! I would like to order:
      
Product: ${product.nameEn}
Quantity: ${quantity}
Price: ${product.price} XAF each
Total: ${product.price * quantity} XAF

Customer: ${user.name}
Email: ${user.email}
Phone: ${user.phone || 'Not provided'}

Please confirm availability and delivery details.`;

      const whatsappUrl = `https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER || '+237678830036'}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process order');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Button 
          variant="success" 
          onClick={() => setShowModal(true)}
          className="w-100"
        >
          <i className="fab fa-whatsapp me-2"></i>
          Order via WhatsApp
        </Button>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Login Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="warning">
              Please login to place an order via WhatsApp. This helps us track your orders and provide better service.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" href="/login">
              Login
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Button 
        variant="success" 
        onClick={handleWhatsAppOrder}
        disabled={loading}
        className="w-100"
      >
        <i className="fab fa-whatsapp me-2"></i>
        {loading ? 'Processing...' : 'Order via WhatsApp'}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">{error}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WhatsAppOrder;