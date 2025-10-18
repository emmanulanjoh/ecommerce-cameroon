import React, { useState } from 'react';
import { Card, Upload, Button, message, List, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

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

  React.useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const uploadProps: UploadProps = {
    name: 'video',
    accept: 'video/*',
    beforeUpload: async (file) => {
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('You can only upload video files!');
        return false;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('Video must be smaller than 100MB!');
        return false;
      }
      
      setUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('video', file);
        
        console.log('Uploading video:', file.name, 'Size:', file.size);
        
        const response = await fetch('/api/videos/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
          setVideos(prev => [...prev, result]);
          message.success('Video uploaded to S3 successfully!');
          console.log('Video upload successful:', result);
        } else {
          console.error('Upload failed:', result);
          message.error(`Upload failed: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        message.error('Upload error!');
      } finally {
        setUploading(false);
      }
      
      return false;
    },
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        setVideos(prev => prev.filter(video => video._id !== id));
        message.success('Video deleted from S3 successfully!');
      } else {
        const result = await response.json();
        message.error(`Delete failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Delete error!');
    }
  };

  return (
    <div>
      <Card 
        title={<><UploadOutlined /> Video Management</>}
        extra={
          <Upload {...uploadProps}>
            <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
              {uploading ? 'Uploading to S3...' : 'Upload Video'}
            </Button>
          </Upload>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={videos}
          renderItem={(video) => (
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  icon={<PlayCircleOutlined />}
                  onClick={() => window.open(video.s3Url, '_blank')}
                >
                  Preview
                </Button>,
                <Popconfirm
                  title="Are you sure you want to delete this video?"
                  onConfirm={() => handleDelete(video._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                title={video.filename}
                description={`Uploaded on ${new Date(video.uploadDate).toLocaleDateString()} • ${(video.fileSize / 1024 / 1024).toFixed(1)} MB`}
              />
            </List.Item>
          )}
        />
        
        {videos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            No videos uploaded yet. Click "Upload Video" to add your first video.
          </div>
        )}
      </Card>
    </div>
  );
};

export default VideoManager;