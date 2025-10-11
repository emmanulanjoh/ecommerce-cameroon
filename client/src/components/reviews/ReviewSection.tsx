import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Rating, Button, TextField, Card, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';
import axios from 'axios';
import { useUser } from '../../features/auth';

interface Review {
  _id: string;
  user: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`/api/reviews/product/${productId}`);
      setReviews(response.data.reviews);
      setAvgRating(response.data.avgRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const { isAuthenticated, token } = useUser();

  const submitReview = async () => {
    try {
      if (!isAuthenticated || !token) {
        alert('Please login to write a review');
        return;
      }
      
      console.log('Submitting review with token:', token ? 'Present' : 'Missing');
      
      const response = await axios.post('/api/reviews', {
        product: productId,
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Review submitted successfully:', response.data);
      setShowForm(false);
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error: any) {
      // Sanitize error message to prevent log injection
      const rawError = error.response?.data || error.message || 'Unknown error';
      const isString = typeof rawError === 'string';
      const cleanError = isString ? rawError.replace(/[\r\n\t]/g, ' ').substring(0, 200) : 'Error object';
      console.error('[ReviewSection] Review submission failed for product:', productId, 'Error:', cleanError);
      alert(error.response?.data?.message || 'Failed to submit review. Please try logging in again.');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Rating value={avgRating} readOnly precision={0.1} />
        <Typography variant="body1">
          {avgRating.toFixed(1)} ({totalReviews} reviews)
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        onClick={() => {
          if (!isAuthenticated) {
            alert('Please login to write a review');
            return;
          }
          setShowForm(!showForm);
        }}
        sx={{ mb: 3 }}
      >
        Write a Review
      </Button>

      {showForm && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Write Your Review</Typography>
          <Rating
            value={newReview.rating}
            onChange={(_, value) => setNewReview({ ...newReview, rating: value || 5 })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Share your experience..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={submitReview}>
              Submit Review
            </Button>
            <Button variant="outlined" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </Box>
        </Card>
      )}

      {reviews.map((review) => (
        <Card key={review._id} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar><Person /></Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="600">
                {review.user.name}
              </Typography>
              <Rating value={review.rating} readOnly size="small" />
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {review.comment}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(review.createdAt).toLocaleDateString()}
          </Typography>
        </Card>
      ))}
    </Box>
  );
};

export default ReviewSection;