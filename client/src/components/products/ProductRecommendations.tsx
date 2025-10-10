import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Card, CardContent, Grid, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  _id: string;
  nameEn: string;
  price: number;
  images: string[];
  thumbnailImage?: string;
  category: string;
}

interface ProductRecommendationsProps {
  productId: string;
  limit?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ 
  productId, 
  limit = 4 
}) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${productId}/recommendations?limit=${limit}`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [productId, limit]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          You might also like
        </Typography>
        <Grid container spacing={2}>
          {[...Array(limit)].map((_, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="600">
        You might also like
      </Typography>
      
      <Grid container spacing={2}>
        {recommendations.map((product) => (
          <Grid item xs={6} md={3} key={product._id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(`/products/${product._id}`)}
            >
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${product.thumbnailImage || product.images?.[0] || '/images/placeholder.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#f5f5f5'
                }}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography 
                  variant="body2" 
                  fontWeight="600"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 1
                  }}
                >
                  {product.nameEn}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="primary.main" 
                  fontWeight="700"
                  sx={{ fontSize: '1rem' }}
                >
                  {formatPrice(product.price)}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {product.category}
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