import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  count: number;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [editCategoryId, setEditCategoryId] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAddModal = () => {
    setModalMode('add');
    setCurrentCategory('');
    setShowModal(true);
  };

  const handleShowEditModal = (category: Category) => {
    setModalMode('edit');
    setCurrentCategory(category.name);
    setEditCategoryId(category._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      if (!currentCategory.trim()) {
        setError('Category name cannot be empty');
        return;
      }

      if (modalMode === 'add') {
        // In a real app, this would be an API call to create a category
        // await axios.post('/api/categories', { name: currentCategory });
        
        // For now, just add it to the local state
        const newCategory: Category = {
          _id: Date.now().toString(),
          name: currentCategory,
          count: 0
        };
        setCategories([...categories, newCategory]);
        setSuccess('Category added successfully');
      } else {
        // In a real app, this would be an API call to update a category
        // await axios.put(`/api/categories/${editCategoryId}`, { name: currentCategory });
        
        // For now, just update the local state
        const updatedCategories = categories.map(cat => 
          cat._id === editCategoryId ? { ...cat, name: currentCategory } : cat
        );
        setCategories(updatedCategories);
        setSuccess('Category updated successfully');
      }
      
      handleCloseModal();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error saving category:', err);
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // In a real app, this would be an API call
        // await axios.delete(`/api/categories/${categoryId}`);
        
        // For now, just update the local state
        const updatedCategories = categories.filter(cat => cat._id !== categoryId);
        setCategories(updatedCategories);
        setSuccess('Category deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        console.error('Error deleting category:', err);
        setError(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">Category Management</Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h5>Categories</h5>
            <Button variant="primary" onClick={handleShowAddModal}>
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Category
            </Button>
          </div>
          
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}
          
          {loading ? (
            <p className="text-center">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted py-5">No categories found</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.count}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleShowEditModal(category)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(category._id)}
                        disabled={category.count > 0}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* Add/Edit Category Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Add New Category' : 'Edit Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control 
              type="text" 
              value={currentCategory}
              onChange={(e) => setCurrentCategory(e.target.value)}
              placeholder="Enter category name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalMode === 'add' ? 'Add Category' : 'Update Category'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManagement;