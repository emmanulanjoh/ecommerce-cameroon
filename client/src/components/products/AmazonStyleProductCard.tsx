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
            style={{ height: '280px', position: 'relative' }}
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
                maxHeight: '260px',
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


      </div>

      <Card.Body className="p-2">
        <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
          <h6 
            className="card-title mb-1" 
            style={{ 
              fontSize: '0.8rem', 
              lineHeight: '1.2',
              height: '2.4rem',
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

        {/* Price */}
        <div className="mb-2">
          <span className="h6 text-danger fw-bold mb-0" style={{ fontSize: '0.9rem' }}>
            {formatPrice(product.price)}
          </span>
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
            color: '#000',
            fontSize: '0.75rem',
            padding: '6px 8px'
          }}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-1" style={{ fontSize: '0.7rem' }} />
          Add to Cart
        </Button>
      </Card.Body>


    </Card>
  );
};

export default AmazonStyleProductCard;