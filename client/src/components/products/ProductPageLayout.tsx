import React, { createContext, useContext, ReactNode } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';

interface ProductPageContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ProductPageContext = createContext<ProductPageContextType | undefined>(undefined);

export const useProductPage = () => {
  const context = useContext(ProductPageContext);
  if (!context) {
    throw new Error('useProductPage must be used within ProductPageLayout');
  }
  return context;
};

interface ProductPageLayoutProps {
  children: ReactNode;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

const ProductPageLayout: React.FC<ProductPageLayoutProps> & {
  Sidebar: React.FC<{ children: ReactNode }>;
  Content: React.FC<{ children: ReactNode }>;
  Header: React.FC<{ children: ReactNode }>;
} = ({ children, loading = false, setLoading = () => {} }) => {
  return (
    <ProductPageContext.Provider value={{ loading, setLoading }}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          py: { xs: 1, md: 4 },
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.div>
        </Container>
      </Box>
    </ProductPageContext.Provider>
  );
};

const Header: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: { xs: 2, md: 4 },
          mb: { xs: 2, md: 4 },
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {children}
      </Paper>
    </motion.div>
  );
};

const Sidebar: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ width: { xs: '100%', md: '25%' }, pr: { xs: 0, md: 2 }, mb: { xs: 3, md: 0 } }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: { xs: 'static', md: 'sticky' },
            top: 20,
          }}
        >
          {children}
        </Paper>
      </motion.div>
    </Box>
  );
};

const Content: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ width: { xs: '100%', md: '75%' }, pl: { xs: 0, md: 2 } }}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minHeight: '70vh',
          }}
        >
          {children}
        </Paper>
      </motion.div>
    </Box>
  );
};

ProductPageLayout.Header = Header;
ProductPageLayout.Sidebar = Sidebar;
ProductPageLayout.Content = Content;

export default ProductPageLayout;