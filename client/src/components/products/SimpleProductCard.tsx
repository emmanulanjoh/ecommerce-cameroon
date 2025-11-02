import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from '@mui/icons-material';

interface SimpleProductCardProps {
  product: Product;
  isLarge?: boolean;
  heightType?: 'normal' | 'tall' | 'short';
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product, isLarge = false, heightType = 'normal' }) => {
  const { addToCart } = useCart();
  
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
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = '#f0f0f0';
      }}>
        {/* Image - Dominant */}
        <div style={{ 
          width: '100%', 
          aspectRatio: heightType === 'tall' ? '1/1.3' : heightType === 'short' ? '1/0.8' : '1',
          overflow: 'hidden',
          backgroundColor: '#fafafa',
          position: 'relative'
        }}>
          <img
            src={product.images?.[0] || product.thumbnailImage || '/images/placeholder.svg'}
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
          
          {/* Price and Add to Cart */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#333',
              lineHeight: 1
            }}>
              {formatPrice(product.price)}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              disabled={!product.inStock}
              style={{
                background: 'transparent',
                color: '#333',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: product.inStock ? 1 : 0.5
              }}
            >
              <ShoppingCart style={{ fontSize: '12px' }} />
            </button>
          </div>
        </div>
      </div>
    </Link>

    </>
  );
};

export default SimpleProductCard;