import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 12
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      gap: 2, 
      mt: 4 
    }}>
      {totalItems && (
        <Typography variant="body2" color="text.secondary">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          startIcon={<ChevronLeft />}
        >
          Previous
        </Button>

        {getVisiblePages().map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? 'contained' : 'outlined'}
            size="small"
            disabled={page === '...'}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            sx={{ minWidth: 40 }}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          endIcon={<ChevronRight />}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Pagination;