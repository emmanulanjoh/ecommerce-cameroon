import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
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

const ModernHome: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const heroImages = [
     '/images/hero/hero1.jpg',
     '/images/hero/hero2.jpg',
     '/images/hero/hero3.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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
    <Box sx={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `url(${heroImages[currentSlide]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: 'white',
            py: { xs: 4, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-image 1s ease-in-out',
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 6,
                alignItems: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  label="🔥 Trending Now"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    mb: 3,
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.1,
                  }}
                >
                  {t('home.hero.title')}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
                >
                  {t('home.hero.subtitle')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {t('home.hero.shopNow')}
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
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'white',
                      },
                    }}
                  >
                    {t('home.hero.whatsapp')}
                  </Button>
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
                  {heroImages.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
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
              </motion.div>
            </Box>
          </Container>
        </Box>



        {/* Categories Section */}
        <Box sx={{ py: { xs: 4, md: 8 }, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
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

        {/* {t('home.featured.title')} */}
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
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
            <Typography textAlign="center" sx={{ py: 4 }}>
              Loading products...
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 3,
              }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ModernProductCard product={product} />
                </motion.div>
              ))}
            </Box>
          )}
        </Container>



        {/* CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            py: { xs: 4, md: 8 },
          }}
        >
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="700" sx={{ mb: 2 }}>
                  Ready to Start Shopping?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Join thousands of satisfied customers across Cameroon
                </Typography>
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: 'primary.main',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Explore Products
                </Button>
              </Box>
            </motion.div>
          </Container>
        </Box>
        
        {/* AI Components */}
        <ChatBot />
      </Box>
  );
};

export default ModernHome;