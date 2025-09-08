import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Button, Form, InputGroup, Badge, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { Product } from '../../shared/types';
import ProductForm from '../admin/ProductForm';
import { sanitizeForLog } from '../../utils/sanitize';





const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout>();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products...');
      
      const response = await axios.get('/api/products');
      console.log('API Response:', sanitizeForLog(JSON.stringify(response.data)));
      
      let productsData = [];
      if (response.data.products) {
        productsData = response.data.products;
      } else if (Array.isArray(response.data)) {
        productsData = response.data;
      }
      
      console.log('Setting products count:', sanitizeForLog(String(productsData.length)));
      setProducts(productsData);
      
    } catch (err: any) {
      console.error('Error fetching products:', sanitizeForLog(err.message));
      setError(`Failed to load products: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);





  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        await axios.delete(`/api/products/${id}`, config);
        setProducts(prev => prev.filter(product => product._id !== id));
      } catch (err: any) {
        console.error('Error deleting product:', sanitizeForLog(err.message));
        alert('Failed to delete product');
      }
    }
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
  }, []);

  const handleProductSaved = useCallback((savedProduct: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p._id === savedProduct._id ? savedProduct : p));
      setEditingProduct(null);
    } else {
      setProducts(prev => [...prev, savedProduct]);
      setShowAddForm(false);
    }
  }, [editingProduct]);





  const filteredProducts = useMemo(() => {
    console.log('Filtering products count:', sanitizeForLog(String(products.length)));
    if (!debouncedSearchTerm) return products;
    const searchLower = debouncedSearchTerm.toLowerCase();
    return products.filter(product => 
      product.nameEn?.toLowerCase().includes(searchLower) ||
      (product.nameFr && product.nameFr.toLowerCase().includes(searchLower)) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  }, [products, debouncedSearchTerm]);

  if (editingProduct) {
    return (
      <div>
        <Button 
          variant="outline-secondary" 
          className="mb-3"
          onClick={() => setEditingProduct(null)}
        >
          Back to Products
        </Button>
        <ProductForm 
          product={editingProduct} 
          onProductSaved={handleProductSaved} 
        />
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div>
        <Button 
          variant="outline-secondary" 
          className="mb-3"
          onClick={() => setShowAddForm(false)}
        >
          Back to Products
        </Button>
        <ProductForm 
          onProductSaved={handleProductSaved} 
        />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management ({products.length} products)</h2>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-secondary"
            onClick={fetchProducts}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faRefresh} className="me-2" />
            Refresh
          </Button>
          <Button 
            variant="primary"
            onClick={() => setShowAddForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Product
          </Button>
        </div>
      </div>
      
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={fetchProducts}>
              Try Again
            </Button>
          </div>
        </Alert>
      )}

      {loading && (
        <Alert variant="info">Loading products...</Alert>
      )}

      {!loading && products.length === 0 && !error && (
        <Alert variant="warning">
          No products found. <Button variant="link" onClick={() => setShowAddForm(true)}>Add your first product</Button>
        </Alert>
      )}
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            
            <th>Stock</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>
                <img 
                  src={product.thumbnailImage || (product.images && product.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyMEMyNi4zODA3IDIwIDI3LjUgMjEuMTE5MyAyNy41IDIyLjVDMjcuNSAyMy44ODA3IDI2LjM4MDcgMjUgMjUgMjVDMjMuNjE5MyAyNSAyMi41IDIzLjg4MDcgMjIuNSAyMi41QzIyLjUgMjEuMTE5MyAyMy42MTkzIDIwIDI1IDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTcuNSAzMEwyMi41IDI1TDI3LjUgMzBIMzIuNUwzNyAyNUw0MiAzMFYzNUgxNy41VjMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'} 
                  alt={product.nameEn}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyMEMyNi4zODA3IDIwIDI3LjUgMjEuMTE5MyAyNy41IDIyLjVDMjcuNSAyMy44ODA3IDI2LjM4MDcgMjUgMjUgMjVDMjMuNjE5MyAyNSAyMi41IDIzLjg4MDcgMjIuNSAyMi41QzIyLjUgMjEuMTE5MyAyMy42MTkzIDIwIDI1IDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTcuNSAzMEwyMi41IDI1TDI3LjUgMzBIMzIuNUwzNyAyNUw0MiAzMFYzNUgxNy41VjMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                  }}
                />
              </td>
              <td>{product.nameEn}</td>
              <td>{product.category}</td>
              <td>{new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(product.price || 0)}</td>
              <td>{product.stockQuantity}</td>
              <td>
                {product.inStock ? (
                  <Badge bg="success">In Stock</Badge>
                ) : (
                  <Badge bg="danger">Out of Stock</Badge>
                )}
                {product.featured && (
                  <Badge bg="warning" className="ms-1">Featured</Badge>
                )}
              </td>
              <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}</td>
              <td>
                <div className="d-flex gap-1">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductList;