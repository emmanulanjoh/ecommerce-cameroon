import React from 'react';
import { Modal, Button, ListGroup, Row, Col, Form } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useCart } from '../../context/CartContext';

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
    generateWhatsAppMessage 
  } = useCart();
  const { t } = useLanguage();

  const whatsappNumber = '+237678830036';

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
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
                  <Row className="align-items-center">
                    <Col xs={3}>
                      <img 
                        src={item.product.images[0] || '/images/placeholder.jpg'} 
                        alt={item.product.nameEn}
                        className="img-fluid rounded"
                        style={{ maxHeight: '60px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col xs={4}>
                      <h6 className="mb-1">{item.product.nameEn}</h6>
                      <small className="text-muted">{formatPrice(item.product.price)} each</small>
                    </Col>
                    <Col xs={3}>
                      <div className="d-flex align-items-center">
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
                          style={{ width: '60px' }}
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
                    <Col xs={2} className="text-end">
                      <div>
                        <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeFromCart(item.product._id)}
                        className="mt-1"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            
            <div className="border-top pt-3 mt-3">
              <Row>
                <Col>
                  <h5>{t('cart.total')}: {formatPrice(getTotalPrice())}</h5>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        {cartItems.length > 0 && (
          <>
            <Button variant="outline-secondary" onClick={clearCart}>
              {t('cart.clear')}
            </Button>
            <Button 
              variant="success" 
              onClick={handleWhatsAppOrder}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="me-2" />
              {t('cart.orderWhatsApp')}
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>
          {t('cart.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;