import React, { useState } from 'react';
import { Box } from '@mui/material';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  fallback?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  style,
  fallback = '/images/placeholder.jpg'
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      onError={handleError}
      sx={{
        width,
        height,
        objectFit: 'cover',
        backgroundColor: '#f5f5f5',
        ...style
      }}
    />
  );
};

export default SafeImage;