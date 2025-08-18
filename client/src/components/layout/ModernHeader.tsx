import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import CartModal from '../cart/CartModal';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Badge,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Phone,
  Email,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ModernHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const { getTotalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* Top Bar */}
      

      {/* Main Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  mr: 4,
                }}
              >
                FindAll Sourcing
              </Typography>
            </motion.div>

            {/* Search Bar - Hidden on mobile */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: 3,
                backgroundColor: alpha('#000', 0.05),
                '&:hover': {
                  backgroundColor: alpha('#000', 0.08),
                },
                marginLeft: 0,
                width: '100%',
                maxWidth: 400,
                mx: 3,
                display: { xs: 'none', md: 'block' },
              }}
            >
              <Box
                sx={{
                  padding: '0 16px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Search sx={{ color: 'text.secondary' }} />
              </Box>
              <InputBase
                placeholder="Search products..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    if (query.trim()) {
                      navigate(`/products?search=${encodeURIComponent(query)}`);
                    }
                  }
                }}
                sx={{
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: '12px 12px 12px 48px',
                    transition: 'width 0.3s',
                  },
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 'auto' }}>

              <Button
                component={Link}
                to="/products"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  },
                  borderRadius: 2,
                  transition: 'all 0.5s ease',
                }}
              >
                {t('header.products')}
              </Button>
              <Button
                component={Link}
                to="/about"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  },
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                {t('header.about')}
              </Button>
              <Button
                component={Link}
                to="/contact"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  },
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                {t('header.contact')}
              </Button>
              <Button
                component={Link}
                to="/faq"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  },
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                FAQ
              </Button>
            </Box>

            {/* Language Switcher & Cart */}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto', alignItems: 'center' }}>
              {/* Language Switcher */}
              <Button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                sx={{
                  minWidth: 'auto',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  },
                }}
              >
                {language === 'en' ? 'FR' : 'EN'}
              </Button>
              {/* Mobile Menu Button */}
              <IconButton
                sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>

              
              <IconButton
                onClick={() => setShowCartModal(true)}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  },
                }}
              >
                <Badge badgeContent={getTotalItems()} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiPaper-root': {
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
          },
        }}
      >

        <MenuItem onClick={handleMenuClose} component={Link} to="/products">
          Products
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/about">
          About
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/contact">
          Contact
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/faq">
          FAQ
        </MenuItem>
      </Menu>

      <CartModal 
        show={showCartModal} 
        onHide={() => setShowCartModal(false)} 
      />
    </>
  );
};

export default ModernHeader;