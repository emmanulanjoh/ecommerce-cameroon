import React from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleProductCard from './SimpleProductCard';
import ProductSkeleton from '../ui/ProductSkeleton';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  onRefresh: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  error,
  selectedCategory,
  onRefresh,
}) => {
  // Generate varied card heights like Temu
  const getCardHeight = (index: number): 'normal' | 'tall' | 'short' => {
    const patterns: ('normal' | 'tall' | 'short')[] = [
      'normal',  // Standard height
      'normal',  // Standard height
      'tall',    // Taller card
      'normal',  // Standard height
      'normal',  // Standard height
      'short',   // Shorter card
    ];
    return patterns[index % patterns.length];
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <Box>
        <Box
          sx={{
            columns: {
              xs: 2,
              sm: 3,
              md: 4,
              lg: 5
            },
            columnGap: { xs: '8px', sm: '12px', md: '16px' },
            columnFill: 'balance'
          }}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} style={{
              breakInside: 'avoid',
              marginBottom: '8px',
              display: 'inline-block',
              width: '100%'
            }}>
              <ProductSkeleton />
            </div>
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRefresh}>
              Try Again
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="700" color="primary.main">
            Products
          </Typography>
          {selectedCategory && (
            <Chip
              label={selectedCategory}
              color="primary"
              variant="filled"
              sx={{ borderRadius: 2 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mr: { xs: 1, sm: 2 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {products.length} found
          </Typography>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{ 
              borderRadius: 2,
              display: { xs: 'none', sm: 'flex' } // Hide on mobile to save space
            }}
          >
            Refresh
          </Button>


        </Box>
      </Box>

      {/* Products */}
      {products.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or filters
          </Typography>
          <Button variant="contained" onClick={onRefresh} sx={{ borderRadius: 2 }}>
            Browse All Products
          </Button>
        </Box>
      ) : (
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box
              sx={{
                columns: {
                  xs: 2, // 2 columns on mobile
                  sm: 3, // 3 columns on tablet
                  md: 4, // 4 columns on desktop
                  lg: 5  // 5 columns on large screens
                },
                columnGap: { xs: '8px', sm: '12px', md: '16px' },
                columnFill: 'balance'
              }}
            >
              {products.map((product, index) => {
                const heightType = getCardHeight(index);
                return (
                  <motion.div 
                    key={product._id} 
                    variants={itemVariants}
                    style={{
                      breakInside: 'avoid',
                      marginBottom: '8px',
                      display: 'inline-block',
                      width: '100%'
                    }}
                  >
                    <Box
                      sx={{
                        height: {
                          normal: 'auto',
                          tall: { xs: 'auto', sm: '320px', md: '350px' },
                          short: { xs: 'auto', sm: '200px', md: '220px' }
                        }[heightType] || 'auto'
                      }}
                    >
                      <SimpleProductCard product={product} heightType={heightType} />
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>
        </AnimatePresence>
      )}
    </Box>
  );
};

export default ProductGrid;