import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../features/auth';
import ModernCartModal from '../cart/ModernCartModal';
import SmartSearch from '../search/SmartSearch';
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

const ModernHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const { getTotalItems } = useCart();

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
        elevation={1}
        sx={{
          background: '#232F3E',
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 0.5, minHeight: 48 }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                mr: 2,
                fontSize: { xs: '0.9rem', md: '1rem' },
                minWidth: 'fit-content'
              }}
            >
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                FindAll
              </Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                FindAll
              </Box>
            </Typography>

            {/* Search Bar */}
            <Box sx={{ flex: 1, mx: { xs: 1, md: 2 }, maxWidth: 600 }}>
              <SmartSearch 
                onSearch={(query) => {
                  if (query.trim()) {
                    navigate(`/products?search=${encodeURIComponent(query)}`);
                  }
                }}
                placeholder="Search products..."
              />
            </Box>





            {/* User Menu & Cart - Amazon Style */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
              {/* User Menu */}
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      px: 1,
                      py: 0.5,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#FF9900',
                        color: '#0F1111',
                      },
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                    }}
                  >
                    <Avatar sx={{ 
                      width: 20, 
                      height: 20, 
                      mr: 0.5, 
                      fontSize: '0.65rem'
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
                    fontWeight: 500,
                    px: 1.5,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: '#FF9900',
                      color: '#0F1111',
                    },
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                  }}
                >
                  Sign In
                </Button>
              )}
              
              {/* Cart Button - Enhanced Amazon Style */}
              <Button
                onClick={() => setShowCartModal(true)}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #FF9900 0%, #FF6B35 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(255, 153, 0, 0.3)'
                  },
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  lineHeight: 1.2,
                  transition: 'all 0.2s ease',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge 
                    badgeContent={getTotalItems()} 
                    color="error" 
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        fontSize: '0.75rem', 
                        minWidth: 20, 
                        height: 20,
                        backgroundColor: '#DC2626',
                        color: 'white',
                        fontWeight: 700,
                        border: '2px solid white'
                      } 
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: 24 }} />
                  </Badge>
                  <Box sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 700 }}>Cart</Box>
                </Box>
              </Button>
              
              {/* Mobile Menu Button */}
              <IconButton
                sx={{ 
                  display: { xs: 'block', md: 'none' },
                  p: 1,
                  color: 'white'
                }}
                onClick={handleMenuOpen}
              >
                <MenuIcon sx={{ fontSize: 20 }} />
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