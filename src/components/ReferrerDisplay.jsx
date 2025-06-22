import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Search, 
  Globe, 
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useReferrerTracking } from '../hooks/useReferrerTracking';

const ReferrerDisplay = () => {
  const { referrerData, loading, getVisitorInsights } = useReferrerTracking();

  if (loading || !referrerData) {
    return null;
  }

  const insights = getVisitorInsights();

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case 'facebook':
        return <Facebook size={16} className="text-blue-600" />;
      case 'google':
        return <Search size={16} className="text-red-500" />;
      case 'instagram':
        return <Instagram size={16} className="text-pink-500" />;
      case 'twitter':
        return <Twitter size={16} className="text-blue-400" />;
      case 'youtube':
        return <Youtube size={16} className="text-red-600" />;
      case 'direct':
        return <Globe size={16} className="text-gray-600" />;
      default:
        return <ExternalLink size={16} className="text-purple-600" />;
    }
  };

  const getSourceLabel = (source) => {
    if (!source || source === 'direct') return 'Direct Visit';
    return source.charAt(0).toUpperCase() + source.slice(1);
  };

  // Show referrer info for non-direct visits
  const showReferrerInfo = referrerData.trafficSource !== 'direct';
  
  // Show visitor insights if we have analytics data
  const showInsights = insights && insights.totalVisitors > 1;

  if (!showReferrerInfo && !showInsights) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Referrer Information */}
      {showReferrerInfo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-l-4 border-blue-400 p-4"
        >
          <div className="flex items-center">
            {getSourceIcon(referrerData.trafficSource)}
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                Welcome! We see you came from{' '}
                <span className="font-semibold">
                  {getSourceLabel(referrerData.trafficSource)}
                </span>
                {referrerData.utmCampaign && (
                  <span> via the "{referrerData.utmCampaign}" campaign</span>
                )}
              </p>
              {referrerData.utmSource && referrerData.utmSource !== referrerData.trafficSource && (
                <p className="text-xs text-blue-600 mt-1">
                  Source: {referrerData.utmSource}
                  {referrerData.utmMedium && ` • Medium: ${referrerData.utmMedium}`}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Visitor Insights */}
      {showInsights && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 border-l-4 border-green-400 p-4"
        >
          <div className="flex items-start">
            <Users size={16} className="text-green-600 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-green-800 font-medium">
                You're visitor #{insights.totalVisitors.toLocaleString()} today!
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-green-700">
                <div className="flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>Conversion Rate: {insights.conversionRate}%</span>
                </div>
                <div className="flex items-center">
                  <Eye size={12} className="mr-1" />
                  <span>Top Source: {insights.topSources[0]?.[0] || 'Direct'}</span>
                </div>
                <div className="flex items-center">
                  <Users size={12} className="mr-1" />
                  <span>Recent Visitors: {insights.recentVisitors.length}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReferrerDisplay;