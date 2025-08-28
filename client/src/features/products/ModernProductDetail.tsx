import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Card,
  CardContent,
  Grid,
  Fab,
  Avatar,
  useMediaQuery,
  useTheme,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  ShoppingCart,
  WhatsApp,
  Favorite,
  FavoriteBorder,
  Share,
  ExpandMore,
  ExpandLess,
  Verified,
  LocalShipping,
  Security,
  Assignment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useUser } from '../auth';
import axios from 'axios';
import { Product, Review } from '../../types';

const ModernProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const { } = useUser();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        
        // Fetch related products
        const relatedRes = await axios.get(`/api/products?category=${data.category}&limit=4`);
        setRelatedProducts(relatedRes.data.products?.filter((p: Product) => p._id !== data._id) || []);
        
        // Fetch reviews
        const reviewsRes = await axios.get(`/api/reviews/product/${id}`);
        setReviews(reviewsRes.data || []);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  const handleWhatsAppOrder = () => {
    const whatsappNumber = process.env.REACT_APP_BUSINESS_WHATSAPP_NUMBER || '237678830036';
    const message = `Hi! I'm interested in ${product?.nameEn} - ${formatPrice(product?.price || 0)}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.nameEn,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={60} />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        bgcolor: 'background.paper', 
        zIndex: 10,
        borderBottom: 1,
        borderColor: 'divider',
        px: 2,
        py: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ 
            flex: 1, 
            mx: 2, 
            textAlign: 'center',
            fontSize: { xs: '1rem', md: '1.25rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.nameEn}
          </Typography>
          <IconButton onClick={handleShare} size="small">
            <Share />
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 1, md: 2 }, pb: 10 }}>
        {/* Image Gallery */}
        <Card sx={{ mb: 2, overflow: 'hidden' }}>
          <Box sx={{ position: 'relative' }}>
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images?.[selectedImage] || '/placeholder.jpg'}
              alt={product.nameEn}
              style={{
                width: '100%',
                height: isMobile ? '300px' : '400px',
                objectFit: 'contain',
                backgroundColor: '#f5f5f5'
              }}
            />
            
            {/* Favorite Button */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'background.paper',
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.paper' }
              }}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>

            {/* Stock Badge */}
            <Chip
              label={product.inStock ? 'In Stock' : 'Out of Stock'}
              color={product.inStock ? 'success' : 'error'}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontWeight: 600
              }}
            />
          </Box>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              p: 2, 
              overflowX: 'auto',
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 }
            }}>
              {product.images.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    minWidth: 60,
                    height: 60,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === index ? 2 : 1,
                    borderColor: selectedImage === index ? 'primary.main' : 'divider',
                    transition: 'all 0.2s'
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.nameEn} ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Card>

        {/* Product Info */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h5" fontWeight="700" sx={{ 
              mb: 1,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}>
              {product.nameEn}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={averageRating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({reviews.length} reviews)
              </Typography>
            </Box>

            {/* Price */}
            <Typography variant="h4" color="primary.main" fontWeight="700" sx={{ 
              mb: 2,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}>
              {formatPrice(product.price)}
            </Typography>

            {/* Category */}
            <Chip 
              label={product.category} 
              variant="outlined" 
              size="small" 
              sx={{ mb: 2 }}
            />

            {/* Description */}
            <Box>
              <Typography variant="body1" sx={{ 
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: showFullDescription ? 'none' : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {product.descriptionEn || 'No description available.'}
              </Typography>
              
              {product.descriptionEn && product.descriptionEn.length > 150 && (
                <Button
                  size="small"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  endIcon={showFullDescription ? <ExpandLess /> : <ExpandMore />}
                >
                  {showFullDescription ? 'Show Less' : 'Show More'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Features */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
              Product Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping color="primary" fontSize="small" />
                  <Typography variant="body2">Free Delivery</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security color="primary" fontSize="small" />
                  <Typography variant="body2">Secure Payment</Typography>
                </Box>
              </Grid>
              {product.warrantyMonths && (
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Verified color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {product.warrantyMonths} Month Warranty
                    </Typography>
                  </Box>
                </Grid>
              )}
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment color="primary" fontSize="small" />
                  <Typography variant="body2">Quality Assured</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Reviews Preview */}
        {reviews.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Customer Reviews
              </Typography>
              {reviews.slice(0, 2).map((review) => (
                <Box key={review._id} sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                      {review.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {review.username || 'Anonymous'}
                      </Typography>
                      <Rating value={review.rating} size="small" readOnly />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {review.comment}
                  </Typography>
                </Box>
              ))}
              {reviews.length > 2 && (
                <Button size="small" variant="outlined">
                  View All Reviews ({reviews.length})
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Related Products
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 }
              }}>
                {relatedProducts.map((relatedProduct) => (
                  <Card 
                    key={relatedProduct._id}
                    sx={{ 
                      minWidth: 150, 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 4 }
                    }}
                    onClick={() => navigate(`/products/${relatedProduct._id}`)}
                  >
                    <img
                      src={relatedProduct.images?.[0] || '/placeholder.jpg'}
                      alt={relatedProduct.nameEn}
                      style={{ width: '100%', height: 120, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {relatedProduct.nameEn}
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight="700">
                        {formatPrice(relatedProduct.price)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Floating Action Buttons */}
      <Box sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        display: 'flex',
        gap: 2,
        zIndex: 10
      }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<ShoppingCart />}
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Add to Cart
        </Button>
        
        <Fab
          color="success"
          onClick={handleWhatsAppOrder}
          sx={{
            bgcolor: '#25D366',
            '&:hover': { bgcolor: '#20B858' },
            minWidth: 56
          }}
        >
          <WhatsApp />
        </Fab>
      </Box>
    </Box>
  );
};

export default ModernProductDetail;