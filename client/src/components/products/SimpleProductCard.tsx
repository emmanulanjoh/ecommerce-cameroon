import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface SimpleProductCardProps {
  product: Product;
  isLarge?: boolean;
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product, isLarge = false }) => {
  const getProductName = (): string => {
    return product.nameEn || product.nameFr || 'Product';
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link 
      to={`/products/${product._id}`} 
      className="text-decoration-none"
      style={{ color: 'inherit' }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.borderColor = '#ddd';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = '#f0f0f0';
      }}>
        {/* Image - Dominant */}
        <div style={{ 
          width: '100%', 
          aspectRatio: '1',
          overflow: 'hidden',
          backgroundColor: '#fafafa'
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
        
        {/* Minimal Text Info */}
        <div style={{ padding: '6px 8px' }}>
          {/* Product Name - Small */}
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#666',
            marginBottom: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {getProductName()}
          </div>
          
          {/* Price - Prominent */}
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#ff4757',
            lineHeight: 1
          }}>
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SimpleProductCard;