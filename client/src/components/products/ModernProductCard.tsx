import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Rating,
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

  const handleWhatsAppClick = () => {
    const message = `I'm interested in ${getProductName()} - ${formatPrice(product.price)}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
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
            height: 200,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <Box sx={{ width: 200, height: 200, overflow: 'hidden' }}>
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
            <CardContent sx={{ flex: 1, p: 3, pb: 4 }}>
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
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => addToCart(product)}
                  sx={{ borderRadius: 2, flex: 1, py: 1.5, px: 3 }}
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
                    px: 3
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
          height: 480,
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
          <Box sx={{ width: '100%', height: 240, overflow: 'hidden' }}>
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
        <CardContent sx={{ p: 3, pb: 5 }}>
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={4.5} precision={0.5} size="small" readOnly />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              (4.5)
            </Typography>
          </Box>
          
          <Typography
            variant="h5"
            color="primary.main"
            fontWeight="700"
            sx={{ mb: 1 }}
          >
            {formatPrice(product.price)}
          </Typography>
          
          {product.warrantyMonths && product.warrantyMonths > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              🛡️ {product.warrantyMonths} month{product.warrantyMonths > 1 ? 's' : ''} warranty
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => addToCart(product)}
              sx={{ borderRadius: 2, flex: 1, py: 1.5, px: 3 }}
            >
              <ShoppingCart sx={{ mr: 1 }} /> Add to Cart
            </Button>
            
            <Button
              variant="contained"
              onClick={handleWhatsAppClick}
              sx={{
                bgcolor: '#25D366',
                '&:hover': { bgcolor: '#20B858' },
                borderRadius: 2,
                minWidth: 48,
                py: 1.5,
                px: 3
              }}
            >
              <WhatsApp />
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModernProductCard;