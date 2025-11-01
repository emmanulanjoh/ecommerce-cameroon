import React, { useState, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../features/auth';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import ProductQuickView from './ProductQuickView';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Visibility,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types';


interface ModernProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ 
  product,
  showQuickView = true
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addToCart } = useCart();
  const { user, isAuthenticated, token } = useUser();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  }, []);

  const getProductName = (): string => {
    return product.nameFr || product.nameEn;
  };



  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        sx={{
          height: { xs: 280, sm: 380 },
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {/* Image Container */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <Box 
            component={Link}
            to={`/products/${product._id}`}
            sx={{ 
              width: '100%', 
              height: { xs: 140, sm: 200 }, 
              overflow: 'hidden',
              display: 'block',
              cursor: 'pointer'
            }}
          >
            <img
              src={product.thumbnailImage || (product.images && product.images[0]) || '/images/placeholder.jpg'}
              alt={getProductName()}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.transform = 'scale(1)';
              }}
            />
          </Box>
          
          {/* Overlay Actions */}
          <Fade in={isHovered}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Zoom in={isHovered}>
                <IconButton
                  onClick={() => {
                    if (showQuickView) {
                      addToRecentlyViewed(product);
                      setQuickViewOpen(true);
                    } else {
                      window.location.href = `/products/${product._id}`;
                    }
                  }}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <Visibility />
                </IconButton>
              </Zoom>
              
              <Zoom in={isHovered} style={{ transitionDelay: '100ms' }}>
                <IconButton
                  onClick={() => addToCart(product)}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <ShoppingCart />
                </IconButton>
              </Zoom>
              

            </Box>
          </Fade>
          
          {/* Badges */}
          {product.warrantyMonths && (
            <Box sx={{ position: 'absolute', top: { xs: 6, sm: 12 }, left: { xs: 6, sm: 12 } }}>
              <Chip
                label={`${product.warrantyMonths}mo warranty`}
                size="small"
                sx={{
                  background: '#9c27b0',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  height: { xs: 20, sm: 24 },
                  '& .MuiChip-label': {
                    px: { xs: 1, sm: 1.5 }
                  }
                }}
              />
            </Box>
          )}
          {product.condition && (
            <Box sx={{ position: 'absolute', top: { xs: 6, sm: 12 }, right: { xs: 6, sm: 12 } }}>
              <Chip
                label={product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                size="small"
                sx={{
                  background: product.condition === 'new' ? '#4caf50' : product.condition === 'used' ? '#ff9800' : '#2196f3',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  height: { xs: 20, sm: 24 },
                  '& .MuiChip-label': {
                    px: { xs: 1, sm: 1.5 }
                  }
                }}
              />
            </Box>
          )}
          
          {/* Favorite Button */}
          <IconButton
            onClick={() => setIsFavorite(!isFavorite)}
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: 'white',
              boxShadow: 2,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            {isFavorite ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Box>
        
        {/* Content */}
        <CardContent sx={{ p: { xs: 1.5, sm: 3 }, pb: { xs: 1.5, sm: 3 } }}>
          <Typography
            variant="body2"
            fontWeight="600"
            sx={{
              mb: { xs: 0.5, sm: 1 },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              lineHeight: { xs: 1.2, sm: 1.4 }
            }}
          >
            {getProductName()}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 1, sm: 1 } }}>
            <Typography
              variant="h6"
              color="#333"
              fontWeight="700"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1.25rem' }
              }}
            >
              {formatPrice(product.price)}
            </Typography>
            <IconButton
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              sx={{
                bgcolor: 'transparent',
                color: '#333',
                width: { xs: 24, sm: 32 },
                height: { xs: 24, sm: 32 },
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                '&:disabled': { color: '#ccc' }
              }}
            >
              <ShoppingCart sx={{ fontSize: { xs: 14, sm: 18 } }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      
      {showQuickView && (
        <ProductQuickView
          product={product}
          open={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default ModernProductCard;