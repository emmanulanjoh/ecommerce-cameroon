import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sanitize error data to prevent log injection
    const sanitizedError = error.message?.replace(/[\r\n\t]/g, ' ').substring(0, 200) || 'Unknown error';
    const sanitizedStack = errorInfo.componentStack?.replace(/[\r\n\t]/g, ' ').substring(0, 300) || 'No stack trace';
    console.error(`[ErrorBoundary] React error caught - Error: ${sanitizedError}, Component: ${sanitizedStack}, Timestamp: ${new Date().toISOString()}`);
    const sanitizedErrorName = error.name?.replace(/[\r\n\t]/g, ' ').substring(0, 50) || 'Unknown';
    console.error(`[ErrorBoundary] Error name: ${sanitizedErrorName}, URL: ${window.location.href}`);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            p: 3
          }}
        >
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: 500,
              width: '100%'
            }}
          >
            <BugReport sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReload}
            >
              Refresh Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;