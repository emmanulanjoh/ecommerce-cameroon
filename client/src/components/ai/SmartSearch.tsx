import React, { useState, useEffect } from 'react';
import { TextField, Box, Chip, IconButton, InputAdornment } from '@mui/material';
import { Search, Mic, CameraAlt, Clear } from '@mui/icons-material';
import { Product } from '../../types';

interface SmartSearchProps {
  onSearch: (query: string) => void;
  products: Product[];
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onSearch, products }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Smart suggestions based on products
  useEffect(() => {
    if (query.length > 1) {
      const productSuggestions = products
        .filter(p => 
          p.nameEn.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(p => p.nameEn);
      
      setSuggestions(Array.from(new Set(productSuggestions)));
    } else {
      setSuggestions([]);
    }
  }, [query, products]);

  // Voice search
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        onSearch(transcript);
      };
      recognition.start();
    }
  };

  // Visual search (placeholder)
  const handleVisualSearch = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // TODO: Implement visual search with AI
        alert('Visual search coming soon!');
      }
    };
    input.click();
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setSuggestions([]);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
        placeholder="Search products... (try voice or image search)"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleVoiceSearch} color={isListening ? 'error' : 'default'}>
                <Mic />
              </IconButton>
              <IconButton onClick={handleVisualSearch}>
                <CameraAlt />
              </IconButton>
              {query && (
                <IconButton onClick={() => { setQuery(''); onSearch(''); }}>
                  <Clear />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        sx={{ borderRadius: 3 }}
      />
      
      {suggestions.length > 0 && (
        <Box sx={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          bgcolor: 'white', 
          boxShadow: 2, 
          borderRadius: 2, 
          p: 2, 
          zIndex: 1000,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1
        }}>
          {suggestions.map((suggestion, index) => (
            <Chip
              key={index}
              label={suggestion}
              onClick={() => handleSearch(suggestion)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SmartSearch;