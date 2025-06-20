import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Globe, 
  TrendingUp,
  Search,
  ExternalLink,
  Calendar,
  Filter
} from 'lucide-react';
import { analytics } from '../utils/analytics';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalVisitors: 0,
    trafficSources: {},
    topReferrers: [],
    conversionsBySource: {},
    recentVisitors: []
  });
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your analytics API
      // For demo purposes, we'll use mock data
      const mockData = {
        totalVisitors: 1247,
        trafficSources: {
          'direct': 425,
          'google': 312,
          'instagram': 156,
          'twitter': 89,
          'referral': 67
        },
        topReferrers: [
          { domain: 'google.com', visitors: 312, percentage: 25.0 },
          { domain: 'instagram.com', visitors: 156, percentage: 12.5 },
          { domain: 'twitter.com', visitors: 89, percentage: 7.1 },
          { domain: 'pinterest.com', visitors: 45, percentage: 3.6 }
        ],
        conversionsBySource: {
          'google': { conversions: 23, value: 2340 },
          'direct': { conversions: 31, value: 3100 },
          'instagram': { conversions: 12, value: 1200 }
        },
        recentVisitors: [
          { 
            id: 1, 
            source: 'google', 
            landingPage: '/products/men', 
            timestamp: '2024-01-15T10:30:00Z',
            converted: true,
            value: 89.99
          },
          { 
            id: 2, 
            source: 'direct', 
            landingPage: '/', 
            timestamp: '2024-01-15T10:25:00Z',
            converted: false,
            value: 0
          },
          { 
            id: 3, 
            source: 'instagram', 
            landingPage: '/products/women', 
            timestamp: '2024-01-15T10:20:00Z',
            converted: true,
            value: 156.50
          }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source) => {
    switch (source.toLowerCase()) {
      case 'google':
        return <Search size={20} className="text-red-500" />;
      case 'direct':
        return <Globe size={20} className="text-gray-600" />;
      case 'referral':
        return <ExternalLink size={20} className="text-purple-600" />;
      default:
        return <Users size={20} className="text-gray-500" />;
    }
  };

  const totalVisitors = Object.values(analyticsData.trafficSources).reduce((sum, count) => sum + count, 0);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Traffic Analytics</h1>
              <p className="text-gray-600">Track where your visitors are coming from</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Traffic Sources</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(analyticsData.trafficSources).length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$6,640</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h2>
            
            <div className="space-y-4">
              {Object.entries(analyticsData.trafficSources).map(([source, count]) => {
                const percentage = ((count / totalVisitors) * 100).toFixed(1);
                return (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getSourceIcon(source)}
                      <span className="ml-3 font-medium text-gray-900 capitalize">{source}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
                      <span className="text-sm font-medium text-gray-900 w-16 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Top Referrers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Referrers</h2>
            
            <div className="space-y-4">
              {analyticsData.topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                    </div>
                    <span className="ml-3 font-medium text-gray-900">{referrer.domain}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{referrer.percentage}%</span>
                    <span className="text-sm font-medium text-gray-900">{referrer.visitors}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Conversions by Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversions by Source</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Visitors</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Conversions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analyticsData.conversionsBySource).map(([source, data]) => {
                  const visitors = analyticsData.trafficSources[source] || 0;
                  const conversionRate = visitors > 0 ? ((data.conversions / visitors) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <tr key={source} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getSourceIcon(source)}
                          <span className="ml-3 font-medium text-gray-900 capitalize">{source}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{visitors}</td>
                      <td className="py-3 px-4 text-gray-600">{data.conversions}</td>
                      <td className="py-3 px-4 text-gray-600">{conversionRate}%</td>
                      <td className="py-3 px-4 font-medium text-gray-900">${data.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Visitors</h2>
          
          <div className="space-y-4">
            {analyticsData.recentVisitors.map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getSourceIcon(visitor.source)}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{visitor.source}</p>
                    <p className="text-sm text-gray-600">{visitor.landingPage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(visitor.timestamp).toLocaleTimeString()}
                  </p>
                  {visitor.converted ? (
                    <p className="text-sm font-medium text-green-600">
                      Converted: ${visitor.value}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">No conversion</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;