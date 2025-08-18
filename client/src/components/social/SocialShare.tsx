import React from 'react';
import { IconButton, Box, Tooltip } from '@mui/material';
import { Facebook, Twitter, WhatsApp, Share } from '@mui/icons-material';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, description, image }) => {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
  };

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Share on Facebook">
        <IconButton
          onClick={() => handleShare('facebook')}
          sx={{ color: '#1877f2', '&:hover': { bgcolor: 'rgba(24, 119, 242, 0.1)' } }}
        >
          <Facebook />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Share on Twitter">
        <IconButton
          onClick={() => handleShare('twitter')}
          sx={{ color: '#1da1f2', '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.1)' } }}
        >
          <Twitter />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Share on WhatsApp">
        <IconButton
          onClick={() => handleShare('whatsapp')}
          sx={{ color: '#25d366', '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.1)' } }}
        >
          <WhatsApp />
        </IconButton>
      </Tooltip>
      
      {'share' in navigator && (
        <Tooltip title="Share">
          <IconButton
            onClick={handleNativeShare}
            sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' } }}
          >
            <Share />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default SocialShare;