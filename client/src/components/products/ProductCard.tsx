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
import { motion } from 'framer-motion';

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

  // Get product name based on language
  const getProductName = (): string => {
    return language === 'fr' && product.nameFr ? product.nameFr : product.nameEn;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="product-card h-100 shadow-sm" style={{ transition: 'all 0.3s ease' }}>
      <Link to={`/products/${product._id}`} className="text-decoration-none">
        <div className="card-img-wrapper">
          {product.videoUrl ? (
            <video 
              className="card-img-top" 
              muted 
              loop 
              preload="metadata"
              poster='https://via.placeholder.com/300x200/cccccc/ffffff?text=Video+Thumbnail'
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
                src='https://via.placeholder.com/300x200/cccccc/ffffff?text=Video+Fallback' 
                className="card-img-top" 
                alt={getProductName()}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x200/cccccc/ffffff?text=No+Image';
                }}
              />
            </video>
          ) : (
            <img 
              src={product.thumbnailImage || (product.images && product.images[0]) || 'https://picsum.photos/300/200?random=1'} 
              className="card-img-top" 
              alt={getProductName()}
              style={{ objectFit: 'cover', height: '200px' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200/cccccc/ffffff?text=No+Image';
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
            {product.condition === 'new' ? '✨ New' :
             product.condition === 'refurbished' ? '🔄 Refurbished' : '📦 Used'}
            {product.conditionGrade && product.condition !== 'new' ? ` (${product.conditionGrade})` : ''}
          </span>
          
          {/* Category badge with gradient */}
          <span 
            className="badge category-badge"
            style={{
              background: getCategoryBackground(product.category),
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {product.category}
          </span>
        </div>
      </Link>
      
      <Card.Body className="pb-4">
        <Card.Title>
          <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
            {getProductName()}
          </Link>
        </Card.Title>
        
        <div className="mb-3">
          <span className="h5 mb-0 text-primary d-block">{formatPrice(product.price)}</span>
          {product.warrantyMonths && (
            <small className="text-muted d-block">
              🛡️ {product.warrantyMonths} month{product.warrantyMonths > 1 ? 's' : ''} warranty
            </small>
          )}
        </div>
        
        <div className="d-flex gap-2 align-items-center mb-3">
          <Link to={`/products/${product._id}`} className="btn btn-outline-primary btn-sm">
            <FontAwesomeIcon icon={faEye} className="me-1" /> View
          </Link>
          
          <button 
            className="btn btn-primary btn-sm flex-grow-1"
            onClick={() => {
              console.log('Adding to cart:', product.nameEn);
              addToCart(product);
            }}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-1" /> Add to Cart
          </button>
          
          <a 
            href={`https://wa.me/${whatsappNumber}?text=I'm interested in ${getProductName()}`} 
            className="btn btn-success d-flex align-items-center justify-content-center whatsapp-btn" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '18px' }} />
          </a>
        </div>
      </Card.Body>
    </Card>
    </motion.div>
  );
};

export default ProductCard;