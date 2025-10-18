import React, { useState, useEffect, useRef } from 'react';
import { 
  TextField, 
  Autocomplete, 
  Box, 
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SmartSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ 
  onSearch, 
  placeholder = "Search products..." 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length >= 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      
      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.suggestions || []);
          }
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      loading={loading}
      value={query}
      onInputChange={(_, newValue) => setQuery(newValue || '')}
      onChange={(_, value) => {
        if (value) {
          handleSearch(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#FF9900' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setQuery('');
                      setSuggestions([]);
                    }}
                  >
                    <Clear />
                  </IconButton>
                )}
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
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Search sx={{ mr: 1, color: '#999' }} />
          <Typography>{option}</Typography>
        </Box>
      )}
      sx={{
        '& .MuiAutocomplete-paper': {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    />
  );
};

export default SmartSearch;