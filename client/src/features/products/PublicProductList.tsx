import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Typography, Box, IconButton, Drawer, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import ProductFilters from '../../components/products/ProductFilters';
import ProductGrid from '../../components/products/ProductGrid';
import AdvancedSearch from '../../components/search/AdvancedSearch';
import { Product } from '../../shared/types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8fa4f3',
      dark: '#4c63d2',
    },
    secondary: {
      main: '#764ba2',
      light: '#9575cd',
      dark: '#512da8',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const PublicProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 50000000]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    fetchProducts();
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('');
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    } else {
      setSearchTerm('');
    }
  }, [searchParams]);

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nameFr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descriptionEn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, inStockOnly]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 PublicProductList: Fetching products...');
      const response = await axios.get('/api/products');
      console.log('📦 PublicProductList API Response:', response.data);
      const productsData = response.data.products || response.data || [];
      console.log('✅ PublicProductList: Products loaded:', productsData.length);
      
      const uniqueCategories = Array.from(new Set(productsData.map((p: Product) => p.category).filter(Boolean))) as string[];
      setCategories(uniqueCategories);
      
      setProducts(productsData);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([50, 50000000]);
    setInStockOnly(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Compact Header */}
        <Box sx={{ 
          textAlign: 'center',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: { xs: 0, md: 3 },
          p: { xs: 2, md: 3 },
          mx: { xs: 0, md: 2 },
          mt: { xs: 0, md: 2 },
          mb: 3
        }}>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 1, color: 'white' }}>
            Discover Amazing Products
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
            Find the perfect products for your needs
          </Typography>
        </Box>

        {/* Advanced Search */}
        <Box sx={{ px: { xs: 1, md: 3 }, mb: 2 }}>
          <AdvancedSearch 
            onSearch={(filters) => {
              setSearchTerm(filters.search);
              setSelectedCategory(filters.category);
              setPriceRange([filters.minPrice, filters.maxPrice]);
              setInStockOnly(filters.inStock);
            }}
            loading={loading}
          />
        </Box>

        {/* Main Content Container */}
        <Box sx={{ px: { xs: 1, md: 3 }, pb: 4 }}>

        {/* Filter Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {filteredProducts.length} products found
          </Typography>
          <IconButton
            onClick={() => setFilterDrawerOpen(true)}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <FilterList />
          </IconButton>
        </Box>

        {/* Filter Drawer */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: isMobile ? '100%' : 400,
              p: 3,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="600">
              Filter Products
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              ×
            </IconButton>
          </Box>
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onClearFilters={handleClearFilters}
          />
        </Drawer>

          {/* Full Width Product Grid */}
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            selectedCategory={selectedCategory}
            onRefresh={fetchProducts}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PublicProductList;