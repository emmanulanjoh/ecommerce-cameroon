import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import AuthContext from '../../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Checking authentication...</p>
        </div>
      </Container>
    );
  }
  
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;