import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  nameEn: string;
  price: number;
  images: string[];
  category: string;
  averageRating?: number;
}

interface ProductRecommendationsProps {
  productId: string;
  title?: string;
  type?: 'related' | 'viewedTogether' | 'boughtTogether';
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ 
  productId, 
  title = "Customers who viewed this item also viewed",
  type = 'viewedTogether'
}) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/recommendations/product/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data[type] || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
    }).format(price);
  };

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          fontWeight: 400,
          color: '#0F1111',
          borderBottom: '1px solid #ddd',
          pb: 1
        }}
      >
        {title}
      </Typography>
      
      <Grid container spacing={2}>
        {recommendations.slice(0, 6).map((product) => (
          <Grid item xs={6} sm={4} md={2} key={product._id}>
            <Card 
              component={Link}
              to={`/products/${product._id}`}
              sx={{ 
                textDecoration: 'none',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ddd',
                borderRadius: '8px',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <CardMedia
                component="img"
                height="120"
                image={product.images?.[0] || '/images/placeholder.jpg'}
                alt={product.nameEn}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ p: 1, flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.8rem',
                    color: '#0F1111',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {product.nameEn}
                </Typography>
                
                {product.averageRating && (
                  <Rating 
                    value={product.averageRating} 
                    readOnly 
                    size="small" 
                    sx={{ mb: 0.5 }}
                  />
                )}
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#B12704',
                    fontSize: '0.9rem'
                  }}
                >
                  {formatPrice(product.price)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductRecommendations;