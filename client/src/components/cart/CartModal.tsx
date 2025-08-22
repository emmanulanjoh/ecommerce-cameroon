import React from 'react';
import { Modal, Button, ListGroup, Row, Col, Form } from 'react-bootstrap';
import './CartModal.css';
import { useLanguage } from '../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../features/auth';

interface CartModalProps {
  show: boolean;
  onHide: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ show, onHide }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    generateWhatsAppMessage,
    createOrder
  } = useCart();
  const { user, isAuthenticated, token } = useUser();
  const { t } = useLanguage();

  const whatsappNumber = '+237678830036';

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  const handleWhatsAppOrder = async () => {
    try {
      const shippingAddress = {
        name: user?.name || 'Guest Customer',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        region: user?.address?.region || '',
        country: user?.address?.country || 'Cameroon'
      };

      const orderId = await createOrder(shippingAddress, isAuthenticated, token || undefined);
      
      let message = generateWhatsAppMessage();
      
      if (isAuthenticated) {
        message += `%0A%0AOrder ID: ${orderId}%0ACustomer: ${user?.name}%0AEmail: ${user?.email}`;
      }
      
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      onHide();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="cart-modal">
      <Modal.Header closeButton>
        <Modal.Title>{t('cart.title')}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {cartItems.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">{t('cart.empty')}</p>
          </div>
        ) : (
          <>
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.product._id} className="px-0">
                  <Row className="align-items-center g-2">
                    <Col xs={12} sm={3}>
                      <img 
                        src={item.product.images[0] || '/images/placeholder.jpg'} 
                        alt={item.product.nameEn}
                        className="img-fluid rounded w-100"
                        style={{ maxHeight: '80px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col xs={12} sm={4}>
                      <h6 className="mb-1 text-truncate">{item.product.nameEn}</h6>
                      <small className="text-muted">{formatPrice(item.product.price)} each</small>
                    </Col>
                    <Col xs={8} sm={3}>
                      <div className="d-flex align-items-center justify-content-center">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                        <Form.Control 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                          className="mx-2 text-center"
                          style={{ width: '50px', minWidth: '50px' }}
                          min="1"
                        />
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </div>
                    </Col>
                    <Col xs={4} sm={2} className="text-end">
                      <div className="mb-2">
                        <strong className="d-block">{formatPrice(item.product.price * item.quantity)}</strong>
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeFromCart(item.product._id)}
                        className="w-100 w-sm-auto"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            
            <div className="border-top pt-3 mt-3">
              <Row className="justify-content-between align-items-center">
                <Col xs={12} className="text-center text-sm-start">
                  <h4 className="mb-0">{t('cart.total')}: <span className="text-success">{formatPrice(getTotalPrice())}</span></h4>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer className="flex-column flex-sm-row gap-2">
        {cartItems.length > 0 && (
          <>
            <Button 
              variant="outline-secondary" 
              onClick={clearCart}
              className="w-100 w-sm-auto order-2 order-sm-1"
            >
              {t('cart.clear')}
            </Button>
            <Button 
              variant="success" 
              onClick={handleWhatsAppOrder}
              className="d-flex align-items-center justify-content-center w-100 w-sm-auto order-1 order-sm-2"
              size="lg"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="me-2" />
              {t('cart.orderWhatsApp')}
            </Button>
          </>
        )}
        <Button 
          variant="secondary" 
          onClick={onHide}
          className="w-100 w-sm-auto order-3"
        >
          {t('cart.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;