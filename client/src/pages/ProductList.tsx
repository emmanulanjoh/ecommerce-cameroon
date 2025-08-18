import React, { useState, useEffect, useMemo } from 'react';
import { Button, Form, InputGroup, Badge, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import axios from 'axios';
import { Product } from '../types';
import ProductForm from './admin/ProductForm';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);



  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products...');
      
      const response = await axios.get('/api/products');
      console.log('API Response:', response.data);
      
      let productsData = [];
      if (response.data.products) {
        productsData = response.data.products;
      } else if (Array.isArray(response.data)) {
        productsData = response.data;
      }
      
      console.log('Setting products:', productsData);
      setProducts(productsData);
      
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(`Failed to load products: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        await axios.delete(`/api/products/${id}`, config);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleProductSaved = (savedProduct: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, savedProduct]);
      setShowAddForm(false);
    }
  };

  const ActionsCellRenderer = (props: any) => {
    return (
      <div className="d-flex gap-1">
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={() => handleEdit(props.data)}
        >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={() => handleDelete(props.data._id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
    );
  };

  const StatusCellRenderer = (props: any) => {
    return (
      <div>
        {props.data.inStock ? (
          <Badge bg="success">In Stock</Badge>
        ) : (
          <Badge bg="danger">Out of Stock</Badge>
        )}
        {props.data.featured && (
          <Badge bg="warning" className="ms-1">Featured</Badge>
        )}
      </div>
    );
  };

  const PriceCellRenderer = (props: any) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(props.value || 0);
  };

  const DateCellRenderer = (props: any) => {
    return props.value ? new Date(props.value).toLocaleDateString() : '';
  };

  const ImageCellRenderer = (props: any) => {
    const imageUrl = props.data.thumbnailImage || (props.data.images && props.data.images[0]) || 'https://via.placeholder.com/50x50?text=No+Image';
    return (
      <img 
        src={imageUrl} 
        alt={props.data.nameEn}
        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://via.placeholder.com/50x50?text=No+Image';
        }}
      />
    );
  };

  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Image',
      cellRenderer: ImageCellRenderer,
      width: 80,
      sortable: false,
      filter: false,
      pinned: 'left'
    },
    {
      headerName: 'Name',
      field: 'nameEn',
      sortable: true,
      filter: true,
      flex: 2,
      minWidth: 200
    },
    {
      headerName: 'Category',
      field: 'category',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120
    },
    {
      headerName: 'Price',
      field: 'price',
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: PriceCellRenderer,
      flex: 1,
      minWidth: 120
    },
    {
      headerName: 'Stock',
      field: 'stockQuantity',
      sortable: true,
      filter: 'agNumberColumnFilter',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Status',
      field: 'inStock',
      cellRenderer: StatusCellRenderer,
      flex: 1,
      minWidth: 150,
      sortable: false,
      filter: false
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      sortable: true,
      cellRenderer: DateCellRenderer,
      flex: 1,
      minWidth: 120
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
      flex: 1,
      minWidth: 120,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ], [ActionsCellRenderer]);

  const filteredProducts = useMemo(() => {
    console.log('Filtering products:', products);
    if (!searchTerm) return products;
    return products.filter(product => 
      product.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.nameFr && product.nameFr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

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
      
      <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          rowData={filteredProducts}
          columnDefs={columnDefs}
          loading={loading}
          pagination={true}
          paginationPageSize={20}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true
          }}
          animateRows={true}
          rowSelection="single"
          suppressRowClickSelection={true}
          noRowsOverlayComponent={() => <div className="p-4 text-center">No products to display</div>}
        />
      </div>
    </div>
  );
};

export default ProductList;