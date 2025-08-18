import React from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ViewModule, ViewList, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ModernProductCard from './ModernProductCard';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onRefresh: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  error,
  selectedCategory,
  viewMode,
  setViewMode,
  onRefresh,
}) => {
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading products...
        </Typography>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </Typography>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>

          <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'text'}
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{ minWidth: 40, borderRadius: '8px 0 0 8px' }}
            >
              <ViewModule />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'text'}
              size="small"
              onClick={() => setViewMode('list')}
              sx={{ minWidth: 40, borderRadius: '0 8px 8px 0' }}
            >
              <ViewList />
            </Button>
          </Box>
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
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' 
                  ? 'repeat(auto-fill, minmax(280px, 1fr))' 
                  : '1fr',
                gap: 3,
              }}
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ModernProductCard product={product} viewMode={viewMode} />
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </AnimatePresence>
      )}
    </Box>
  );
};

export default ProductGrid;