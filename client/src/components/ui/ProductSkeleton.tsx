import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '6px',
      overflow: 'hidden',
      border: '1px solid #f0f0f0',
      animation: 'pulse 1.5s ease-in-out infinite'
    }}>
      {/* Image skeleton */}
      <div style={{
        width: '100%',
        aspectRatio: '1',
        backgroundColor: '#f0f0f0'
      }} />
      
      {/* Text skeleton */}
      <div style={{ padding: '6px 8px' }}>
        <div style={{
          height: '12px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          marginBottom: '4px'
        }} />
        <div style={{
          height: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          width: '60%'
        }} />
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default ProductSkeleton;