import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingCart, 
  X, 
  Star,
  Share2,
  Filter
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Wishlist = () => {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviews: 124,
      inStock: true,
      category: 'Men',
      addedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Elegant Evening Dress',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 89,
      inStock: true,
      category: 'Women',
      addedDate: '2024-01-12'
    },
    {
      id: 3,
      name: 'Kids Rainbow Sweater',
      price: 34.99,
      originalPrice: 34.99,
      image: 'https://images.pexels.com/photos/1642883/pexels-photo-1642883.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviews: 67,
      inStock: false,
      category: 'Kids',
      addedDate: '2024-01-10'
    },
    {
      id: 4,
      name: 'Summer Floral Blouse',
      price: 54.99,
      originalPrice: 64.99,
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      reviews: 92,
      inStock: true,
      category: 'Women',
      addedDate: '2024-01-08'
    }
  ]);

  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: 'M', // Default size
      color: 'Default' // Default color
    });
  };

  const sortedAndFilteredItems = wishlistItems
    .filter(item => {
      if (filterBy === 'all') return true;
      if (filterBy === 'inStock') return item.inStock;
      if (filterBy === 'outOfStock') return !item.inStock;
      return item.category.toLowerCase() === filterBy.toLowerCase();
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedDate) - new Date(a.addedDate);
        case 'oldest':
          return new Date(a.addedDate) - new Date(b.addedDate);
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist and shop them later.
            </p>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex flex-wrap gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>

                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Items</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 size={16} className="mr-2" />
                  Share Wishlist
                </button>
                <button
                  onClick={() => setWishlistItems([])}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {sortedAndFilteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>

                      {/* Stock Status */}
                      {!item.inStock && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {/* Sale Badge */}
                      {item.originalPrice > item.price && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Sale
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < Math.floor(item.rating) 
                                  ? 'text-gold-500 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          ({item.reviews})
                        </span>
                      </div>

                      <div className="flex items-center mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          ${item.price}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                            item.inStock
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </motion.button>

                        {!item.inStock && (
                          <button className="w-full py-2 px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                            Notify When Available
                          </button>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        Added on {new Date(item.addedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {sortedAndFilteredItems.length === 0 && (
              <div className="text-center py-16">
                <Filter size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items match your filters</h3>
                <p className="text-gray-600">Try adjusting your filter settings</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;