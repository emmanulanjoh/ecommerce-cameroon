import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Button,
  Chip,
  FormControlLabel,
  Switch,
  Paper,
  Collapse,
  IconButton
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';
import axios from 'axios';

interface SearchFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  featured: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000000,
    inStock: false,
    featured: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [categories] = useState<string[]>(['Electronics', 'Clothing', 'Home', 'Books', 'Sports']);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    };
    onSearch(searchFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000000,
      inStock: false,
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'desc' as 'desc'
    };
    setFilters(clearedFilters);
    setPriceRange([0, 1000000]);
    onSearch(clearedFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          Search
        </Button>
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterList />
        </IconButton>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              label="Sort By"
            >
              <MenuItem value="createdAt">Newest</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="nameEn">Name</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.sortOrder}
              onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
              label="Order"
            >
              <MenuItem value="desc">High to Low</MenuItem>
              <MenuItem value="asc">Low to High</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as number[])}
            valueLabelDisplay="auto"
            valueLabelFormat={formatPrice}
            min={0}
            max={1000000}
            step={10000}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
              />
            }
            label="In Stock Only"
          />
          <FormControlLabel
            control={
              <Switch
                checked={filters.featured}
                onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
              />
            }
            label="Featured Only"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleSearch} startIcon={<Search />}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={handleClearFilters} startIcon={<Clear />}>
            Clear All
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AdvancedSearch;