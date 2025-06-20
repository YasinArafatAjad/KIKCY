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
  Filter,
  Instagram,
  Twitter,
  Youtube,
  RefreshCw
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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get real referrer data from our analytics system
      const referrerData = analytics.getAttributionReport();
      
      // In a real implementation, you would fetch data from your backend
      // For now, we'll show the current session data and some basic metrics
      const realData = {
        totalVisitors: 1, // Current session
        trafficSources: {
          [referrerData.trafficSource || 'direct']: 1
        },
        topReferrers: referrerData.referrer && referrerData.referrer !== 'direct' 
          ? [{ 
              domain: new URL(referrerData.referrer).hostname, 
              visitors: 1, 
              percentage: 100.0 
            }]
          : [],
        conversionsBySource: {},
        recentVisitors: [{
          id: 1,
          source: referrerData.trafficSource || 'direct',
          landingPage: referrerData.landingPage || window.location.href,
          timestamp: referrerData.timestamp || new Date().toISOString(),
          converted: false,
          value: 0,
          utmCampaign: referrerData.utmCampaign,
          utmMedium: referrerData.utmMedium,
          utmSource: referrerData.utmSource
        }]
      };
      
      setAnalyticsData(realData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case 'google':
        return <Search size={20} className="text-red-500" />;
      case 'instagram':
        return <Instagram size={20} className="text-pink-500" />;
      case 'twitter':
      case 'x':
        return <Twitter size={20} className="text-blue-400" />;
      case 'youtube':
        return <Youtube size={20} className="text-red-600" />;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BarChart3 size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center mx-auto"
          >
            <RefreshCw size={20} className="mr-2" />
            Retry
          </button>
        </div>
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
              <p className="text-gray-600">Real-time visitor tracking and analytics</p>
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
              
              <button
                onClick={fetchAnalyticsData}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notice about data collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Analytics Data Collection</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This page shows real analytics data from your current session. In a production environment, 
                  this would display comprehensive data from Google Analytics and your backend analytics system.
                </p>
              </div>
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
                <p className="text-sm font-medium text-gray-600">Current Session</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisitors}</p>
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
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
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
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
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
            
            {Object.keys(analyticsData.trafficSources).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analyticsData.trafficSources).map(([source, count]) => {
                  const percentage = totalVisitors > 0 ? ((count / totalVisitors) * 100).toFixed(1) : 0;
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
            ) : (
              <div className="text-center py-8">
                <Globe size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No traffic data available yet</p>
              </div>
            )}
          </motion.div>

          {/* Top Referrers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Referrers</h2>
            
            {analyticsData.topReferrers.length > 0 ? (
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
            ) : (
              <div className="text-center py-8">
                <ExternalLink size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No referrer data available</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Session Details</h2>
          
          <div className="space-y-4">
            {analyticsData.recentVisitors.map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getSourceIcon(visitor.source)}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {visitor.source}
                      {visitor.utmCampaign && (
                        <span className="ml-2 text-sm text-blue-600">
                          Campaign: {visitor.utmCampaign}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{visitor.landingPage}</p>
                    {visitor.utmMedium && (
                      <p className="text-xs text-gray-500">Medium: {visitor.utmMedium}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(visitor.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Active session</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Production Integration</h3>
          <p className="text-yellow-700 mb-4">
            To see comprehensive analytics data in production, you'll need to:
          </p>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Set up Google Analytics 4 with your measurement ID</li>
            <li>Implement backend analytics collection</li>
            <li>Configure conversion tracking</li>
            <li>Set up automated reporting</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;