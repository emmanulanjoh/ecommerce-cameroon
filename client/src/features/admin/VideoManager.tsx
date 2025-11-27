import React, { useState } from 'react';
import { Card, Button, Alert, ListGroup, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faPlay, faVideo } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface VideoFile {
  _id: string;
  filename: string;
  s3Key: string;
  s3Url: string;
  uploadDate: string;
  isActive: boolean;
  fileSize: number;
}

const VideoManager: React.FC = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  React.useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/videos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setError('Failed to fetch videos');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('Video file must be smaller than 100MB');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setVideos(prev => [response.data, ...prev]);
      setSuccess('Video uploaded successfully!');
      
      // Reset file input
      event.target.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (videoId: string) => {
    setVideoToDelete(videoId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/videos/${videoToDelete}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setVideos(prev => prev.filter(video => video._id !== videoToDelete));
      setSuccess('Video deleted successfully!');
      setShowDeleteModal(false);
      setVideoToDelete(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      setError(error.response?.data?.message || 'Delete failed');
      setShowDeleteModal(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faVideo} className="me-2" />
            Video Management
          </h5>
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="video-upload"
              disabled={uploading}
            />
            <Button
              variant="primary"
              onClick={() => document.getElementById('video-upload')?.click()}
              disabled={uploading}
            >
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

          {videos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faVideo} size="3x" className="mb-3" />
              <p>No videos uploaded yet.</p>
              <p>Click "Upload Video" to add your first promotional video.</p>
            </div>
          ) : (
            <ListGroup>
              {videos.map((video) => (
                <ListGroup.Item key={video._id} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faPlay} className="me-3 text-primary" size="lg" />
                    <div>
                      <h6 className="mb-1">{video.filename}</h6>
                      <small className="text-muted">
                        Uploaded on {formatDate(video.uploadDate)} • {formatFileSize(video.fileSize)}
                      </small>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => window.open(video.s3Url, '_blank')}
                    >
                      <FontAwesomeIcon icon={faPlay} className="me-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(video._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-1" />
                      Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this video? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Video
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VideoManager;