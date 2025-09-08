import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Container, Button } from 'react-bootstrap';
import { sanitizeForLog } from '../../utils/sanitize';

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
    console.error('ErrorBoundary caught an error:', sanitizeForLog(error.message));
    console.error('Error details:', sanitizeForLog(JSON.stringify(errorInfo)));
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong!</Alert.Heading>
            <p>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button onClick={this.handleReload} variant="outline-danger">
                Refresh Page
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;