import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import QuickViewModal from './QuickViewModal';
import ImageCarousel from './ImageCarousel';

interface SimpleProductCardProps {
  product: Product;
  isLarge?: boolean;
  heightType?: 'normal' | 'tall' | 'short';
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product, isLarge = false, heightType = 'normal' }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  
  const getProductName = (): string => {
    return product.nameEn || product.nameFr || 'Product';
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
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
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.borderColor = '#ddd';
        const quickViewBtn = e.currentTarget.querySelector('button');
        if (quickViewBtn) quickViewBtn.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = '#f0f0f0';
        const quickViewBtn = e.currentTarget.querySelector('button');
        if (quickViewBtn) quickViewBtn.style.opacity = '0';
      }}>
        {/* Image - Dominant */}
        <div style={{ 
          width: '100%', 
          aspectRatio: heightType === 'tall' ? '1/1.3' : heightType === 'short' ? '1/0.8' : '1',
          overflow: 'hidden',
          backgroundColor: '#fafafa',
          position: 'relative'
        }}>
          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              opacity: 0,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          >
            Quick View
          </button>
          <ImageCarousel 
            images={product.images || [product.thumbnailImage].filter(Boolean) || ['/images/placeholder.svg']}
            productName={getProductName()}
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
    <QuickViewModal 
      product={product}
      isOpen={showQuickView}
      onClose={() => setShowQuickView(false)}
    />
    </>
  );
};

export default SimpleProductCard;