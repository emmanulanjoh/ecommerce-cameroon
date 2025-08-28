import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../features/auth';
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
  WhatsApp,
  Visibility,
  Favorite,
  FavoriteBorder,

  ShoppingCart,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { getCategoryBackground } from './CategoryColors';

interface ModernProductCardProps {
  product: Product;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ 
  product
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { user, isAuthenticated, token } = useUser();
  
  const whatsappNumber = process.env.REACT_APP_BUSINESS_WHATSAPP_NUMBER || '237678830036';
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  const getProductName = (): string => {
    return product.nameFr || product.nameEn;
  };

  const handleWhatsAppClick = async () => {
    if (!isAuthenticated) {
      alert('Please login to order via WhatsApp');
      window.location.href = '/login';
      return;
    }

    try {
      // Create order for logged-in users
      const shippingAddress = {
        name: user?.name || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        region: user?.address?.region || '',
        country: user?.address?.country || 'Cameroon'
      };

      const orderData = {
        items: [{
          product: product._id,
          name: product.nameEn,
          price: product.price,
          quantity: 1,
          image: product.images?.[0]
        }],
        shippingAddress,
        notes: 'Single product order via WhatsApp'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const order = await response.json();
      const orderId = order._id;

      const message = `I'm interested in ${getProductName()} - ${formatPrice(product.price)}%0A%0AOrder ID: ${orderId}%0ACustomer: ${user?.name}%0AEmail: ${user?.email}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
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
          borderRadius: { xs: 2, sm: 3 },
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
                  component={Link}
                  to={`/products/${product._id}`}
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
              
              <Zoom in={isHovered} style={{ transitionDelay: '200ms' }}>
                <IconButton
                  onClick={handleWhatsAppClick}
                  sx={{
                    bgcolor: '#25D366',
                    color: 'white',
                    '&:hover': { bgcolor: '#20B858' },
                  }}
                >
                  <WhatsApp />
                </IconButton>
              </Zoom>
            </Box>
          </Fade>
          
          {/* Badges */}
          <Box sx={{ position: 'absolute', top: { xs: 6, sm: 12 }, left: { xs: 6, sm: 12 } }}>
            <Chip
              label={product.category}
              size="small"
              sx={{
                background: getCategoryBackground(product.category),
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
          
          <Typography
            variant="h6"
            color="primary.main"
            fontWeight="700"
            sx={{ 
              mb: { xs: 1, sm: 1 },
              fontSize: { xs: '0.9rem', sm: '1.25rem' }
            }}
          >
            {formatPrice(product.price)}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
            <Button
              variant="contained"
              onClick={() => addToCart(product)}
              sx={{ 
                borderRadius: { xs: 1.5, sm: 2 }, 
                flex: 1,
                py: { xs: 0.5, sm: 1.5 }, 
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.65rem', sm: '0.8rem' },
                minHeight: { xs: 32, sm: 40 }
              }}
            >
              <ShoppingCart sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 12, sm: 16 } }} /> 
              {/* Hide text on very small screens */}
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Add</Box>
            </Button>
            
            <IconButton
              onClick={handleWhatsAppClick}
              sx={{
                color: '#25D366',
                '&:hover': { 
                  color: '#20B858',
                  backgroundColor: 'rgba(37, 211, 102, 0.1)'
                },
                borderRadius: { xs: 1.5, sm: 2 },
                p: { xs: 0.5, sm: 1.5 },
                minWidth: { xs: 32, sm: 48 },
                width: { xs: 32, sm: 48 },
                height: { xs: 32, sm: 48 }
              }}
            >
              <WhatsApp sx={{ fontSize: { xs: 16, sm: 24 } }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModernProductCard;