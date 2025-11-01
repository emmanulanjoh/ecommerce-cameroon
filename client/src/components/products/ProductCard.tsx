import React from 'react';
import { getCategoryBackground } from './CategoryColors';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Product } from '../../types';


interface ProductCardProps {
  product: Product;
  language?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, language = 'en' }) => {
  const { addToCart } = useCart();
  const whatsappNumber = process.env.REACT_APP_BUSINESS_WHATSAPP_NUMBER || '237678830036';
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  // Get product name based on language with XSS protection
  const getProductName = (): string => {
    const name = language === 'fr' && product.nameFr ? product.nameFr : product.nameEn;
    return name ? name.replace(/[<>"'&]/g, '') : '';
  };

  // Get condition badge text with proper formatting
  const getConditionText = (): string => {
    const conditionMap = {
      'new': '✨ New',
      'refurbished': '🔄 Refurbished',
      'used': '📦 Used'
    };
    
    const baseText = conditionMap[product.condition as keyof typeof conditionMap] || conditionMap.used;
    const grade = product.conditionGrade && product.condition !== 'new' 
      ? ` (${product.conditionGrade.replace(/[<>"'&]/g, '')})` 
      : '';
    
    return baseText + grade;
  };

  return (
    <div className="product-card-wrapper">
      <Card className="product-card h-100 shadow-sm">
      <Link to={`/products/${product._id}`} className="text-decoration-none">
        <div className="card-img-wrapper">
          {product.videoUrl ? (
            <video 
              className="card-img-top" 
              muted 
              loop 
              preload="metadata"
              poster='https://picsum.photos/300/200?random=2'
              onMouseOver={(e) => {
                const video = e.target as HTMLVideoElement;
                if (video.readyState >= 3) { // HAVE_FUTURE_DATA or higher
                  video.play().catch(err => console.log('Video play error:', err));
                }
              }} 
              onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
              style={{ objectFit: 'cover', height: '200px' }}
            >
              <source src={product.videoUrl} type="video/mp4" />
              <img 
                src='https://picsum.photos/300/200?random=3' 
                className="card-img-top" 
                alt={getProductName()}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://picsum.photos/300/200?random=4';
                }}
              />
            </video>
          ) : (
            <img 
              src={product.thumbnailImage || (product.images && product.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgODBDMTU2LjYyNyA4MCAxNjIgODUuMzczIDE2MiA5MkMxNjIgOTguNjI3IDE1Ni42MjcgMTA0IDE1MCAxMDRDMTQzLjM3MyAxMDQgMTM4IDk4LjYyNyAxMzggOTJDMTM4IDg1LjM3MyAxNDMuMzczIDgwIDE1MCA4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwNSAxMjBMMTM1IDkwTDE2NSAxMjBIMTk1TDIyNSA5MEwyNTUgMTIwVjE0MEgxMDVWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'} 
              className="card-img-top" 
              alt={getProductName()}
              style={{ objectFit: 'cover', height: '200px' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://picsum.photos/300/200?random=5';
              }}
            />
          )}
          
          {/* Condition badge */}
          <span 
            className={`badge position-absolute top-0 start-0 m-2 ${
              product.condition === 'new' ? 'bg-success' :
              product.condition === 'refurbished' ? 'bg-warning text-dark' : 'bg-secondary'
            }`}
          >
            {getConditionText()}
          </span>
          
          {/* Category badge with gradient */}
          <span 
            className="badge category-badge"
            style={{
              background: getCategoryBackground(product.category),
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {product.category?.replace(/[<>"'&]/g, '') || 'Unknown'}
          </span>
        </div>
      </Link>
      
      <Card.Body className="pb-4">
        <Card.Title>
          <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
            {getProductName()}
          </Link>
        </Card.Title>
        
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div>
            <span className="h5 mb-0" style={{ color: '#333' }}>{formatPrice(product.price)}</span>
            {product.warrantyMonths && (
              <small className="text-muted d-block">
                🛡️ {(() => { 
                  const months = Math.max(0, parseInt(String(product.warrantyMonths || 0).replace(/[^0-9]/g, ''), 10)) || 0;
                  if (product.warrantyMonths && months === 0) console.warn('[ProductCard] Invalid warranty months:', product.warrantyMonths);
                  return months;
                })()} month{(() => { const months = Math.max(0, parseInt(String(product.warrantyMonths || 0).replace(/[^0-9]/g, ''), 10)) || 0; return months > 1 ? 's' : ''; })()} warranty
              </small>
            )}
          </div>
          <button 
            className="btn p-0 border-0"
            style={{
              background: 'transparent',
              color: '#333',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => {
              try {
                const sanitizedName = product.nameEn?.replace(/[\r\n\t]/g, ' ').substring(0, 100) || 'Unknown Product';
                console.log('[ProductCard] Adding to cart:', sanitizedName, 'ID:', product._id);
                addToCart(product);
                console.log('[ProductCard] Successfully added to cart:', sanitizedName);
              } catch (error) {
                console.error('[ProductCard] Failed to add to cart:', error);
              }
            }}
            disabled={!product.inStock}
          >
            <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '16px' }} />
          </button>
        </div>
        
        <div className="d-flex gap-2 align-items-center mb-3">
          <Link to={`/products/${product._id}`} className="btn btn-outline-primary btn-sm">
            <FontAwesomeIcon icon={faEye} className="me-1" /> View
          </Link>
          
          <a 
            href={`https://wa.me/${whatsappNumber}?text=I'm interested in ${encodeURIComponent(getProductName())}`} 
            className="btn btn-success d-flex align-items-center justify-content-center whatsapp-btn" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px' }} />
          </a>
        </div>
      </Card.Body>
    </Card>
    </div>
  );
};

export default ProductCard;