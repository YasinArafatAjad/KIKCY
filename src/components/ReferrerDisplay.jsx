import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Search, 
  Globe, 
  ExternalLink,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';
import { useReferrerTracking } from '../hooks/useReferrerTracking';

const ReferrerDisplay = () => {
  const { referrerData, loading } = useReferrerTracking();

  if (loading || !referrerData) {
    return null;
  }

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

  // Only show if it's not a direct visit
  if (referrerData.trafficSource === 'direct') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4"
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
  );
};

export default ReferrerDisplay;