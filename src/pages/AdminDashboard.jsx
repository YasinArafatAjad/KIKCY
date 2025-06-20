import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Package,
  Settings,
  BarChart3,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  // Close sidebar when tab changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date()
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: !currentStatus,
        updatedAt: new Date()
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const stats = [
    { 
      icon: Users, 
      label: 'Total Users', 
      value: users.length.toString(), 
      change: '+12%', 
      color: 'bg-blue-500' 
    },
    { 
      icon: ShoppingBag, 
      label: 'Total Orders', 
      value: orders.length.toString(), 
      change: '+8%', 
      color: 'bg-green-500' 
    },
    { 
      icon: DollarSign, 
      label: 'Revenue', 
      value: `$${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}`, 
      change: '+15%', 
      color: 'bg-yellow-500' 
    },
    { 
      icon: Package, 
      label: 'Products', 
      value: products.length.toString(), 
      change: '+3%', 
      color: 'bg-purple-500' 
    }
  ];
 
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex relative">
        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} className="text-gray-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          <motion.div
            initial={{ x: -280 }}
            animate={{ 
              x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -280 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="w-64 bg-white shadow-lg h-screen fixed left-0 top-16 z-50 lg:z-40 overflow-y-auto"
          >
            <div className="p-6">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-gray-900 mb-6"
              >
                Admin Panel
              </motion.h2>
              
              <nav className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: activeTab === item.id ? undefined : '#f3f4f6'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <motion.div
                      animate={{ 
                        rotate: activeTab === item.id ? 360 : 0,
                        scale: activeTab === item.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon size={20} className="mr-3" />
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                    {activeTab === item.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          animate={{ 
            marginLeft: window.innerWidth >= 1024 ? 256 : 0,
            paddingLeft: window.innerWidth >= 1024 ? 0 : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          className="flex-1 p-4 lg:p-8"
        >
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, {user?.displayName}!</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                    className="bg-white rounded-lg shadow-sm p-4 lg:p-6 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <motion.p 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="text-xl lg:text-2xl font-bold text-gray-900"
                        >
                          {stat.value}
                        </motion.p>
                        <p className="text-sm text-green-600">{stat.change}</p>
                      </div>
                      <motion.div 
                        className={`${stat.color} p-3 rounded-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <stat.icon size={24} className="text-white" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg shadow-sm p-4 lg:p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user, index) => (
                    <motion.div 
                      key={user.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                          <p className="text-xs text-gray-500">Joined as {user.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {user.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
                  <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
                </div>
                <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  Total Users: <span className="font-semibold">{users.length}</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
                </div>
                
                {/* Mobile-friendly table */}
                <div className="overflow-x-auto">
                  <div className="hidden lg:block">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((userData, index) => (
                          <motion.tr 
                            key={userData.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                  <Users size={20} className="text-primary-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {userData.displayName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {userData.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={userData.role}
                                onChange={(e) => updateUserRole(userData.id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                disabled={userData.id === user?.uid}
                              >
                                <option value="customer">Customer</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                userData.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {userData.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {userData.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => toggleUserStatus(userData.id, userData.isActive)}
                                  className={`${
                                    userData.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                                  } transition-colors`}
                                  title={userData.isActive ? 'Deactivate' : 'Activate'}
                                  disabled={userData.id === user?.uid}
                                >
                                  {userData.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </motion.button>
                                {userData.id !== user?.uid && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteUser(userData.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Delete User"
                                  >
                                    <Trash2 size={16} />
                                  </motion.button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4 p-4">
                    {users.map((userData, index) => (
                      <motion.div
                        key={userData.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <Users size={20} className="text-primary-600" />
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">{userData.displayName}</div>
                              <div className="text-sm text-gray-600">{userData.email}</div>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userData.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <select
                            value={userData.role}
                            onChange={(e) => updateUserRole(userData.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={userData.id === user?.uid}
                          >
                            <option value="customer">Customer</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                          
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleUserStatus(userData.id, userData.isActive)}
                              className={`p-2 rounded-lg ${
                                userData.isActive 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              } transition-colors`}
                              disabled={userData.id === user?.uid}
                            >
                              {userData.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Eye size={16} />
                            </motion.button>
                            {userData.id !== user?.uid && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteUser(userData.id)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Joined: {userData.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Other tabs would be implemented similarly */}
          {(activeTab !== 'overview' && activeTab !== 'users') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {sidebarItems.find(item => item.id === activeTab)?.label} Section
                </h2>
                <p className="text-gray-600">This section is under development.</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;