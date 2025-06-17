import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'Men\'s Fashion', path: '/products/men' },
        { name: 'Women\'s Wear', path: '/products/women' },
        { name: 'Kids\' Clothing', path: '/products/kids' },
        { name: 'New Arrivals', path: '/products?filter=new' },
        { name: 'Sale Items', path: '/products?filter=sale' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'Size Guide', path: '/size-guide' },
        { name: 'Shipping Info', path: '/shipping' },
        { name: 'Returns', path: '/returns' },
        { name: 'FAQ', path: '/faq' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' }
      ]
    }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $99'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'SSL encrypted checkout'
    },
    {
      icon: CreditCard,
      title: 'Cash on Delivery',
      description: 'Pay when you receive'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/kicky', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/kicky', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/kicky', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/kicky', label: 'YouTube' }
  ];

  return (
    <footer className="bg-primary-900 text-white">
      {/* Features Section */}
      <div className="border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                  <feature.icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-primary-300 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold font-display mb-4">KICKY</h2>
              <p className="text-primary-300 mb-6 max-w-md">
                Discover the latest in fashion trends with our carefully curated collection 
                of clothing for men, women, and children. Style meets comfort at KICKY.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin size={18} className="text-gold-500 flex-shrink-0" />
                  <span className="text-primary-300">123 Fashion Street, Style City, SC 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-gold-500 flex-shrink-0" />
                  <span className="text-primary-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-gold-500 flex-shrink-0" />
                  <span className="text-primary-300">hello@kicky.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              >
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-primary-300 hover:text-gold-400 transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Stay in Style</h3>
            <p className="text-primary-300 mb-6">
              Subscribe to our newsletter for the latest fashion trends and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-primary-800 border border-primary-700 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gold-500 text-white rounded-lg font-medium hover:bg-gold-600 transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-400 text-sm">
              © {currentYear} KICKY. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-primary-400 hover:text-gold-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-400 hover:text-gold-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-primary-400 hover:text-gold-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;