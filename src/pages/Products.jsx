import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  Grid3X3, 
  List, 
  Star, 
  Heart, 
  ShoppingCart,
  ChevronDown,
  X,
  Package
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { products, getProductsByCategory, searchProducts } from '../data/products';

const Products = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2T', '3T', '4T', '5T', '6T', '28', '30', '32', '34', '36'];
  const colors = ['black', 'white', 'navy', 'blue', 'pink', 'gray', 'green', 'burgundy', 'multicolor', 'floral'];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (category) {
      filtered = getProductsByCategory(category);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = searchProducts(searchTerm);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors && product.colors.some(color => selectedColors.includes(color))
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [category, searchTerm, priceRange, selectedSizes, selectedColors, sortBy]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes ? product.sizes[0] : 'M', // Default to first size or M
      color: product.colors ? product.colors[0] : 'Default' // Default to first color
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 500]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s Fashion` : 'All Products'}
            </h1>
            <p className="text-xl text-gray-300">
              {searchTerm ? `Search results for "${searchTerm}"` : 'Discover our premium collection of stylish clothing'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent w-full sm:w-80"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={20} className="mr-2" />
              Filters
              {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                <span className="ml-2 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedSizes.length + selectedColors.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gold-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gold-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
                className="w-80 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gold-600 hover:text-gold-700"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600 lg:hidden"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Sizes</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev => 
                            prev.includes(size) 
                              ? prev.filter(s => s !== size)
                              : [...prev, size]
                          );
                        }}
                        className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                          selectedSizes.includes(size)
                            ? 'border-gold-500 bg-gold-50 text-gold-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Colors</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColors(prev => 
                            prev.includes(color) 
                              ? prev.filter(c => c !== color)
                              : [...prev, color]
                          );
                        }}
                        className={`px-3 py-2 border rounded-md text-sm capitalize transition-colors ${
                          selectedColors.includes(color)
                            ? 'border-gold-500 bg-gold-50 text-gold-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-gray-600">
              Showing {filteredProducts.length} products
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Package size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedSizes.length > 0 || selectedColors.length > 0 
                    ? 'Try adjusting your filters or search terms' 
                    : 'We\'re working on adding products to our catalog. Check back soon!'}
                </p>
                <div className="space-y-4">
                  <Link
                    to="/products"
                    className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Browse All Categories
                  </Link>
                  <div className="text-sm text-gray-500">
                    Or explore our categories:
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link to="/products/men" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Men's Fashion
                    </Link>
                    <Link to="/products/women" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Women's Wear
                    </Link>
                    <Link to="/products/kids" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Kids' Clothing
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                              viewMode === 'list' ? 'h-48' : 'h-64'
                            }`}
                          />
                        </Link>
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.isNew && (
                            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              New
                            </span>
                          )}
                          {product.onSale && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Sale
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            wishlist.includes(product.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/80 text-gray-600 hover:bg-white'
                          }`}
                        >
                          <Heart size={16} className={wishlist.includes(product.id) ? 'fill-current' : ''} />
                        </button>
                      </div>

                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-gold-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {product.rating && (
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < Math.floor(product.rating) 
                                      ? 'text-gold-500 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              ({product.reviews || 0} reviews)
                            </span>
                          </div>
                        )}

                        <div className="flex items-center mb-3">
                          <span className="text-xl font-bold text-primary-900">
                            ${product.price}
                          </span>
                          {product.onSale && product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Color Options */}
                        {product.colors && (
                          <div className="flex items-center gap-2 mb-4">
                            {product.colors.slice(0, 3).map(color => (
                              <div
                                key={color}
                                className={`w-4 h-4 rounded-full border-2 border-gray-300 ${
                                  color === 'black' ? 'bg-black' :
                                  color === 'white' ? 'bg-white' :
                                  color === 'navy' ? 'bg-blue-900' :
                                  color === 'blue' ? 'bg-blue-500' :
                                  color === 'pink' ? 'bg-pink-500' :
                                  color === 'gray' ? 'bg-gray-500' :
                                  color === 'green' ? 'bg-green-500' :
                                  color === 'burgundy' ? 'bg-red-800' :
                                  'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500'
                                }`}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{product.colors.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-primary-900 text-white py-2 px-4 rounded-lg hover:bg-primary-800 transition-colors flex items-center justify-center group"
                        >
                          <ShoppingCart size={18} className="mr-2 group-hover:animate-bounce" />
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;