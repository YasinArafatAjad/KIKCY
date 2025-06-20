import { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';

export const useReferrerTracking = () => {
  const [referrerData, setReferrerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get referrer data on component mount
    const data = analytics.getAttributionReport();
    setReferrerData(data);
    setLoading(false);
  }, []);

  const trackConversion = (type, value, currency = 'USD') => {
    analytics.trackConversion(type, value, currency);
  };

  const trackEvent = (eventName, eventData = {}) => {
    analytics.trackEvent(eventName, eventData);
  };

  return {
    referrerData,
    loading,
    trackConversion,
    trackEvent
  };
};