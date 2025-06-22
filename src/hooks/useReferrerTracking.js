import { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';

export const useReferrerTracking = () => {
  const [referrerData, setReferrerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Get referrer data on component mount
    const data = analytics.getAttributionReport();
    setReferrerData(data);
    
    // Get comprehensive analytics data
    fetchAnalyticsData();
    
    setLoading(false);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const data = await analytics.fetchAnalyticsData('7d');
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const trackConversion = (type, value, currency = 'USD') => {
    analytics.trackConversion(type, value, currency);
  };

  const trackEvent = (eventName, eventData = {}) => {
    analytics.trackEvent(eventName, eventData);
  };

  const getVisitorInsights = () => {
    if (!analyticsData) return null;

    return {
      totalVisitors: analyticsData.totalVisitors,
      topSources: Object.entries(analyticsData.trafficSources)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      recentVisitors: analyticsData.recentVisitors?.slice(0, 10) || [],
      conversionRate: analyticsData.totalVisitors > 0 
        ? ((Object.values(analyticsData.conversionsBySource || {})
            .reduce((sum, source) => sum + source.conversions, 0) / analyticsData.totalVisitors) * 100).toFixed(2)
        : 0
    };
  };

  return {
    referrerData,
    loading,
    analyticsData,
    trackConversion,
    trackEvent,
    getVisitorInsights,
    refreshData: fetchAnalyticsData
  };
};