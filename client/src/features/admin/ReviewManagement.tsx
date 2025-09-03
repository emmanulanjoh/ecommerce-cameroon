import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Rate, Typography, Space, message } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

interface Review {
  _id: string;
  user: { name: string; email: string; };
  product: { nameEn: string; };
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/reviews/admin/all');
      setReviews(response.data || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      message.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await axios.delete(`/api/reviews/admin/${reviewId}`);
      message.success('Review deleted successfully');
      fetchReviews();
    } catch (error: any) {
      message.error('Failed to delete review');
    }
  };

  const columns = [
    { title: 'Product', dataIndex: ['product', 'nameEn'], render: (name: string) => <Text strong>{name}</Text> },
    { title: 'Customer', dataIndex: ['user', 'name'] },
    { title: 'Rating', dataIndex: 'rating', render: (rating: number) => <Rate disabled value={rating} /> },
    { title: 'Comment', dataIndex: 'comment', render: (comment: string) => <Text>{comment.substring(0, 50)}...</Text> },
    { title: 'Status', dataIndex: 'verified', render: (verified: boolean) => <Tag color={verified ? 'green' : 'orange'}>{verified ? 'Verified' : 'Pending'}</Tag> },
    { title: 'Date', dataIndex: 'createdAt', render: (date: string) => new Date(date).toLocaleDateString() },
    { 
      title: 'Actions', 
      render: (_: any, record: Review) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => { setSelectedReview(record); setModalVisible(true); }}>View</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => deleteReview(record._id)}>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card>
        <Title level={3}>Review Management</Title>
        <Text>Total reviews: {reviews.length}</Text>
        <Table columns={columns} dataSource={reviews} rowKey="_id" loading={loading} />
      </Card>

      <Modal title="Review Details" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        {selectedReview && (
          <div>
            <p><strong>Product:</strong> {selectedReview.product.nameEn}</p>
            <p><strong>Customer:</strong> {selectedReview.user.name} ({selectedReview.user.email})</p>
            <p><strong>Rating:</strong> <Rate disabled value={selectedReview.rating} /></p>
            <p><strong>Comment:</strong> {selectedReview.comment}</p>
            <p><strong>Date:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <Tag color={selectedReview.verified ? 'green' : 'orange'}>{selectedReview.verified ? 'Verified' : 'Pending'}</Tag></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewManagement;