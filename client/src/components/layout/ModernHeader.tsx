import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../features/auth';
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
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ModernHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

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

            {/* User Menu, Language Switcher & Cart */}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto', alignItems: 'center' }}>
              {/* User Menu */}
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      px: 2,
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                      },
                      borderRadius: 2,
                    }}
                  >
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                      {user?.name?.charAt(0)}
                    </Avatar>
                    {user?.name}
                  </Button>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={() => setUserMenuAnchor(null)}
                  >
                    <MenuItem onClick={() => { setUserMenuAnchor(null); navigate('/dashboard'); }}>
                      Dashboard
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { setUserMenuAnchor(null); logout(); navigate('/'); }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    px: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    },
                    borderRadius: 2,
                  }}
                >
                  Login
                </Button>
              )}
              
              {/* Cart Button */}
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
              
              {/* Mobile Menu Button */}
              <IconButton
                sx={{ display: { xs: 'block', md: 'none' } }}
                onClick={handleMenuOpen}
              >
                <MenuIcon />
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
        <Divider />
        {isAuthenticated ? (
          <>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); logout(); navigate('/'); }}>
              Logout
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleMenuClose} component={Link} to="/login">
            Login
          </MenuItem>
        )}
      </Menu>

      <CartModal 
        show={showCartModal} 
        onHide={() => setShowCartModal(false)} 
      />
    </>
  );
};

export default ModernHeader;