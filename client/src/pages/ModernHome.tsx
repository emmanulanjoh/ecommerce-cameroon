import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types';
import SimpleProductCard from '../components/products/SimpleProductCard';
import VideoSection from '../components/VideoSection';
import SmartSearch from '../components/search/SmartSearch';

const ModernHome: React.FC = () => {
  const [productsByCategory, setProductsByCategory] = useState<{[key: string]: Product[]}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Color palette for category boxes - soft and subtle
  const getCategoryColor = (category: string) => {
    const colors = {
      'Electronics': 'linear-gradient(135deg, #e8f0fe 0%, #f3e8ff 100%)',
      'Fashion': 'linear-gradient(135deg, #fef7ff 0%, #fff0f3 100%)',
      'Home & Garden': 'linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%)',
      'Sports': 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      'Beauty': 'linear-gradient(135deg, #fef7ff 0%, #fffbeb 100%)',
      'Books': 'linear-gradient(135deg, #f0fdfa 0%, #fef7ff 100%)',
      'Toys': 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      'Automotive': 'linear-gradient(135deg, #faf5ff 0%, #fffbeb 100%)',
      'Health': 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)',
      'Food': 'linear-gradient(135deg, #fffbeb 0%, #f0fdfa 100%)'
    };
    
    if (colors[category as keyof typeof colors]) {
      return colors[category as keyof typeof colors];
    }
    
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const gradients = [
      'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      'linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%)',
      'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
    ];
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  // Fisher-Yates shuffle for randomizing arrays
  const shuffleArray = (array: Product[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/products');
        const allProducts = response.data.products || response.data || [];
        
        // Group products by category
        const grouped: {[key: string]: Product[]} = {};
        allProducts.forEach((product: Product) => {
          if (product.category && product.category.trim()) {
            const category = product.category.trim();
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(product);
          }
        });
        
        // Randomize and limit products per category to 4
        Object.keys(grouped).forEach(category => {
          grouped[category] = shuffleArray(grouped[category]).slice(0, 4);
        });
        
        setProductsByCategory(grouped);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);





  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>


      {/* Video Section */}
      <div style={{ padding: '20px' }}>
        <Container>
          <VideoSection />
        </Container>
      </div>

      {/* Product Categories */}
      <div style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          Object.entries(productsByCategory).map(([category, products]) => (
            <div key={category} style={{ marginBottom: '20px' }}>
              <div style={{
                background: getCategoryColor(category),
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '16px'
                }}>
                  {category}
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px'
                }}>
                  {products.slice(0, 4).map((product) => (
                    <SimpleProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                <Link
                  to={`/products?category=${category}`}
                  style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    color: '#4f46e5',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid rgba(79, 70, 229, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
                  }}
                >
                  See more
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModernHome;