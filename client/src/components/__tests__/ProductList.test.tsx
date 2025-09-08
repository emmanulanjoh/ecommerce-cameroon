import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ProductList from '../../features/products/ProductList';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockProducts = [
  {
    _id: '1',
    nameEn: 'Test Product',
    category: 'Electronics',
    price: 100,
    stockQuantity: 10,
    inStock: true,
    featured: false,
    createdAt: '2023-01-01'
  }
];

describe('ProductList', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders product list', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('filters products by search term', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'Electronics' } });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load products/)).toBeInTheDocument();
    });
  });
});