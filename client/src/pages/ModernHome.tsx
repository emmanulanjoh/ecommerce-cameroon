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
        
        // Limit products per category to 6
        Object.keys(grouped).forEach(category => {
          grouped[category] = grouped[category].slice(0, 6);
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
      {/* Simple Hero Banner */}
      <div style={{
        backgroundColor: '#232F3E',
        color: 'white',
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <Container>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 400, marginBottom: '1rem' }}>
            FindAll Sourcing
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Quality Products for Cameroon
          </p>
          
          {/* Smart Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            <SmartSearch 
              onSearch={(query) => {
                if (query.trim()) {
                  navigate(`/products?search=${encodeURIComponent(query)}`);
                }
              }}
              placeholder="Search products..."
            />
          </div>
          
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <Button 
              style={{
                backgroundColor: '#FF9900',
                border: 'none',
                color: '#0F1111',
                padding: '12px 24px',
                fontSize: '1rem',
                borderRadius: '8px'
              }}
            >
              Browse All Products
            </Button>
          </Link>
        </Container>
      </div>

      {/* New Products Video Section */}
      <div style={{
        backgroundColor: '#F7F8F8',
        padding: '40px 0',
        borderTop: '1px solid #ddd',
        borderBottom: '1px solid #ddd'
      }}>
        <Container>
          <Row>
            <Col md={6}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 400,
                color: '#0F1111',
                marginBottom: '1rem'
              }}>
                New Arrivals
              </h2>
              <p style={{
                color: '#565959',
                fontSize: '1rem',
                marginBottom: '1.5rem'
              }}>
                Discover our latest collection of premium products
              </p>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <Button 
                  style={{
                    backgroundColor: '#FF9900',
                    border: 'none',
                    color: '#0F1111',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    borderRadius: '8px'
                  }}
                >
                  Shop New Arrivals
                </Button>
              </Link>
            </Col>
            <Col md={6}>
              <VideoSection />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Product Categories */}
      <div style={{ 
        padding: '40px 20px', 
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
          Object.entries(productsByCategory).map(([category, products], index) => {
            const isHorizontal = index % 3 === 1;
            
            return (
              <div key={category} style={{ 
                marginBottom: '20px',
                gridColumn: isHorizontal ? '1 / -1' : 'auto'
              }}>
                
                {/* Amazon-Style Product Box */}
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#0F1111',
                    marginBottom: '16px'
                  }}>
                    {category}
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isHorizontal 
                      ? 'repeat(auto-fit, minmax(150px, 1fr))' 
                      : 'repeat(2, 1fr)',
                    gap: '12px',
                    overflowX: isHorizontal ? 'auto' : 'visible'
                  }}>
                    {products.slice(0, isHorizontal ? 6 : 4).map((product) => (
                      <SimpleProductCard key={product._id} product={product} />
                    ))}
                  </div>
                  
                  <Link
                    to={`/products?category=${category}`}
                    style={{
                      display: 'inline-block',
                      marginTop: '16px',
                      color: '#007185',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    See more
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ModernHome;