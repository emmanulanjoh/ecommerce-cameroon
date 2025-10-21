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
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const ModernHeader: React.FC = () => {
  const [showCartModal, setShowCartModal] = useState(false);
  const { getTotalItems } = useCart();

  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

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
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Toolbar sx={{ py: { xs: 0.25, sm: 0.5 }, minHeight: { xs: 56, sm: 48 }, px: 0 }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                mr: { xs: 0.5, sm: 2 },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                minWidth: 'fit-content',
                flexShrink: 0
              }}
            >
              FindAll
            </Typography>

            {/* Search Bar */}
            <Box sx={{ 
              flex: 1, 
              mx: { xs: 0.5, sm: 1, md: 2 }, 
              maxWidth: { xs: 'none', md: 600 },
              minWidth: 0
            }}>
              <SmartSearch 
                onSearch={(query) => {
                  if (query.trim()) {
                    navigate(`/products?search=${encodeURIComponent(query)}`);
                  }
                }}
                placeholder="Search..."
              />
            </Box>





            {/* User Menu & Cart - Amazon Style */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 0.5, sm: 1 }, 
              alignItems: 'center', 
              ml: 'auto',
              flexShrink: 0
            }}>
              {/* User Menu */}
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      px: { xs: 0.5, sm: 1 },
                      py: 0.5,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#FF9900',
                        color: '#0F1111',
                      },
                      borderRadius: 1,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      minWidth: 'auto',
                    }}
                  >
                    <Avatar sx={{ 
                      width: { xs: 18, sm: 20 }, 
                      height: { xs: 18, sm: 20 }, 
                      mr: { xs: 0, sm: 0.5 }, 
                      fontSize: { xs: '0.6rem', sm: '0.65rem' }
                    }}>
                      {user?.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ display: { xs: 'none', md: 'inline' } }}>
                      {user?.name?.split(' ')[0]}
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
                    px: { xs: 1, sm: 1.5 },
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: '#FF9900',
                      color: '#0F1111',
                    },
                    borderRadius: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    minWidth: 'auto',
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Sign In</Box>
                  <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Sign</Box>
                </Button>
              )}
              
              {/* Cart Button - Enhanced Amazon Style */}
              <Button
                onClick={() => setShowCartModal(true)}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #FF9900 0%, #FF6B35 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(255, 153, 0, 0.3)'
                  },
                  borderRadius: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.9rem' },
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                  <Badge 
                    badgeContent={getTotalItems()} 
                    color="error" 
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }, 
                        minWidth: { xs: 16, sm: 20 }, 
                        height: { xs: 16, sm: 20 },
                        backgroundColor: '#DC2626',
                        color: 'white',
                        fontWeight: 700,
                        border: '2px solid white'
                      } 
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: { xs: 20, sm: 24 } }} />
                  </Badge>
                  <Box sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 700 }}>Cart</Box>
                </Box>
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>


      <ModernCartModal 
        open={showCartModal} 
        onClose={() => setShowCartModal(false)} 
      />
    </>
  );
};

export default ModernHeader;