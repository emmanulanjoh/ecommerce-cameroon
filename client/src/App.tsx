import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import PageTransition from './components/animations/PageTransition';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './features/auth';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import ProtectedRoute from './shared/components/common/ProtectedRoute';
// Layout Components
import ModernHeader from './components/layout/ModernHeader';
import ModernFooter from './components/layout/ModernFooter';
// Pages
import ModernHome from './pages/ModernHome';
import { PublicProductList } from './features/products';
import ModernProductDetail from './features/products/ModernProductDetail';
import ModernAbout from './pages/ModernAbout';
import ModernContact from './pages/ModernContact';
import ModernFAQ from './pages/ModernFAQ';
import NotFound from './pages/NotFound';
import { Admin, AdminLogin } from './features/admin';
import { UserAuth } from './features/auth';
import ModernLogin from './features/auth/ModernLogin';
import ModernRegister from './features/auth/ModernRegister';
import AuthSuccess from './pages/AuthSuccess';
import UserDashboard from './pages/UserDashboard';
import AdminAccess from './pages/AdminAccess';
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Custom CSS
import './App.css';
import './styles/admin-responsive.css';

// Footer visibility context
interface FooterContextType {
  showFooter: boolean;
  setShowFooter: (show: boolean) => void;
}

const FooterContext = createContext<FooterContextType>({
  showFooter: true,
  setShowFooter: () => {}
});

export const useFooter = () => useContext(FooterContext);

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
            <ModernProductDetail />
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
            <ModernLogin />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <ModernRegister />
          </PageTransition>
        } />
        <Route path="/auth/success" element={
          <PageTransition>
            <AuthSuccess />
          </PageTransition>
        } />
        <Route path="/auth" element={
          <PageTransition>
            <UserAuth />
          </PageTransition>
        } />
        <Route path="/dashboard" element={
          <PageTransition>
            <UserDashboard />
          </PageTransition>
        } />
        <Route path="/admin-access" element={
          <PageTransition>
            <AdminAccess />
          </PageTransition>
        } />
        {/* Admin Login - No header/footer */}
        <Route path="/admin/login" element={
          <PageTransition>
            <AdminLogin />
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
  const [showFooter, setShowFooter] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FooterContext.Provider value={{ showFooter, setShowFooter }}>
        <AuthProvider>
          <UserProvider>
            <CartProvider>
              <RecentlyViewedProvider>
                <LanguageProvider>
                  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AppLayout />
                  </Router>
                </LanguageProvider>
              </RecentlyViewedProvider>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </FooterContext.Provider>
    </ThemeProvider>
  );
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { showFooter } = useFooter();
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
      {showFooter && <ModernFooter />}
    </>
  );
};

export default App;