import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  Package,
  CreditCard,
  MapPin,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: '12', color: 'bg-blue-500' },
    { icon: Heart, label: 'Wishlist Items', value: '8', color: 'bg-red-500' },
    { icon: Package, label: 'Pending Orders', value: '2', color: 'bg-yellow-500' },
    { icon: CreditCard, label: 'Total Spent', value: '$1,234', color: 'bg-green-500' }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: '$89.99',
      items: 2
    },
    {
      id: '#ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: '$156.50',
      items: 3
    },
    {
      id: '#ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: '$45.00',
      items: 1
    }
  ];

  const quickActions = [
    { icon: ShoppingBag, label: 'Browse Products', href: '/products', color: 'bg-primary-500' },
    { icon: Package, label: 'Track Orders', href: '/orders', color: 'bg-blue-500' },
    { icon: Heart, label: 'View Wishlist', href: '/wishlist', color: 'bg-red-500' },
    { icon: Settings, label: 'Account Settings', href: '/profile', color: 'bg-gray-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || 'Customer'}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your account today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{order.total}</p>
                        <p className="text-sm text-gray-600">{order.items} items</p>
                      </div>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200">
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View all orders →
                </button>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`${action.color} p-2 rounded-lg`}>
                      <action.icon size={16} className="text-white" />
                    </div>
                    <span className="ml-3 font-medium text-gray-700">{action.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User size={16} className="text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{user?.displayName}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard size={16} className="text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">New York, NY</span>
                </div>
                <div className="flex items-center">
                  <Bell size={16} className="text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Notifications: On</span>
                </div>
              </div>
              <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm">
                Edit Profile →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;