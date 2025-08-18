import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  HelpOutline,
  ShoppingCart,
  LocalShipping,
  Payment,
  Security,
  Support,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ModernFAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpOutline />, color: '#667eea' },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart />, color: '#4CAF50' },
    { id: 'shipping', label: 'Shipping', icon: <LocalShipping />, color: '#FF9800' },
    { id: 'payment', label: 'Payment', icon: <Payment />, color: '#2196F3' },
    { id: 'security', label: 'Security', icon: <Security />, color: '#F44336' },
    { id: 'support', label: 'Support', icon: <Support />, color: '#9C27B0' },
  ];

  const faqs = [
    {
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You can also order directly via WhatsApp by clicking the WhatsApp button on any product.',
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 30 minutes of placing it. After that, please contact our customer support team for assistance.',
    },
    {
      category: 'orders',
      question: 'How do I track my order?',
      answer: 'Once your order is confirmed, you will receive a tracking number via SMS and email. You can use this number to track your order status on our website.',
    },
    {
      category: 'shipping',
      question: 'What are your delivery areas?',
      answer: 'We deliver to all major cities in Cameroon including Douala, Yaoundé, Bafoussam, Bamenda, and Garoua. We are constantly expanding our delivery network.',
    },
    {
      category: 'shipping',
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 1-3 business days within major cities and 3-7 business days for other areas. Express delivery options are available for urgent orders.',
    },
    {
      category: 'shipping',
      question: 'What are the delivery charges?',
      answer: 'Delivery charges vary by location and order value. Orders above 50,000 XAF qualify for free delivery within major cities. Check our delivery policy for detailed pricing.',
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept Mobile Money (MTN, Orange), bank transfers, cash on delivery, and major credit/debit cards. All payments are processed securely.',
    },
    {
      category: 'payment',
      question: 'Is it safe to pay online?',
      answer: 'Yes, all online payments are processed through secure, encrypted channels. We use industry-standard security measures to protect your financial information.',
    },
    {
      category: 'payment',
      question: 'Can I pay on delivery?',
      answer: 'Yes, we offer cash on delivery for most areas. However, some high-value items may require advance payment for security reasons.',
    },
    {
      category: 'security',
      question: 'How do you protect my personal information?',
      answer: 'We use advanced encryption and security protocols to protect your data. We never share your personal information with third parties without your consent.',
    },
    {
      category: 'security',
      question: 'What if I receive a damaged product?',
      answer: 'If you receive a damaged product, contact us immediately with photos. We will arrange for a replacement or full refund within 24 hours.',
    },
    {
      category: 'support',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support via WhatsApp, email, or phone. Our support team is available 24/7 to assist you with any questions or concerns.',
    },
    {
      category: 'support',
      question: 'Do you have a return policy?',
      answer: 'Yes, we offer a 7-day return policy for most products. Items must be in original condition with packaging. Some restrictions apply for certain product categories.',
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'url(/images/hero/faq.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="700" mb={2}>
                FAQ
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9 }}>
                Find answers to common questions about our services, orders, and policies.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Search and Categories */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4, mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h6" fontWeight="600" mb={2}>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    icon={category.icon}
                    label={category.label}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                    sx={{
                      borderRadius: 2,
                      ...(selectedCategory === category.id && {
                        bgcolor: category.color,
                        color: 'white',
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }),
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Box>
            </motion.div>
        </Box>

        {/* FAQ List */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <Accordion
                    key={index}
                    elevation={0}
                    sx={{
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: '12px !important',
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        boxShadow: 2,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        borderRadius: '12px',
                        '&.Mui-expanded': {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Card elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
                  <HelpOutline sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    No questions found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search terms or category filter.
                  </Typography>
                </Card>
              )}
            </motion.div>

          {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Support sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" mb={1}>
                      Still Need Help?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      Can't find what you're looking for? Our support team is here to help!
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" mb={1}>
                      Contact Options:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📱 WhatsApp: +237 6XX XXX XXX
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📧 Email: support@ecommerce-cameroon.com
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📞 Phone: +237 6XX XXX XXX
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Our support team is available 24/7 to assist you.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default ModernFAQ;