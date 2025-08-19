import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Typography, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductPageLayout from '../components/products/ProductPageLayout';
import ProductFilters from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';
import { Product } from '../types';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
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
      
      const response = await axios.get('/api/products');
      const productsData = response.data.products || response.data || [];
      
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
      <ProductPageLayout loading={loading} setLoading={setLoading}>
        <ProductPageLayout.Header>
          <Box sx={{ 
            textAlign: 'center',
            backgroundImage: 'url(https://via.placeholder.com/1200x300/667eea/ffffff?text=Products+Background)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 3,
            p: 4
          }}>
            <Typography variant="h3" fontWeight="700" sx={{ mb: 2 }}>
              Discover Amazing Products
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Find the perfect products for your needs from our curated collection
            </Typography>
          </Box>
        </ProductPageLayout.Header>

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <ProductPageLayout.Sidebar>
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
          </ProductPageLayout.Sidebar>

          <ProductPageLayout.Content>
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              selectedCategory={selectedCategory}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onRefresh={fetchProducts}
            />
          </ProductPageLayout.Content>
        </Box>
      </ProductPageLayout>
    </ThemeProvider>
  );
};

export default PublicProductList;