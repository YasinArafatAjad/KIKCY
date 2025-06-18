// Real product data structure - will be replaced with Firebase integration
export const products = [];

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

// Function to get featured products
export const getFeaturedProducts = () => {
  return products.filter(product => product.featured).slice(0, 8);
};

// Function to get new arrivals
export const getNewArrivals = () => {
  return products.filter(product => product.isNew).slice(0, 8);
};

// Function to get sale products
export const getSaleProducts = () => {
  return products.filter(product => product.onSale).slice(0, 8);
};