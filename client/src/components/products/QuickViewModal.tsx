import React from 'react';
import { Product } from '../../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            zIndex: 1001
          }}
        >
          ×
        </button>
        
        <img
          src={product.images?.[0] || '/images/placeholder.svg'}
          alt={product.nameEn}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover'
          }}
        />
        
        <div style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
            {product.nameEn || product.nameFr}
          </h3>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#ff4757',
            margin: '0 0 15px 0'
          }}>
            {formatPrice(product.price)}
          </p>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#666',
            lineHeight: 1.4,
            margin: 0
          }}>
            {product.descriptionEn || product.descriptionFr || 'No description available'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;