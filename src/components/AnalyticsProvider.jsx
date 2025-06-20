import React, { createContext, useContext, useEffect } from 'react';
import { analytics } from '../utils/analytics';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Set user ID when user logs in
  useEffect(() => {
    if (user) {
      analytics.setUserId(user.uid);
    }
  }, [user]);

  // Track page views on route changes
  useEffect(() => {
    const pageName = location.pathname;
    analytics.trackPageView(pageName, {
      search: location.search,
      hash: location.hash
    });
  }, [location]);

  const trackEvent = (eventName, eventData) => {
    analytics.trackEvent(eventName, eventData);
  };

  const trackConversion = (conversionType, value, currency) => {
    analytics.trackConversion(conversionType, value, currency);
  };

  const getAttributionData = () => {
    return analytics.getAttributionReport();
  };

  const value = {
    trackEvent,
    trackConversion,
    getAttributionData
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};