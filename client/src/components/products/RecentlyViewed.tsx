import React from 'react';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import SimpleProductCard from './SimpleProductCard';

const RecentlyViewed: React.FC = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <div style={{
      padding: '20px 16px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e9ecef'
    }}>
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#333',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        Recently Viewed
      </h3>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '12px',
        paddingBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {recentlyViewed.slice(0, 8).map((product) => (
          <div key={product._id} style={{
            minWidth: '140px',
            flexShrink: 0
          }}>
            <SimpleProductCard product={product} />
          </div>
        ))}
      </div>
      
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;