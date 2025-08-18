import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Alert, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faImage, faVideo, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onProductSaved?: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onProductSaved }) => {
  const [formData, setFormData] = useState({
    nameEn: product?.nameEn || '',
    nameFr: product?.nameFr || '',
    descriptionEn: product?.descriptionEn || '',
    descriptionFr: product?.descriptionFr || '',
    price: product?.price?.toString() || '',
    category: product?.category || 'Electronics',
    images: product?.images || [],
    thumbnailImage: product?.thumbnailImage || '',
    videoUrl: product?.videoUrl || '',
    featured: product?.featured || false,
    inStock: product?.inStock ?? true,
    stockQuantity: product?.stockQuantity?.toString() || '',
    sku: product?.sku || '',
    weight: product?.weight?.toString() || '',
    dimensions: product?.dimensions || { length: '', width: '', height: '' },
    isActive: product?.isActive ?? true,
    condition: product?.condition || 'new',
    conditionGrade: product?.conditionGrade || '',
    warrantyMonths: product?.warrantyMonths?.toString() || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dimensionKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (name === 'images' && files) {
      setImageFiles(files);
    } else if (name === 'video' && files && files[0]) {
      setVideoFile(files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    console.log('Uploading file:', file.name, file.type);
    const response = await axios.post('/api/upload', formData, config);
    console.log('Upload response:', response.data);
    return response.data.originalPath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      let uploadedImages: string[] = [...formData.images];
      let uploadedVideoUrl = formData.videoUrl;
      
      // Upload image files
      if (imageFiles && imageFiles.length > 0) {
        setUploading(true);
        console.log('Uploading', imageFiles.length, 'image files');
        for (let i = 0; i < imageFiles.length; i++) {
          try {
            const imagePath = await uploadFile(imageFiles[i]);
            uploadedImages.push(imagePath);
            console.log('Image uploaded:', imagePath);
          } catch (uploadErr) {
            console.error('Error uploading image:', uploadErr);
            throw new Error(`Failed to upload image: ${imageFiles[i].name}`);
          }
        }
        setUploading(false);
      }
      
      // Upload video file
      if (videoFile) {
        setUploading(true);
        console.log('Uploading video file:', videoFile.name);
        try {
          uploadedVideoUrl = await uploadFile(videoFile);
          console.log('Video uploaded:', uploadedVideoUrl);
        } catch (uploadErr) {
          console.error('Error uploading video:', uploadErr);
          throw new Error(`Failed to upload video: ${videoFile.name}`);
        }
        setUploading(false);
      }
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: formData.dimensions.length || formData.dimensions.width || formData.dimensions.height 
          ? formData.dimensions 
          : undefined,
        images: uploadedImages,
        videoUrl: uploadedVideoUrl,
        condition: formData.condition,
        conditionGrade: formData.conditionGrade || undefined,
        warrantyMonths: formData.warrantyMonths ? parseInt(formData.warrantyMonths) : (formData.warrantyMonths === '' ? undefined : 12)
      };
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      let response;
      if (product) {
        response = await axios.put(`/api/products/${product._id}`, productData, config);
        setSuccess('Product updated successfully!');
      } else {
        response = await axios.post('/api/products', productData, config);
        setSuccess('Product created successfully!');
        
        // Reset form
        setFormData({
          nameEn: '',
          nameFr: '',
          descriptionEn: '',
          descriptionFr: '',
          price: '',
          category: 'Electronics',
          images: [],
          thumbnailImage: '',
          videoUrl: '',
          featured: false,
          inStock: true,
          stockQuantity: '',
          sku: '',
          weight: '',
          dimensions: { length: '', width: '', height: '' },
          isActive: true,
          condition: 'new',
          conditionGrade: '',
          warrantyMonths: ''
        });
        setImageFiles(null);
        setVideoFile(null);
      }
      
      if (onProductSaved) {
        onProductSaved(response.data);
      }
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">{product ? 'Edit Product' : 'Add New Product'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Tab.Container defaultActiveKey="basic">
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="basic">
                <FontAwesomeIcon icon={faCog} className="me-2" />
                Basic Info
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="media">
                <FontAwesomeIcon icon={faImage} className="me-2" />
                Media
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="details">
                <FontAwesomeIcon icon={faCog} className="me-2" />
                Details
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="basic">
              <Card className="mb-4">
                <Card.Header>Product Information</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Product Name (English) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="nameEn"
                          value={formData.nameEn}
                          onChange={handleChange}
                          required
                          placeholder="Enter product name in English"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Product Name (French)</Form.Label>
                        <Form.Control
                          type="text"
                          name="nameFr"
                          value={formData.nameFr}
                          onChange={handleChange}
                          placeholder="Enter product name in French"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description (English) *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="descriptionEn"
                          value={formData.descriptionEn}
                          onChange={handleChange}
                          required
                          placeholder="Enter product description in English"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description (French)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="descriptionFr"
                          value={formData.descriptionFr}
                          onChange={handleChange}
                          placeholder="Enter product description in French"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price (XAF) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="0"
                          step="1"
                          placeholder="0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Home & Kitchen">Home & Kitchen</option>
                          <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                          <option value="Sports & Outdoors">Sports & Outdoors</option>
                          <option value="Automotive">Automotive</option>
                          <option value="Books & Media">Books & Media</option>
                          <option value="Toys & Games">Toys & Games</option>
                          <option value="Health & Wellness">Health & Wellness</option>
                          <option value="Groceries & Food">Groceries & Food</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Stock Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          name="stockQuantity"
                          value={formData.stockQuantity}
                          onChange={handleChange}
                          min="0"
                          placeholder="Enter stock quantity"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Product Options</Form.Label>
                        <div>
                          <Form.Check
                            type="checkbox"
                            label="In Stock"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleChange}
                            className="mb-2"
                          />
                          <Form.Check
                            type="checkbox"
                            label="Featured Product"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="mb-2"
                          />
                          <Form.Check
                            type="checkbox"
                            label="Active"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>SKU</Form.Label>
                        <Form.Control
                          type="text"
                          name="sku"
                          value={formData.sku}
                          onChange={handleChange}
                          placeholder="Enter product SKU"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Condition *</Form.Label>
                        <Form.Select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          required
                        >
                          <option value="new">New</option>
                          <option value="refurbished">Refurbished</option>
                          <option value="used">Used</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Condition Grade</Form.Label>
                        <Form.Select
                          name="conditionGrade"
                          value={formData.conditionGrade}
                          onChange={handleChange}
                          disabled={formData.condition === 'new'}
                        >
                          <option value="">Select Grade</option>
                          <option value="A">Grade A (Excellent)</option>
                          <option value="B">Grade B (Good)</option>
                          <option value="C">Grade C (Fair)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Warranty (Months)</Form.Label>
                        <Form.Control
                          type="number"
                          name="warrantyMonths"
                          value={formData.warrantyMonths}
                          onChange={handleChange}
                          min="0"
                          max="36"
                          placeholder="12"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="media">
              <Card className="mb-4">
                <Card.Header>Product Media</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Images</Form.Label>
                    <Form.Control
                      type="file"
                      name="images"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                    />
                    <Form.Text className="text-muted">
                      Select multiple images for the product gallery
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Thumbnail Image URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="thumbnailImage"
                      value={formData.thumbnailImage}
                      onChange={handleChange}
                      placeholder="Enter thumbnail image URL"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Product Video</Form.Label>
                    <Form.Control
                      type="file"
                      name="video"
                      onChange={handleFileChange}
                      accept="video/*"
                    />
                    <Form.Text className="text-muted">
                      Upload a product demonstration video
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Video URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleChange}
                      placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="details">
              <Card className="mb-4">
                <Card.Header>Product Details</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Weight (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="Enter product weight"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Dimensions (cm)</Form.Label>
                    <Row>
                      <Col md={4}>
                        <Form.Control
                          type="number"
                          name="dimensions.length"
                          value={formData.dimensions.length}
                          onChange={handleChange}
                          placeholder="Length"
                          min="0"
                          step="0.1"
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="number"
                          name="dimensions.width"
                          value={formData.dimensions.width}
                          onChange={handleChange}
                          placeholder="Width"
                          min="0"
                          step="0.1"
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="number"
                          name="dimensions.height"
                          value={formData.dimensions.height}
                          onChange={handleChange}
                          placeholder="Height"
                          min="0"
                          step="0.1"
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading || uploading}
          size="lg"
          className="me-2"
        >
          <FontAwesomeIcon icon={faSave} className="me-2" />
          {uploading ? 'Uploading files...' : loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </Button>
      </Form>
    </div>
  );
};

export default ProductForm;