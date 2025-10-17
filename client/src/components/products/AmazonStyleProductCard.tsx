import React, { useState } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface AmazonStyleProductCardProps {
  product: Product;
}

const AmazonStyleProductCard: React.FC<AmazonStyleProductCardProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const renderStars = (rating: number = 4.2) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-warning" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-muted" />);
    }

    return stars;
  };

  return (
    <Card 
      className="h-100 border-0 shadow-sm product-card-amazon" 
      style={{ 
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
      }}
    >
      <div className="position-relative overflow-hidden">
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          <div 
            className="d-flex align-items-center justify-content-center bg-light"
            style={{ height: '200px', position: 'relative' }}
          >
            {!imageLoaded && (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            <img
              src={product.thumbnailImage || product.images?.[0] || '/images/placeholder.jpg'}
              alt={getProductName()}
              className="img-fluid"
              style={{
                maxHeight: '180px',
                maxWidth: '100%',
                objectFit: 'contain',
                display: imageLoaded ? 'block' : 'none'
              }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
                setImageLoaded(true);
              }}
            />
          </div>
        </Link>

        {/* Badges */}
        {product.condition && (
          <Badge 
            bg={product.condition === 'new' ? 'success' : 'warning'} 
            className="position-absolute top-0 start-0 m-2"
            style={{ fontSize: '0.7rem' }}
          >
            {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
          </Badge>
        )}

        {product.warrantyMonths && (
          <Badge 
            bg="info" 
            className="position-absolute top-0 end-0 m-2"
            style={{ fontSize: '0.7rem' }}
          >
            {product.warrantyMonths}mo warranty
          </Badge>
        )}
      </div>

      <Card.Body className="p-3">
        <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
          <h6 
            className="card-title mb-2 text-truncate-2" 
            style={{ 
              fontSize: '0.9rem', 
              lineHeight: '1.3',
              height: '2.6rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
            title={getProductName()}
          >
            {getProductName()}
          </h6>
        </Link>

        {/* Rating */}
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">
            {renderStars()}
          </div>
          <small className="text-muted">(127)</small>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="h5 text-danger fw-bold mb-0">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Stock Status */}
        <div className="mb-2">
          {product.inStock ? (
            <small className="text-success fw-semibold">✓ In Stock</small>
          ) : (
            <small className="text-danger">Out of Stock</small>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="warning"
          size="sm"
          className="w-100 fw-semibold"
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          style={{ 
            backgroundColor: '#ff9900', 
            borderColor: '#ff9900',
            color: '#000'
          }}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          Add to Cart
        </Button>
      </Card.Body>


    </Card>
  );
};

export default AmazonStyleProductCard;