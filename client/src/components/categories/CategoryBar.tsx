import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryBarProps {
  categories: string[];
  selectedCategory?: string;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ categories, selectedCategory }) => {
  const allCategories = ['All', ...categories];

  return (
    <div style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #f0f0f0',
      padding: '8px 0',
      position: 'sticky',
      top: '48px',
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '12px',
        padding: '0 16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category || (!selectedCategory && category === 'All');
          const linkTo = category === 'All' ? '/products' : `/products?category=${category}`;
          
          return (
            <Link
              key={category}
              to={linkTo}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0
              }}
            >
              <div style={{
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                backgroundColor: isSelected ? '#FF9900' : '#f8f9fa',
                color: isSelected ? 'white' : '#666',
                border: `1px solid ${isSelected ? '#FF9900' : '#e9ecef'}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                  e.currentTarget.style.borderColor = '#ddd';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#e9ecef';
                }
              }}>
                {category}
              </div>
            </Link>
          );
        })}
      </div>
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryBar;