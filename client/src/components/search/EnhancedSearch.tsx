import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Divider,
  InputAdornment,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Search,
  Clear,
  TrendingUp,
  History,
  MicNone,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({ 
  placeholder = "Search products...",
  onSearch,
  autoFocus = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      // Show trending for short queries
      try {
        const { data } = await axios.get('/api/search-enhanced/trending?limit=8');
        setTrending(data.trending);
        setSuggestions([]);
        setProducts([]);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      }
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`/api/search-enhanced/suggestions?q=${encodeURIComponent(searchQuery)}`);
      setSuggestions(data.suggestions || []);
      setProducts(data.products || []);
      setTrending(data.trending || []);
      setRecent(data.recent || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
      setProducts([]);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  // Handle search execution
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Track search
    try {
      await axios.post('/api/search-enhanced/track', {
        query: searchQuery,
        resultCount: products.length,
        language: 'en'
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }

    setShowDropdown(false);
    if (onSearch) {
      onSearch(searchQuery);
    }
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  // Handle product click
  const handleProductClick = async (product: Product) => {
    try {
      await axios.post('/api/search-enhanced/click', {
        query: query,
        productId: product.id
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    setShowDropdown(false);
    navigate(`/products/${product.id}`);
  };

  // Handle voice search
  const handleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setProducts([]);
    inputRef.current?.focus();
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <TextField
        inputRef={inputRef}
        fullWidth
        placeholder={placeholder}
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch(query);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#FF9900' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {loading && <CircularProgress size={20} />}
                {recognitionRef.current && (
                  <IconButton
                    size="small"
                    onClick={handleVoiceSearch}
                    sx={{ 
                      color: isListening ? '#FF0000' : '#666',
                      animation: isListening ? 'pulse 1.5s infinite' : 'none'
                    }}
                  >
                    <MicNone />
                  </IconButton>
                )}
                {query && (
                  <IconButton size="small" onClick={handleClear}>
                    <Clear />
                  </IconButton>
                )}
              </Box>
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'white',
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ddd',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF9900',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF9900',
            }
          }
        }}
      />

      {/* Dropdown with suggestions */}
      {showDropdown && (query || trending.length > 0) && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: '500px',
            overflowY: 'auto',
            zIndex: 1000,
            borderRadius: '8px'
          }}
        >
          {/* Product suggestions */}
          {products.length > 0 && (
            <>
              <Box sx={{ px: 2, py: 1, bgcolor: '#f5f5f5' }}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary">
                  PRODUCTS
                </Typography>
              </Box>
              <List sx={{ py: 0 }}>
                {products.map((product) => (
                  <ListItem
                    key={product.id}
                    button
                    onClick={() => handleProductClick(product)}
                    sx={{
                      '&:hover': { bgcolor: '#f9f9f9' },
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={product.image}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={product.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {product.category}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {new Intl.NumberFormat('fr-CM', {
                              style: 'currency',
                              currency: 'XAF'
                            }).format(product.price)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Divider />
            </>
          )}

          {/* Text suggestions */}
          {suggestions.length > 0 && (
            <>
              <Box sx={{ px: 2, py: 1, bgcolor: '#f5f5f5' }}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary">
                  SUGGESTIONS
                </Typography>
              </Box>
              <List sx={{ py: 1 }}>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSearch(suggestion)}
                    sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}
                  >
                    <Search sx={{ mr: 2, color: '#999', fontSize: 20 }} />
                    <ListItemText 
                      primary={suggestion}
                      primaryTypographyProps={{ fontSize: '0.95rem' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider />
            </>
          )}

          {/* Recent searches */}
          {recent.length > 0 && (
            <>
              <Box sx={{ px: 2, py: 1, bgcolor: '#f5f5f5' }}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary">
                  RECENT SEARCHES
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {recent.map((item, index) => (
                  <Chip
                    key={index}
                    icon={<History fontSize="small" />}
                    label={item}
                    size="small"
                    onClick={() => handleSearch(item)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
              <Divider />
            </>
          )}

          {/* Trending searches */}
          {trending.length > 0 && (
            <>
              <Box sx={{ px: 2, py: 1, bgcolor: '#f5f5f5' }}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary">
                  TRENDING SEARCHES
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {trending.map((item, index) => (
                  <Chip
                    key={index}
                    icon={<TrendingUp fontSize="small" />}
                    label={item}
                    size="small"
                    onClick={() => handleSearch(item)}
                    color="primary"
                    variant="outlined"
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </>
          )}
        </Paper>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};

export default EnhancedSearch;
