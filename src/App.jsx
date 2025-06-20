import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import GoogleAnalytics from './components/GoogleAnalytics';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

// Component to handle role-based navigation after login
const AuthNavigationHandler = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role) {
      const currentPath = window.location.pathname;
      
      // Only redirect if user is on login/register pages
      if (currentPath === '/login' || currentPath === '/register') {
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (user.role === 'moderator') {
          navigate('/moderator', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, navigate]);

  return null;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavigationHandler />
      
      {/* Analytics Tracking */}
      <GoogleAnalytics measurementId="G-LHPMN5R02J" />
      
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute requiredRole={['admin', 'moderator']}>
              <Analytics />
            </ProtectedRoute>
          } />
          
          {/* Moderator Routes */}
          <Route path="/moderator" element={
            <ProtectedRoute requiredRole={['admin', 'moderator']}>
              <ModeratorDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </motion.main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AnalyticsProvider>
          <AppContent />
        </AnalyticsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;