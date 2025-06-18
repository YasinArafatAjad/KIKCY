// Product data that would typically come from Firebase
export const products = [
  {
    id: 1,
    name: 'Classic Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    category: 'men',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.5,
    reviews: 124,
    colors: ['black', 'white', 'navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: 50,
    description: 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this versatile piece is perfect for everyday wear.',
    features: [
      '100% Organic Cotton',
      'Pre-shrunk fabric',
      'Reinforced seams',
      'Machine washable',
      'Eco-friendly dyes'
    ],
    careInstructions: [
      'Machine wash cold with like colors',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low heat if needed',
      'Do not dry clean'
    ],
    isNew: false,
    onSale: true
  },
  {
    id: 2,
    name: 'Elegant Evening Dress',
    price: 149.99,
    originalPrice: 199.99,
    category: 'women',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviews: 89,
    colors: ['black', 'navy', 'burgundy'],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: 25,
    description: 'Sophisticated evening dress perfect for special occasions. Features elegant draping and premium fabric.',
    features: [
      'Premium fabric blend',
      'Elegant draping',
      'Hidden zipper',
      'Lined interior',
      'Dry clean only'
    ],
    careInstructions: [
      'Dry clean only',
      'Store on padded hanger',
      'Avoid direct sunlight',
      'Steam to remove wrinkles'
    ],
    isNew: true,
    onSale: true
  },
  {
    id: 3,
    name: 'Kids Rainbow Sweater',
    price: 34.99,
    originalPrice: 34.99,
    category: 'kids',
    image: 'https://images.pexels.com/photos/1642883/pexels-photo-1642883.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1642883/pexels-photo-1642883.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    reviews: 67,
    colors: ['multicolor', 'pink', 'blue'],
    sizes: ['2T', '3T', '4T', '5T'],
    inStock: 30,
    description: 'Colorful and comfortable sweater for kids. Made with soft, child-friendly materials.',
    features: [
      'Soft cotton blend',
      'Colorfast dyes',
      'Easy care',
      'Comfortable fit',
      'Durable construction'
    ],
    careInstructions: [
      'Machine wash warm',
      'Tumble dry low',
      'Do not bleach',
      'Iron on low if needed'
    ],
    isNew: true,
    onSale: false
  },
  {
    id: 4,
    name: 'Premium Denim Jeans',
    price: 89.99,
    originalPrice: 89.99,
    category: 'men',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.7,
    reviews: 156,
    colors: ['blue', 'black', 'gray'],
    sizes: ['28', '30', '32', '34', '36'],
    inStock: 40,
    description: 'Classic denim jeans with modern fit. Premium quality denim that gets better with age.',
    features: [
      'Premium denim',
      'Classic fit',
      'Reinforced stitching',
      'Fade resistant',
      'Comfortable stretch'
    ],
    careInstructions: [
      'Machine wash cold',
      'Turn inside out',
      'Tumble dry low',
      'Iron if needed'
    ],
    isNew: false,
    onSale: false
  },
  {
    id: 5,
    name: 'Floral Summer Blouse',
    price: 54.99,
    originalPrice: 64.99,
    category: 'women',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.4,
    reviews: 92,
    colors: ['floral', 'white', 'pink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: 35,
    description: 'Light and airy summer blouse with beautiful floral pattern. Perfect for warm weather.',
    features: [
      'Lightweight fabric',
      'Floral print',
      'Breathable material',
      'Relaxed fit',
      'Easy care'
    ],
    careInstructions: [
      'Machine wash cold',
      'Gentle cycle',
      'Hang to dry',
      'Iron on low'
    ],
    isNew: false,
    onSale: true
  },
  {
    id: 6,
    name: 'Cozy Kids Pajama Set',
    price: 24.99,
    originalPrice: 24.99,
    category: 'kids',
    image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    reviews: 203,
    colors: ['blue', 'pink', 'green'],
    sizes: ['2T', '3T', '4T', '5T', '6T'],
    inStock: 45,
    description: 'Comfortable pajama set for kids. Soft fabric ensures a good night\'s sleep.',
    features: [
      'Ultra-soft fabric',
      'Comfortable fit',
      'Fun patterns',
      'Easy care',
      'Durable quality'
    ],
    careInstructions: [
      'Machine wash warm',
      'Tumble dry low',
      'Do not bleach',
      'Iron on low if needed'
    ],
    isNew: true,
    onSale: false
  }
];

// Function to get product by ID
export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

// Function to get products by category
export const getProductsByCategory = (category) => {
  if (!category) return products;
  return products.filter(product => product.category === category);
};

// Function to search products
export const searchProducts = (query) => {
  if (!query) return products;
  return products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
};