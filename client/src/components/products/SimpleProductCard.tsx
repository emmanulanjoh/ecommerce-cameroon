import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface SimpleProductCardProps {
  product: Product;
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product }) => {
  const getProductName = (): string => {
    return product.nameEn || product.nameFr || 'Product';
  };

  return (
    <Link 
      to={`/products/${product._id}`} 
      className="text-decoration-none"
      style={{ color: 'inherit' }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}>
        {/* Image */}
        <div style={{ 
          width: '100%', 
          aspectRatio: '1',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa'
        }}>
          <img
            src={product.thumbnailImage || (product.images && product.images[0]) || '/images/placeholder.svg'}
            alt={getProductName()}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.svg';
            }}
          />
        </div>
        
        {/* Product Name */}
        <div style={{ padding: '12px 8px' }}>
          <h6 style={{
            margin: 0,
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.3,
            color: '#333',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {getProductName()}
          </h6>
        </div>
      </div>
    </Link>
  );
};

export default SimpleProductCard;