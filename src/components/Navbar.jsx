import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Heart,
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemsCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Men', path: '/products/men' },
    { name: 'Women', path: '/products/women' },
    { name: 'Kids', path: '/products/kids' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/" 
              className={`text-2xl font-bold font-display ${
                isScrolled ? 'text-primary-900' : 'text-white'
              }`}
            >
              KICKY
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <motion.div key={link.name} whileHover={{ y: -2 }}>
                  <Link
                    to={link.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActivePath(link.path)
                        ? isScrolled 
                          ? 'text-gold-600 border-b-2 border-gold-600' 
                          : 'text-gold-400 border-b-2 border-gold-400'
                        : isScrolled
                          ? 'text-primary-700 hover:text-gold-600'
                          : 'text-white/90 hover:text-gold-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'text-primary-700 hover:bg-primary-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Search size={20} />
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className={`relative p-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'text-primary-700 hover:bg-primary-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart size={20} />
              {getCartItemsCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {getCartItemsCount()}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`p-2 rounded-full transition-colors ${
                    isScrolled 
                      ? 'text-primary-700 hover:bg-primary-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User size={20} />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {user.displayName || user.email}
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package size={16} className="mr-2" />
                        Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart size={16} className="mr-2" />
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isScrolled
                      ? 'bg-primary-900 text-white hover:bg-primary-800'
                      : 'bg-white text-primary-900 hover:bg-white/90'
                  }`}
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                isScrolled 
                  ? 'text-primary-700 hover:bg-primary-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActivePath(link.path)
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-primary-700 hover:text-gold-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              <div className="border-t pt-4">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {user.displayName || user.email}
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-primary-700 hover:text-gold-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-primary-700 hover:text-gold-600 hover:bg-gray-50 rounded-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium bg-primary-900 text-white rounded-md text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;