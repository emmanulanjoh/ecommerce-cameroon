import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import PageTransition from './components/animations/PageTransition';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layout Components
import ModernHeader from './components/layout/ModernHeader';
import ModernFooter from './components/layout/ModernFooter';

// Pages
import ModernHome from './pages/ModernHome';
import PublicProductList from './pages/PublicProductList';
import ProductDetail from './pages/ProductDetail';
import ModernAbout from './pages/ModernAbout';
import ModernContact from './pages/ModernContact';
import ModernFAQ from './pages/ModernFAQ';
import NotFound from './pages/NotFound';
import Admin from './components/common/Admin';
import Login from './pages/Login';
import AdminAccess from './pages/AdminAccess';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Custom CSS
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
});

// Animated routes component with AnimatePresence
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <ModernHome />
          </PageTransition>
        } />
        <Route path="/products" element={
          <PageTransition>
            <PublicProductList />
          </PageTransition>
        } />
        <Route path="/products/:id" element={
          <PageTransition>
            <Container>
              <ProductDetail />
            </Container>
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <ModernAbout />
          </PageTransition>
        } />
        <Route path="/contact" element={
          <PageTransition>
            <ModernContact />
          </PageTransition>
        } />
        <Route path="/faq" element={
          <PageTransition>
            <ModernFAQ />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <Container>
              <Login />
            </Container>
          </PageTransition>
        } />
        <Route path="/admin-access" element={
          <PageTransition>
            <Container>
              <AdminAccess />
            </Container>
          </PageTransition>
        } />
        {/* Admin Routes - No header/footer */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <PageTransition>
              <Admin />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <PageTransition>
            <Container>
              <NotFound />
            </Container>
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <Router>
              <AppLayout />
            </Router>
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    // Admin routes without header/footer
    return (
      <main>
        <AnimatedRoutes />
      </main>
    );
  }
  
  // Regular routes with header/footer
  return (
    <>
      <ModernHeader />
      <main>
        <AnimatedRoutes />
      </main>
      <ModernFooter />
    </>
  );
};

export default App;