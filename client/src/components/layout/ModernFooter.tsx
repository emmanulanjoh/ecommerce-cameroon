import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  WhatsApp,
  Email,
  Phone,
  LocationOn,
  Send,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ModernFooter: React.FC = () => {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Categories',
      links: [
        { name: 'Electronics', path: '/products?category=Electronics' },
        { name: 'Clothing', path: '/products?category=Clothing' },
        { name: 'Home & Kitchen', path: '/products?category=Home & Kitchen' },
        { name: 'Beauty & Personal Care', path: '/products?category=Beauty & Personal Care' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'FAQ', path: '/faq' },
        { name: 'Returns', path: '/returns' },
        { name: 'Shipping Info', path: '/shipping' },
        { name: 'Privacy Policy', path: '/privacy' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, color: '#1877F2', href: '#' },
    { icon: Twitter, color: '#1DA1F2', href: '#' },
    { icon: Instagram, color: '#E4405F', href: '#' },
    { icon: LinkedIn, color: '#0A66C2', href: '#' },
    { icon: WhatsApp, color: '#25D366', href: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr 1.5fr' },
            gap: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              E-Commerce Cameroon
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
              Your trusted partner for authentic products in Cameroon.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 16, color: '#667eea' }} />
                <Typography variant="body2">+237 123 456 789</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 16, color: '#667eea' }} />
                <Typography variant="body2">info@ecommerce-cameroon.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: '#667eea' }} />
                <Typography variant="body2">Douala, Cameroon</Typography>
              </Box>
            </Box>
          </motion.div>

          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.links.map((link) => (
                  <Button
                    key={link.name}
                    component={Link}
                    to={link.path}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      justifyContent: 'flex-start',
                      p: 0,
                      minWidth: 'auto',
                      textTransform: 'none',
                      '&:hover': {
                        color: '#667eea',
                        background: 'transparent',
                      },
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Box>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
              Subscribe for updates and exclusive offers.
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              variant="outlined"
              size="small"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton sx={{ color: '#667eea' }}>
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  sx={{
                    color: social.color,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: social.color,
                      color: 'white',
                    },
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Container>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      <Container maxWidth="xl">
        <Box
          sx={{
            py: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2024 E-Commerce Cameroon. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              component={Link}
              to="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'none',
                p: 0,
                minWidth: 'auto',
                '&:hover': { color: '#667eea', background: 'transparent' },
              }}
            >
              Terms of Service
            </Button>
            <Button
              component={Link}
              to="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'none',
                p: 0,
                minWidth: 'auto',
                '&:hover': { color: '#667eea', background: 'transparent' },
              }}
            >
              Privacy Policy
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ModernFooter;