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
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  DollarSign,
  Eye,
  MousePointer,
  Clock,
  MapPin
} from 'lucide-react';
import { analytics } from '../utils/analytics';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch comprehensive analytics data
      const data = await analytics.fetchAnalyticsData(dateRange);
      setAnalyticsData(data);
      
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

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case 'desktop':
        return <Monitor size={16} className="text-blue-500" />;
      case 'mobile':
        return <Smartphone size={16} className="text-green-500" />;
      case 'tablet':
        return <Tablet size={16} className="text-purple-500" />;
      default:
        return <Monitor size={16} className="text-gray-500" />;
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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

  const totalVisitors = analyticsData?.totalVisitors || 0;
  const totalConversions = Object.values(analyticsData?.conversionsBySource || {})
    .reduce((sum, source) => sum + source.conversions, 0);
  const totalRevenue = Object.values(analyticsData?.conversionsBySource || {})
    .reduce((sum, source) => sum + source.value, 0);

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive visitor tracking and analytics</p>
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

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'traffic', label: 'Traffic Sources' },
                { id: 'visitors', label: 'Visitor Details' },
                { id: 'conversions', label: 'Conversions' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
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
                    <Eye size={24} className="text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData?.dailyStats?.reduce((sum, day) => sum + day.pageViews, 0).toLocaleString() || '0'}
                    </p>
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
                    <MousePointer size={24} className="text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
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
                    <DollarSign size={24} className="text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Traffic Sources */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h2>
                
                <div className="space-y-4">
                  {Object.entries(analyticsData?.trafficSources || {}).map(([source, count]) => {
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
              </motion.div>

              {/* Device Types */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Device Types</h2>
                
                <div className="space-y-4">
                  {Object.entries(analyticsData?.deviceTypes || {}).map(([device, count]) => {
                    const percentage = totalVisitors > 0 ? ((count / totalVisitors) * 100).toFixed(1) : 0;
                    return (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getDeviceIcon(device)}
                          <span className="ml-3 font-medium text-gray-900 capitalize">{device}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
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
            </div>

            {/* Top Pages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Pages</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Page</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Views</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analyticsData?.topPages || []).map((page, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-900">{page.page}</td>
                        <td className="py-3 px-4 text-gray-600">{page.views}</td>
                        <td className="py-3 px-4 text-gray-600">{(page.bounceRate * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* Traffic Sources Tab */}
        {activeTab === 'traffic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Referrers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Referrers</h2>
              
              <div className="space-y-4">
                {(analyticsData?.topReferrers || []).map((referrer, index) => (
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

            {/* Countries */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Countries</h2>
              
              <div className="space-y-4">
                {Object.entries(analyticsData?.countries || {}).map(([country, count], index) => {
                  const percentage = totalVisitors > 0 ? ((count / totalVisitors) * 100).toFixed(1) : 0;
                  return (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{country}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
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
          </div>
        )}

        {/* Visitor Details Tab */}
        {activeTab === 'visitors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Visitors</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Landing Page</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Country</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Device</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Pages</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(analyticsData?.recentVisitors || []).slice(0, 20).map((visitor) => (
                    <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getSourceIcon(visitor.source)}
                          <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                            {visitor.source}
                          </span>
                          {visitor.utmCampaign && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {visitor.utmCampaign}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                        {visitor.landingPage}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{visitor.country}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getDeviceIcon(visitor.device)}
                          <span className="ml-2 text-sm text-gray-600 capitalize">{visitor.device}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDuration(visitor.sessionDuration)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{visitor.pageViews}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(visitor.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Conversions Tab */}
        {activeTab === 'conversions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversions by Source</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Conversions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Avg. Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analyticsData?.conversionsBySource || {}).map(([source, data]) => (
                    <tr key={source} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getSourceIcon(source)}
                          <span className="ml-3 font-medium text-gray-900 capitalize">{source}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{data.conversions}</td>
                      <td className="py-3 px-4 text-gray-600">{formatCurrency(data.value)}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatCurrency(data.conversions > 0 ? data.value / data.conversions : 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Analytics Data</h3>
          <p className="text-blue-700 mb-4">
            This dashboard shows comprehensive analytics data including historical visitors. 
            The data includes both real current session information and simulated historical data 
            to demonstrate the full analytics capabilities.
          </p>
          <div className="text-sm text-blue-600">
            <strong>Current Implementation:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Real-time session tracking with referrer detection</li>
              <li>UTM parameter capture and analysis</li>
              <li>Device and browser detection</li>
              <li>Comprehensive traffic source classification</li>
              <li>Mock historical data for demonstration</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;