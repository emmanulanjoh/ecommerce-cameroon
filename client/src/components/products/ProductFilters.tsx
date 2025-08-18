import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Button,
  Stack,
  Slider,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Clear, 
  ExpandMore,
  PhoneAndroid,
  Checkroom,
  Home,
  Face,
  SportsEsports,
  DirectionsCar,
  MenuBook,
  Toys,
  HealthAndSafety,
  Restaurant
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (inStock: boolean) => void;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
  onClearFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState<string | false>('search');

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'Electronics': <PhoneAndroid />,
      'Clothing': <Checkroom />,
      'Home & Kitchen': <Home />,
      'Beauty & Personal Care': <Face />,
      'Sports & Outdoors': <SportsEsports />,
      'Automotive': <DirectionsCar />,
      'Books & Media': <MenuBook />,
      'Toys & Games': <Toys />,
      'Health & Wellness': <HealthAndSafety />,
      'Groceries & Food': <Restaurant />
    };
    return iconMap[category] || <PhoneAndroid />;
  };

  if (isMobile) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="600">
            Filters
          </Typography>
        </Box>

        {/* Search Accordion */}
        <Accordion expanded={expanded === 'search'} onChange={handleAccordionChange('search')} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Search</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </AccordionDetails>
        </Accordion>

        {/* Categories Accordion */}
        <Accordion expanded={expanded === 'categories'} onChange={handleAccordionChange('categories')} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Categories</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  icon={getCategoryIcon(category)}
                  label={category}
                  onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Price Range Accordion */}
        <Accordion expanded={expanded === 'price'} onChange={handleAccordionChange('price')} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Price Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 2, py: 1 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                p: 3,
                color: 'white',
                mb: 2
              }}>
                <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.9 }}>
                  Selected Range
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="700">
                      {priceRange[0].toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>XAF</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mx: 2, opacity: 0.8 }}>to</Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="700">
                      {priceRange[1].toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>XAF</Typography>
                  </Box>
                </Box>
              </Box>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={50}
                max={50000000}
                step={10000}
                valueLabelFormat={(value) => `${value.toLocaleString()} XAF`}
                sx={{
                  '& .MuiSlider-thumb': {
                    width: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)',
                    }
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: 6,
                    borderRadius: 3,
                  },
                  '& .MuiSlider-rail': {
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#e0e0e0',
                  }
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Options Accordion */}
        <Accordion expanded={expanded === 'options'} onChange={handleAccordionChange('options')} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Switch
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  color="primary"
                />
              }
              label="In Stock Only"
            />
          </AccordionDetails>
        </Accordion>

        {/* Clear Filters */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Clear />}
          onClick={onClearFilters}
          sx={{
            borderRadius: 2,
            py: 1.5,
            borderColor: 'grey.300',
            color: 'text.secondary',
          }}
        >
          Clear All Filters
        </Button>
      </Box>
    );
  }

  // Desktop version (original)
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterList sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="600">
          Filters
        </Typography>
      </Box>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </motion.div>

      <Divider sx={{ mb: 3 }} />

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
          Categories
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              icon={getCategoryIcon(category)}
              label={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Stack>
      </motion.div>

      <Divider sx={{ mb: 3 }} />

      {/* Price Range */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
          Price Range (XAF)
        </Typography>
        <Box sx={{ px: 1, mb: 3 }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 3,
            color: 'white',
            mb: 3
          }}>
            <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.9 }}>
              Selected Range
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="700">
                  {priceRange[0].toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>XAF</Typography>
              </Box>
              <Typography variant="body2" sx={{ mx: 2, opacity: 0.8 }}>to</Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="700">
                  {priceRange[1].toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>XAF</Typography>
              </Box>
            </Box>
          </Box>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={50}
            max={50000000}
            step={10000}
            valueLabelFormat={(value) => `${value.toLocaleString()} XAF`}
            sx={{
              '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)',
                }
              },
              '& .MuiSlider-track': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                height: 6,
                borderRadius: 3,
              },
              '& .MuiSlider-rail': {
                height: 6,
                borderRadius: 3,
                backgroundColor: '#e0e0e0',
              }
            }}
          />
        </Box>
      </motion.div>

      <Divider sx={{ mb: 3 }} />

      {/* In Stock Only */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              color="primary"
            />
          }
          label="In Stock Only"
          sx={{ mb: 3 }}
        />
      </motion.div>

      {/* Clear Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Clear />}
          onClick={onClearFilters}
          sx={{
            borderRadius: 2,
            py: 1.5,
            borderColor: 'grey.300',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              transform: 'translateY(-2px)',
              boxShadow: 2,
            },
            transition: 'all 0.2s ease',
          }}
        >
          Clear All Filters
        </Button>
      </motion.div>
    </Box>
  );
};

export default ProductFilters;