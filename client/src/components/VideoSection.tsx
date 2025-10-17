import React, { useState, useEffect } from 'react';

interface Video {
  _id: string;
  filename: string;
  s3Url: string;
  isActive: boolean;
}

const VideoSection: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveVideos();
  }, []);

  const fetchActiveVideos = async () => {
    try {
      const response = await fetch('/api/videos/active');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#E7E9EC',
        borderRadius: '8px',
        padding: '60px 20px',
        textAlign: 'center',
        color: '#565959'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div style={{
        backgroundColor: '#E7E9EC',
        borderRadius: '8px',
        padding: '60px 20px',
        textAlign: 'center',
        color: '#565959'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
        <p>Product Video Coming Soon</p>
        <small>Watch our latest product demonstrations</small>
      </div>
    );
  }

  const activeVideo = videos[0]; // Show first active video

  return (
    <div style={{
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      <video
        controls
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '300px'
        }}
        poster="/images/placeholder.jpg"
      >
        <source src={activeVideo.s3Url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoSection;