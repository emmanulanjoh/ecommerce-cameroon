import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowForward, History } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import ModernProductCard from './ModernProductCard';
import ProductQuickView from './ProductQuickView';
import { Product } from '../../types';

const RecentlyViewed: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (recentlyViewed.length === 0) return null;

  return (
    <Box sx={{ py: 4, bgcolor: 'white', mb: 2 }}>
      <Box sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History color="primary" />
            <Typography variant="h5" fontWeight="700">
              Recently Viewed
            </Typography>
          </Box>
          <Button
            onClick={clearRecentlyViewed}
            variant="text"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            Clear All
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: 4,
            },
          }}
        >
          {recentlyViewed.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{ minWidth: 250, maxWidth: 250 }}
            >
              <Box onClick={() => setQuickViewProduct(product)} sx={{ cursor: 'pointer' }}>
                <ModernProductCard product={product} />
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </Box>
  );
};

export default RecentlyViewed;