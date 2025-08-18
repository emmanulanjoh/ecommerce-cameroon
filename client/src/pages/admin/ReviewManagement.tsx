import React, { useState, useEffect } from 'react';
import { Button, Badge, Alert, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEye, faRefresh } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface Review {
  _id: string;
  productId: string;
  username: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get('/api/reviews/all', config);
      setReviews(response.data || []);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(`Failed to load reviews: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.put(`/api/reviews/${reviewId}/approve`, {}, config);
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, isApproved: true } : review
      ));
    } catch (err) {
      console.error('Error approving review:', err);
      alert('Failed to approve review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        await axios.delete(`/api/reviews/${reviewId}`, config);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (err) {
        console.error('Error deleting review:', err);
        alert('Failed to delete review');
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fbbf24' : '#d1d5db' }}>★</span>
    ));
  };

  const pendingReviews = reviews.filter(review => !review.isApproved);
  const approvedReviews = reviews.filter(review => review.isApproved);

  if (loading) {
    return <Alert variant="info">Loading reviews...</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Review Management</h2>
        <Button variant="outline-secondary" onClick={fetchReviews}>
          <FontAwesomeIcon icon={faRefresh} className="me-2" />
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Pending Reviews */}
      <div className="mb-5">
        <h4 className="mb-3">
          Pending Reviews 
          <Badge bg="warning" className="ms-2">{pendingReviews.length}</Badge>
        </h4>
        
        {pendingReviews.length === 0 ? (
          <Alert variant="info">No pending reviews</Alert>
        ) : (
          pendingReviews.map(review => (
            <Card key={review._id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <strong>{review.username}</strong>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <Badge bg="warning">Pending</Badge>
                </div>
                
                {review.comment && (
                  <p className="mb-3">{review.comment}</p>
                )}
                
                <div className="d-flex gap-2">
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => handleApprove(review._id)}
                  >
                    <FontAwesomeIcon icon={faCheck} className="me-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(review._id)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Approved Reviews */}
      <div>
        <h4 className="mb-3">
          Approved Reviews 
          <Badge bg="success" className="ms-2">{approvedReviews.length}</Badge>
        </h4>
        
        {approvedReviews.length === 0 ? (
          <Alert variant="info">No approved reviews</Alert>
        ) : (
          approvedReviews.map(review => (
            <Card key={review._id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <strong>{review.username}</strong>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <Badge bg="success">Approved</Badge>
                </div>
                
                {review.comment && (
                  <p className="mb-3">{review.comment}</p>
                )}
                
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(review._id)}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;