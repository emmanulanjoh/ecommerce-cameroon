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
  AccountCircle,
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
          <Toolbar sx={{ py: 0, minHeight: { xs: 32, sm: 28 }, px: 0 }}>
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
                    px: { xs: 0.5, sm: 1 },
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
                  <AccountCircle sx={{ fontSize: { xs: 18, sm: 20 }, mr: { xs: 0, sm: 0.5 } }} />
                  <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Sign In</Box>
                </Button>
              )}
              
              {/* Cart Button - Enhanced Amazon Style */}
              <Button
                onClick={() => setShowCartModal(true)}
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
                <Badge 
                  badgeContent={getTotalItems()} 
                  color="error" 
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      fontSize: { xs: '0.6rem', sm: '0.65rem' }, 
                      minWidth: { xs: 14, sm: 16 }, 
                      height: { xs: 14, sm: 16 },
                      backgroundColor: '#DC2626',
                      color: 'white',
                      fontWeight: 700
                    } 
                  }}
                >
                  <ShoppingCart sx={{ fontSize: { xs: 16, sm: 18 }, mr: { xs: 0, sm: 0.5 } }} />
                </Badge>
                <Box sx={{ display: { xs: 'none', md: 'inline' } }}>Cart</Box>
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