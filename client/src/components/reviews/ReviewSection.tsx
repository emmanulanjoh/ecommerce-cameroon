import React, { useState, useEffect } from 'react';
import { Box, Typography, Rating, Button, TextField, Card, Avatar, Divider } from '@mui/material';
import { Person } from '@mui/icons-material';
import axios from 'axios';

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

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/product/${productId}`);
      setReviews(response.data.reviews);
      setAvgRating(response.data.avgRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/reviews', {
        product: productId,
        ...newReview
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowForm(false);
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit review');
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
        onClick={() => setShowForm(!showForm)}
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