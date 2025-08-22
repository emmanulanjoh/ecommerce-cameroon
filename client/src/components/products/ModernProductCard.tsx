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
  viewMode?: 'grid' | 'list';
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ 
  product, 
  viewMode = 'grid' 
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
    try {
      if (isAuthenticated) {
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
      } else {
        // Guest user - simple message
        const message = `I'm interested in ${getProductName()} - ${formatPrice(product.price)}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // Fallback to simple message
      const message = `I'm interested in ${getProductName()} - ${formatPrice(product.price)}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            height: { xs: 'auto', sm: 200 },
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <Box 
            component={Link}
            to={`/products/${product._id}`}
            sx={{ 
              width: { xs: '100%', sm: 200 }, 
              height: { xs: 200, sm: 200 }, 
              overflow: 'hidden',
              display: 'block',
              cursor: 'pointer'
            }}
          >
            <img
              src={product.thumbnailImage || (product.images && product.images[0]) || 'https://via.placeholder.com/200x200?text=No+Image'}
              alt={getProductName()}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <CardContent sx={{ flex: 1, p: { xs: 2, sm: 3 }, pb: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    background: getCategoryBackground(product.category),
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>
              
              <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                {getProductName()}
              </Typography>
              
              <Typography variant="h5" color="primary.main" fontWeight="700" sx={{ mb: 1 }}>
                {formatPrice(product.price)}
              </Typography>
              
              {product.warrantyMonths && product.warrantyMonths > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  🛡️ {product.warrantyMonths} month{product.warrantyMonths > 1 ? 's' : ''} warranty
                </Typography>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1, 
                alignItems: 'stretch',
                mb: 2 
              }}>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => addToCart(product)}
                  sx={{ 
                    borderRadius: 2, 
                    flex: 1, 
                    py: 1.5, 
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Add to Cart
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<WhatsApp />}
                  onClick={handleWhatsAppClick}
                  sx={{
                    bgcolor: '#25D366',
                    '&:hover': { bgcolor: '#20B858' },
                    borderRadius: 2,
                    py: 1.5,
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    minWidth: { xs: 'auto', sm: 'auto' }
                  }}
                >
                  WhatsApp
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        sx={{
          height: { xs: 320, sm: 380 },
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
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
              height: { xs: 160, sm: 200 }, 
              overflow: 'hidden',
              display: 'block',
              cursor: 'pointer'
            }}
          >
            <img
              src={product.thumbnailImage || (product.images && product.images[0]) || 'https://via.placeholder.com/280x240?text=No+Image'}
              alt={getProductName()}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/280x240?text=No+Image';
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
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            <Chip
              label={product.category}
              size="small"
              sx={{
                background: getCategoryBackground(product.category),
                color: 'white',
                fontWeight: 600,
                boxShadow: 2,
              }}
            />
          </Box>
          
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            {/* Condition badge */}
            <Chip
              label={
                product.condition === 'new' ? '✨ New' :
                product.condition === 'refurbished' ? '🔄 Refurbished' : 
                product.condition === 'used' ? '📦 Used' : '✨ New'
              }
              size="small"
              sx={{
                backgroundColor: 
                  product.condition === 'new' ? '#4caf50' :
                  product.condition === 'refurbished' ? '#ff9800' : 
                  product.condition === 'used' ? '#757575' : '#4caf50',
                color: 'white',
                fontWeight: 600,
                boxShadow: 2,
                mb: 1
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
        <CardContent sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {getProductName()}
          </Typography>
          

          
          <Typography
            variant="h5"
            color="primary.main"
            fontWeight="700"
            sx={{ mb: 1 }}
          >
            {formatPrice(product.price)}
          </Typography>
          

          
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Button
              variant="contained"
              onClick={() => addToCart(product)}
              sx={{ 
                borderRadius: 2, 
                flex: 1,
                py: { xs: 1, sm: 1.5 }, 
                fontSize: { xs: '0.7rem', sm: '0.8rem' }
              }}
            >
              <ShoppingCart sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 14, sm: 16 } }} /> 
              Add
            </Button>
            
            <IconButton
              onClick={handleWhatsAppClick}
              sx={{
                color: '#25D366',
                '&:hover': { 
                  color: '#20B858',
                  backgroundColor: 'rgba(37, 211, 102, 0.1)'
                },
                borderRadius: 2,
                p: { xs: 1, sm: 1.5 },
                minWidth: { xs: 40, sm: 48 }
              }}
            >
              <WhatsApp sx={{ fontSize: { xs: 22, sm: 26 } }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModernProductCard;