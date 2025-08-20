import React, { useState } from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faEye, faHeart } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import './ResponsiveProductCard.css';

interface ResponsiveProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ResponsiveProductCard: React.FC<ResponsiveProductCardProps> = ({ 
  product, 
  viewMode = 'grid' 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  

  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  const getProductName = (): string => {
    return product.nameFr || product.nameEn;
  };



  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="mb-3"
      >
        <Card className="product-card-list h-100">
          <Row className="g-0 h-100">
            <Col xs={12} sm={4} md={3}>
              <div className="product-image-container">
                <img
                  src={product.thumbnailImage || (product.images && product.images[0]) || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={getProductName()}
                  className="product-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                <Badge bg="primary" className="category-badge">
                  {product.category}
                </Badge>
              </div>
            </Col>
            <Col xs={12} sm={8} md={9}>
              <Card.Body className="d-flex flex-column h-100">
                <div className="flex-grow-1">
                  <Card.Title className="product-title">{getProductName()}</Card.Title>
                  <Card.Text className="product-price text-success fw-bold fs-4">
                    {formatPrice(product.price)}
                  </Card.Text>
                  {product.warrantyMonths && product.warrantyMonths > 0 && (
                    <Card.Text className="text-muted small">
                      🛡️ {product.warrantyMonths} month{product.warrantyMonths > 1 ? 's' : ''} warranty
                    </Card.Text>
                  )}
                </div>
                <div className="product-actions">
                  <Row className="g-2">
                    <Col xs={12} sm={8}>
                      <Button 
                        variant="primary" 
                        className="w-100 btn-add-to-cart"
                        onClick={() => addToCart(product)}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                        Add to Cart
                      </Button>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Link to={`/products/${product._id}`} className="btn btn-outline-primary w-100">
                        <FontAwesomeIcon icon={faEye} className="me-2" />
                        <span className="d-none d-sm-inline">View</span>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-100"
    >
      <Card className="product-card-grid h-100">
        <div className="product-image-container">
          <img
            src={product.thumbnailImage || (product.images && product.images[0]) || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={getProductName()}
            className="product-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          <div className="product-overlay">
            <Link to={`/products/${product._id}`} className="btn btn-light btn-sm me-2">
              <FontAwesomeIcon icon={faEye} />
            </Link>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => addToCart(product)}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
            </Button>
          </div>
          <Badge bg="primary" className="category-badge">
            {product.category}
          </Badge>
          <Button
            variant="outline-danger"
            size="sm"
            className="favorite-btn"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <FontAwesomeIcon 
              icon={faHeart} 
              className={isFavorite ? 'text-danger' : ''} 
            />
          </Button>
        </div>
        
        <Card.Body className="d-flex flex-column">
          <Card.Title className="product-title">{getProductName()}</Card.Title>
          <Card.Text className="product-price text-success fw-bold fs-5">
            {formatPrice(product.price)}
          </Card.Text>
          {product.warrantyMonths && product.warrantyMonths > 0 && (
            <Card.Text className="text-muted small mb-3">
              🛡️ {product.warrantyMonths} month{product.warrantyMonths > 1 ? 's' : ''} warranty
            </Card.Text>
          )}
          
          <div className="mt-auto">
            <Row className="g-2">
              <Col xs={12}>
                <Button 
                  variant="primary" 
                  className="w-100 btn-add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                  Add to Cart
                </Button>
              </Col>
              <Col xs={12}>
                <Link to={`/products/${product._id}`} className="btn btn-outline-primary w-100">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  View Details
                </Link>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ResponsiveProductCard;