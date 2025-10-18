import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Typography, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';


import ProductGrid from '../../components/products/ProductGrid';
import AdvancedSearch from '../../components/search/AdvancedSearch';
import { Product } from '../../shared/types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9900',
      light: '#FFB84D',
      dark: '#E68A00',
    },
    secondary: {
      main: '#232F3E',
      light: '#37475A',
      dark: '#131A22',
    },
    background: {
      default: '#ffffff',
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

  // Fisher-Yates shuffle for randomizing arrays
  const shuffleArray = (array: Product[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
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
    fetchProducts();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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
      
      const response = await axios.get('/api/products');
      const productsData = response.data.products || response.data || [];
      

      
      // Randomize products on each fetch
      const randomizedProducts = shuffleArray(productsData);
      setProducts(randomizedProducts);
    } catch (err: any) {
      // Sanitize error message to prevent log injection
      const sanitizedError = err.message || err.toString() || 'Unknown error';
      const cleanError = sanitizedError.replace(/[\r\n\t]/g, ' ').substring(0, 200);
      console.error('Error fetching products:', cleanError);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };





  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Amazon-style Category Hero */}
        <Box sx={{ 
          backgroundColor: '#232F3E',
          color: 'white',
          p: { xs: 0.5, md: 1.5 },
          mb: 1
        }}>
          {selectedCategory ? (
            <Box>
              <Typography variant="h6" fontWeight="400" sx={{ mb: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                {selectedCategory}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                {filteredProducts.length} products
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" fontWeight="400" sx={{ mb: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                All Products
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                {products.length} products
              </Typography>
            </Box>
          )}
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