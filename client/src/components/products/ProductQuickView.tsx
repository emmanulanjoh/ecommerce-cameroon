import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Rating,
  Chip,
  Divider,
} from '@mui/material';
import { Close, ShoppingCart, WhatsApp, Visibility } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

import { Product } from '../../types';
import { Link } from 'react-router-dom';

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, open, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();


  if (!product) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  const handleWhatsApp = () => {
    const message = `I'm interested in ${product.nameEn} - ${formatPrice(product.price)}`;
    window.open(`https://wa.me/237678830036?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: { xs: 'auto', md: 500 }, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Image Section */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            <IconButton
              onClick={onClose}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'white' }}
            >
              <Close />
            </IconButton>
            
            <Box sx={{ height: { xs: 300, md: '100%' }, position: 'relative' }}>
              <img
                src={product.images?.[selectedImage] || '/images/placeholder.jpg'}
                alt={product.nameEn}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            
            {product.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, p: 2, overflowX: 'auto' }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: 60,
                      height: 60,
                      border: selectedImage === index ? '2px solid primary.main' : '1px solid #ddd',
                      borderRadius: 1,
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                  >
                    <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Details Section */}
          <Box sx={{ flex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {product.condition && (
                <Chip
                  label={product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                  size="small"
                  color={product.condition === 'new' ? 'success' : 'warning'}
                />
              )}
              {product.warrantyMonths && (
                <Chip label={`${product.warrantyMonths}mo warranty`} size="small" color="secondary" />
              )}
            </Box>

            <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
              {product.nameEn}
            </Typography>

            <Typography variant="h4" color="primary.main" fontWeight="700" sx={{ mb: 2 }}>
              {formatPrice(product.price)}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={product.averageRating || 0} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({product.reviewCount || 0} reviews)
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              {product.descriptionEn}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={() => addToCart(product)}
                sx={{ flex: 1 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                startIcon={<WhatsApp />}
                onClick={handleWhatsApp}
                sx={{ color: '#25D366', borderColor: '#25D366' }}
              >
                WhatsApp
              </Button>
            </Box>

            <Button
              component={Link}
              to={`/products/${product._id}`}
              variant="text"
              startIcon={<Visibility />}
              fullWidth
              onClick={onClose}
            >
              View Full Details
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;