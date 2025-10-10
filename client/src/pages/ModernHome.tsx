import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Chip,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ChatBot from '../components/ai/ChatBot';

import {
  ArrowForward,
  TrendingUp,
  WhatsApp,
  ExpandMore,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Product, Category } from '../types';
import ModernProductCard from '../components/products/ModernProductCard';
import RecentlyViewed from '../components/products/RecentlyViewed';

const ModernHome: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle OAuth error redirects
  useEffect(() => {
    const error = searchParams.get('error');
    const redirect = searchParams.get('redirect');
    
    if (error && redirect === 'login') {
      // Clear URL parameters and redirect to login with error
      navigate('/login', { 
        replace: true, 
        state: { error } 
      });
    }
  }, [searchParams, navigate]);

  const productImages = useMemo(() => 
    featuredProducts.map(product => 
      product.thumbnailImage || product.images?.[0] || '/images/placeholder.jpg'
    ), [featuredProducts]
  );

  useEffect(() => {
    if (productImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [productImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/products');
        const allProducts = response.data.products || response.data || [];
        
        const featured = allProducts.filter((p: Product) => p.featured).slice(0, 4);
        
        const categoryCount: { [key: string]: number } = {};
        allProducts.forEach((product: Product) => {
          if (product.category && product.category.trim()) {
            const category = product.category.trim();
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          }
        });
        
        const dynamicCategories = Object.entries(categoryCount)
          .map(([name, count]) => ({ _id: name, count: count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
        
        setFeaturedProducts(featured);
        setCategories(dynamicCategories);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Try to get real categories from your debug data
        const realCategories = [
          { _id: 'Electronics', count: 2 },
          { _id: 'electronics', count: 1 }
        ];
        setFeaturedProducts([]);
        setCategories(realCategories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);



  const getCategoryIcon = (categoryName: string, index: number): string => {
    const iconMap: { [key: string]: string } = {
      'Electronics': '📱',
      'Clothing': '👕',
      'Home & Kitchen': '🏠',
      'Beauty & Personal Care': '💄',
      'Sports & Outdoors': '⚽',
      'Automotive': '🚗',
      'Books & Media': '📖',
      'Toys & Games': '🧸',
      'Health & Wellness': '💊',
      'Groceries & Food': '🍽️'
    };
    return iconMap[categoryName] || ['📱', '👕', '🏠', '💄', '⚽', '🚗'][index] || '📦';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        {/* Hero Section with Product Carousel */}
        <Box sx={{ 
          height: { xs: 250, md: 400 },
          position: 'relative',
          overflow: 'hidden',
          mb: 3
        }}>
          {/* Product Images Carousel Background */}
          {productImages.length > 0 && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${productImages[currentImageIndex]})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#f5f5f5',
              transition: 'background-image 1s ease-in-out'
            }} />
          )}
          
          {/* Overlay */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Container maxWidth="xl">
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h2" fontWeight="800" sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                  {t('home.hero.title')}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Discover {featuredProducts.length}+ Amazing Products
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    Shop Now
                  </Button>
                  <Button
                    href={`https://wa.me/${process.env.REACT_APP_BUSINESS_WHATSAPP_NUMBER?.replace('+', '') || '237678830036'}`}
                    variant="outlined"
                    size="large"
                    startIcon={<WhatsApp />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    WhatsApp
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
          
          {/* Carousel Indicators */}
          {productImages.length > 1 && (
            <Box sx={{ 
              position: 'absolute', 
              bottom: 20, 
              left: '50%', 
              transform: 'translateX(-50%)',
              display: 'flex', 
              gap: 1 
            }}>
              {productImages.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: currentImageIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'scale(1.2)',
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Categories Section */}
        <Box sx={{ py: 2, bgcolor: 'white', mb: 2 }}>
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h3"
                textAlign="center"
                fontWeight="700"
                sx={{ mb: 2 }}
              >
                {t('home.categories.title')}
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 6 }}
              >
                {t('home.categories.subtitle')}
              </Typography>
            </motion.div>

            {isMobile ? (
              // Mobile Dropdown Version
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Accordion
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&:before': { display: 'none' },
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        gap: 2,
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '1.5rem' }}>🛍️</Typography>
                    <Typography variant="h6" fontWeight="600">
                      {t('home.categories.browse')} ({categories.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {categories.map((category, index) => (
                        <Button
                          key={category._id}
                          component={Link}
                          to={`/products?category=${category._id}`}
                          sx={{
                            justifyContent: 'space-between',
                            p: 2,
                            color: 'white',
                            textTransform: 'none',
                            borderBottom: index < categories.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontSize: '1.2rem' }}>
                              {getCategoryIcon(category._id, index)}
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {category._id}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${category.count} ${t('home.categories.items')}`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </Button>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ) : (
              // Desktop Grid Version
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                  gap: 4,
                  maxWidth: '900px',
                  mx: 'auto',
                }}
              >
                {categories.slice(0, 6).map((category, index) => {
                  const gradients = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  ];
                  
                  return (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                    >
                      <Card
                        component={Link}
                        to={`/products?category=${category._id}`}
                        sx={{
                          textDecoration: 'none',
                          borderRadius: 4,
                          overflow: 'hidden',
                          background: gradients[index % gradients.length],
                          color: 'white',
                          position: 'relative',
                          minHeight: 180,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(255, 255, 255, 0.1)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          },
                          '&:hover::before': {
                            opacity: 1,
                          },
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        }}
                      >
                        <Box sx={{ textAlign: 'center', p: 3, position: 'relative', zIndex: 1 }}>
                          <Typography 
                            sx={{ 
                              fontSize: '3rem', 
                              mb: 2,
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                            }}
                          >
                            {getCategoryIcon(category._id, index)}
                          </Typography>
                          <Typography 
                            variant="h5" 
                            fontWeight="700" 
                            sx={{ 
                              mb: 1,
                              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                          >
                            {category._id}
                          </Typography>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 20,
                              px: 2,
                              py: 0.5,
                              backdropFilter: 'blur(10px)',
                            }}
                          >
                            <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" fontWeight="600">
                              {category.count} {t('home.categories.items')}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </motion.div>
                  );
                })}
              </Box>
            )}
            
            {categories.length > 6 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  component={Link}
                  to="/products"
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {t('home.categories.viewAll')}
                </Button>
              </Box>
            )}
          </Container>
        </Box>

        {/* Recently Viewed Products */}
        <RecentlyViewed />

        {/* Featured Products */}
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
              <Box>
                <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                  {t('home.featured.title')}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Handpicked items just for you
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/products"
                endIcon={<ArrowForward />}
                sx={{ fontWeight: 600 }}
              >
                View All
              </Button>
            </Box>
          </motion.div>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Loading products...</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
                gap: 1.5,
              }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ModernProductCard product={product} />
                </motion.div>
              ))}
            </Box>
          )}
        </Container>



        {/* View All Products */}
        <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'white' }}>
          <Button
            component={Link}
            to="/products"
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            sx={{ borderRadius: 2, px: 4 }}
          >
            View All Products
          </Button>
        </Box>
        
        {/* AI Components */}
        <ChatBot />
      </Box>
  );
};

export default ModernHome;