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
} from '@mui/icons-material';

import { useCart } from '../../context/CartContext';
import { useActivityTracker } from '../../hooks/useActivityTracker';

import axios from 'axios';
import { Product, Review } from '../../types';
import ReviewSection from '../../components/reviews/ReviewSection';
import ProductRecommendations from '../../components/recommendations/ProductRecommendations';

const ModernProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const { trackActivity } = useActivityTracker();


  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [zoomImageSrc, setZoomImageSrc] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        
        // Track product view (with error handling)
        try {
          trackActivity(data._id, 'view');
        } catch (trackError) {
          console.warn('Activity tracking failed:', trackError);
        }
        
        // Fetch related products from same category only
        if (data.category) {
          const relatedRes = await axios.get(`/api/products?category=${encodeURIComponent(data.category)}&limit=20`);
          const allProducts = relatedRes.data.products || relatedRes.data || [];
          const filtered = allProducts.filter((p: Product) => p._id !== data._id && p.category === data.category);
          setRelatedProducts(filtered.slice(0, 6));
        }
        
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
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Temu-style Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        bgcolor: '#ffffff', 
        zIndex: 10,
        borderBottom: '1px solid #e0e0e0',
        px: 1,
        py: 0.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate(-1)} size="small" sx={{ p: 1 }}>
            <ArrowBack sx={{ fontSize: 20 }} />
          </IconButton>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <img 
              src={product.images?.[0] || '/images/placeholder.svg'} 
              alt="" 
              style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }}
            />
            <Typography sx={{ 
              fontSize: '0.9rem',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: '#333'
            }}>
              {product.nameEn}
            </Typography>
          </Box>
          <IconButton onClick={handleShare} size="small" sx={{ p: 1 }}>
            <Share sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ px: 0, pb: { xs: 8, md: 2 } }}>
        {/* Temu-style Image Gallery */}
        <Box sx={{ bgcolor: 'white', mb: 1 }}>
          <Box sx={{ position: 'relative', aspectRatio: '1' }}>
            <img
              src={product.images?.[selectedImage] || '/images/placeholder.jpg'}
              alt={product.nameEn}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'zoom-in'
              }}
              onClick={() => {
                setZoomImageSrc(product.images?.[selectedImage] || '/images/placeholder.jpg');
                setImageZoomOpen(true);
              }}
            />
            
            {/* Floating Action Buttons */}
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <IconButton
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', boxShadow: 1 }}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <Favorite sx={{ color: '#ff4757', fontSize: 18 }} /> : <FavoriteBorder sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
            
            {/* Image Counter */}
            {product.images && product.images.length > 1 && (
              <Box sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem'
              }}>
                {selectedImage + 1}/{product.images.length}
              </Box>
            )}
          </Box>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5, 
              p: 1, 
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}>
              {product.images.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    minWidth: 50,
                    height: 50,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: 2,
                    borderColor: selectedImage === index ? '#ff4757' : 'transparent',
                    opacity: selectedImage === index ? 1 : 0.7
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
        </Box>

        {/* Product Info */}
        <Box sx={{ bgcolor: 'white', p: 2, mb: 1 }}>
            <Typography sx={{ 
              fontSize: '1.1rem',
              fontWeight: 500,
              color: '#333',
              mb: 1,
              lineHeight: 1.3
            }}>
              {product.nameEn}
            </Typography>

            {/* Rating & Reviews */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating value={averageRating} precision={0.1} readOnly size="small" />
              <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                ({reviews.length})
              </Typography>
              {product.inStock && (
                <Chip label="In Stock" size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', fontSize: '0.7rem', height: 20 }} />
              )}
            </Box>



            {/* Price */}
            <Typography sx={{ 
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#ff4757',
              mb: 1
            }}>
              {formatPrice(product.price)}
            </Typography>

            {/* Category */}
            <Typography sx={{ fontSize: '0.8rem', color: '#666', mb: 1 }}>
              Category: {product.category}
            </Typography>

        </Box>
        
        {/* Description */}
        <Box sx={{ bgcolor: 'white', p: 2, mb: 1 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, mb: 1 }}>Description</Typography>
          <Typography sx={{ 
            fontSize: '0.85rem',
            color: '#666',
            lineHeight: 1.4,
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
              sx={{ mt: 1, fontSize: '0.8rem', p: 0, minWidth: 'auto' }}
            >
              {showFullDescription ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </Box>

        {/* Related Products - Same Category */}
        {relatedProducts.length > 0 && (
          <Box sx={{ bgcolor: 'white', p: 2 }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, mb: 2, color: '#333' }}>
              More from {product.category}
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1
            }}>
              {relatedProducts.map((relatedProduct) => (
                <Box 
                  key={relatedProduct._id}
                  onClick={() => navigate(`/products/${relatedProduct._id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ 
                    border: '1px solid #f0f0f0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    '&:hover': { borderColor: '#ddd' }
                  }}>
                    <img
                      src={relatedProduct.images?.[0] || '/images/placeholder.jpg'}
                      alt={relatedProduct.nameEn}
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                    />
                    <Box sx={{ p: 1 }}>
                      <Typography sx={{ 
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 0.5
                      }}>
                        {relatedProduct.nameEn}
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', color: '#ff4757', fontWeight: 600 }}>
                        {formatPrice(relatedProduct.price)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Temu-Style Fixed Bottom Actions */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'white',
        borderTop: '1px solid #e0e0e0',
        p: 1,
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<WhatsApp sx={{ fontSize: 18 }} />}
            onClick={handleWhatsAppOrder}
            sx={{
              flex: 1,
              py: 1.2,
              borderColor: '#25d366',
              color: '#25d366',
              fontWeight: 600,
              fontSize: '0.9rem',
              '&:hover': { bgcolor: '#f0f8f0', borderColor: '#25d366' }
            }}
          >
            WhatsApp
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShoppingCart sx={{ fontSize: 18 }} />}
            onClick={() => {
              if (product) {
                addToCart(product);
                try {
                  trackActivity(product._id, 'cart');
                } catch (error) {
                  console.warn('Activity tracking failed:', error);
                }
              }
            }}
            disabled={!product?.inStock}
            sx={{
              flex: 2,
              py: 1.2,
              bgcolor: 'white',
              color: 'black',
              borderColor: '#ddd',
              fontWeight: 600,
              fontSize: '0.9rem',
              '&:hover': { bgcolor: '#f5f5f5', borderColor: '#bbb' },
              '&:disabled': { bgcolor: '#f5f5f5', color: '#999' }
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>

      {/* Image Zoom Modal */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: imageZoomOpen ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={() => setImageZoomOpen(false)}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
          }}
        >
          ×
        </IconButton>

        {/* Left arrow */}
        {product?.images && product.images.length > 1 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (product?.images) {
                const currentIndex = product.images.indexOf(zoomImageSrc);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : product.images.length - 1;
                setZoomImageSrc(product.images[prevIndex]);
                setSelectedImage(prevIndex);
              }
            }}
            sx={{
              position: 'absolute',
              left: 20,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              fontSize: '2rem'
            }}
          >
            ‹
          </IconButton>
        )}

        {/* Right arrow */}
        {product?.images && product.images.length > 1 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (product?.images) {
                const currentIndex = product.images.indexOf(zoomImageSrc);
                const nextIndex = currentIndex < product.images.length - 1 ? currentIndex + 1 : 0;
                setZoomImageSrc(product.images[nextIndex]);
                setSelectedImage(nextIndex);
              }
            }}
            sx={{
              position: 'absolute',
              right: 20,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              fontSize: '2rem'
            }}
          >
            ›
          </IconButton>
        )}

        {/* Main image */}
        <img
          src={zoomImageSrc}
          alt={product?.nameEn || 'Product'}
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain'
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image counter */}
        {product?.images && product.images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}
          >
            {product.images ? product.images.indexOf(zoomImageSrc) + 1 : 1} / {product.images?.length || 1}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ModernProductDetail;