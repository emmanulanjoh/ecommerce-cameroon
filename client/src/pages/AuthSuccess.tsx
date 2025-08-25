import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../features/auth/UserContext';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      // Store token and redirect
      localStorage.setItem('userToken', token);
      
      // Redirect to home page
      navigate('/');
    } else {
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
      <Typography variant="h6" color="white">
        Completing sign in...
      </Typography>
    </Box>
  );
};

export default AuthSuccess;