import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../features/auth';
import ModernCartModal from '../cart/ModernCartModal';
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
  Avatar,
  Divider,
} from '@mui/material';
import {
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
          background: '#232F3E',
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: { xs: 0.1, md: 0.5 }, minHeight: { xs: 40, md: 56 } }}>
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  textDecoration: 'none',
                  mr: { xs: 1, md: 4 },
                  fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' },
                }}
              >
                {/* Show short name on mobile */}
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  FindAll
                </Box>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  FindAll Sourcing
                </Box>
              </Typography>
            </motion.div>



            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1, ml: 'auto' }}>

              <Button
                component={Link}
                to="/products"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#FF9900',
                    color: '#0F1111',
                  },
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                {t('header.products')}
              </Button>
              <Button
                component={Link}
                to="/about"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#FF9900',
                    color: '#0F1111',
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
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#FF9900',
                    color: '#0F1111',
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
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#FF9900',
                    color: '#0F1111',
                  },
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                FAQ
              </Button>
            </Box>

            {/* User Menu, Language Switcher & Cart */}
            <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, ml: 'auto', alignItems: 'center' }}>
              {/* User Menu */}
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      px: { xs: 1, md: 2 },
                      py: { xs: 0.5, md: 1 },
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#FF9900',
                        color: '#0F1111',
                      },
                      borderRadius: 2,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      minWidth: 'auto',
                    }}
                  >
                    <Avatar sx={{ 
                      width: { xs: 20, md: 24 }, 
                      height: { xs: 20, md: 24 }, 
                      mr: { xs: 0.5, md: 1 }, 
                      fontSize: { xs: '0.65rem', md: '0.75rem' }
                    }}>
                      {user?.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      {user?.name}
                    </Box>
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
                    color: 'white',
                    fontWeight: 600,
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 0.5, md: 1 },
                    '&:hover': {
                      backgroundColor: '#FF9900',
                      color: '#0F1111',
                    },
                    borderRadius: 2,
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    minWidth: 'auto',
                  }}
                >
                  Login
                </Button>
              )}
              
              {/* Cart Button */}
              <IconButton
                onClick={() => setShowCartModal(true)}
                sx={{
                  color: 'white',
                  p: { xs: 1, md: 1.5 },
                  '&:hover': {
                    backgroundColor: '#FF9900',
                    color: '#0F1111',
                  },
                }}
              >
                <Badge badgeContent={getTotalItems()} color="error">
                  <ShoppingCart sx={{ fontSize: { xs: 20, md: 24 } }} />
                </Badge>
              </IconButton>
              
              {/* Mobile Menu Button */}
              <IconButton
                sx={{ 
                  display: { xs: 'block', lg: 'none' },
                  p: { xs: 1, md: 1.5 }
                }}
                onClick={handleMenuOpen}
              >
                <MenuIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
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

      <ModernCartModal 
        open={showCartModal} 
        onClose={() => setShowCartModal(false)} 
      />
    </>
  );
};

export default ModernHeader;