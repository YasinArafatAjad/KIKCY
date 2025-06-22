// Analytics and referrer tracking utilities
export class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.referrerData = this.captureReferrerData();
    this.pageViews = [];
    this.events = [];
    this.apiEndpoint = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  captureReferrerData() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get UTM parameters
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');
    
    // Get Google click ID
    const gclid = urlParams.get('gclid');
    
    // Determine traffic source
    const trafficSource = this.determineTrafficSource(referrer, utmSource, gclid);
    
    const referrerData = {
      referrer: referrer || 'direct',
      trafficSource,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      gclid,
      landingPage: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      sessionId: this.sessionId,
      ipAddress: null, // Will be captured on backend
      country: null, // Will be determined on backend
      city: null // Will be determined on backend
    };

    // Store in localStorage for persistence
    localStorage.setItem('referrerData', JSON.stringify(referrerData));
    
    // Send to backend immediately
    this.sendToBackend('session_start', referrerData);
    
    return referrerData;
  }

  determineTrafficSource(referrer, utmSource, gclid) {
    // Direct traffic
    if (!referrer && !utmSource) {
      return 'direct';
    }

    // UTM source takes priority
    if (utmSource) {
      return utmSource.toLowerCase();
    }

    // Google traffic
    if (gclid || (referrer && referrer.includes('google.com'))) {
      return 'google';
    }

    // Other social media platforms
    if (referrer) {
      const domain = new URL(referrer).hostname.toLowerCase();
      
      const socialPlatforms = {
        'facebook.com': 'facebook',
        'instagram.com': 'instagram',
        'twitter.com': 'twitter',
        'x.com': 'twitter',
        'linkedin.com': 'linkedin',
        'pinterest.com': 'pinterest',
        'tiktok.com': 'tiktok',
        'youtube.com': 'youtube',
        'reddit.com': 'reddit',
        'snapchat.com': 'snapchat',
        'whatsapp.com': 'whatsapp',
        'telegram.org': 'telegram'
      };

      for (const [platform, source] of Object.entries(socialPlatforms)) {
        if (domain.includes(platform)) {
          return source;
        }
      }

      // Search engines
      const searchEngines = {
        'bing.com': 'bing',
        'yahoo.com': 'yahoo',
        'duckduckgo.com': 'duckduckgo',
        'baidu.com': 'baidu'
      };

      for (const [engine, source] of Object.entries(searchEngines)) {
        if (domain.includes(engine)) {
          return source;
        }
      }

      // If it's a referrer but not recognized, classify as referral
      return 'referral';
    }

    return 'unknown';
  }

  // Track page views
  trackPageView(pageName, additionalData = {}) {
    const pageViewData = {
      sessionId: this.sessionId,
      userId: this.userId,
      pageName,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      referrerData: this.referrerData,
      ...additionalData
    };

    // Store locally for analytics dashboard
    this.pageViews.push(pageViewData);
    this.updateLocalStorage();

    // Send to backend
    this.sendToBackend('page_view', pageViewData);
    this.sendAnalyticsEvent('page_view', pageViewData);
  }

  // Track events (purchases, sign-ups, etc.)
  trackEvent(eventName, eventData = {}) {
    const trackingData = {
      sessionId: this.sessionId,
      userId: this.userId,
      eventName,
      timestamp: new Date().toISOString(),
      referrerData: this.referrerData,
      ...eventData
    };

    // Store locally for analytics dashboard
    this.events.push(trackingData);
    this.updateLocalStorage();

    // Send to backend
    this.sendToBackend('custom_event', trackingData);
    this.sendAnalyticsEvent('custom_event', trackingData);
  }

  // Track conversions
  trackConversion(conversionType, value = 0, currency = 'USD') {
    const conversionData = {
      sessionId: this.sessionId,
      userId: this.userId,
      conversionType,
      value,
      currency,
      timestamp: new Date().toISOString(),
      referrerData: this.referrerData
    };

    // Send to backend
    this.sendToBackend('conversion', conversionData);
    this.sendAnalyticsEvent('conversion', conversionData);
  }

  // Set user ID when user logs in
  setUserId(userId) {
    this.userId = userId;
    this.updateLocalStorage();
    
    // Update backend with user association
    this.sendToBackend('user_identified', {
      sessionId: this.sessionId,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  }

  // Send data to backend
  async sendToBackend(eventType, data) {
    try {
      // In a real implementation, you would send to your backend
      const response = await fetch(`${this.apiEndpoint}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          data,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.warn('Analytics backend request failed:', response.status);
      }
    } catch (error) {
      console.warn('Analytics backend error:', error);
      // Store failed requests for retry
      this.storeFailedRequest(eventType, data);
    }
  }

  // Store failed requests for retry
  storeFailedRequest(eventType, data) {
    const failedRequests = JSON.parse(localStorage.getItem('failedAnalytics') || '[]');
    failedRequests.push({
      eventType,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0
    });
    localStorage.setItem('failedAnalytics', JSON.stringify(failedRequests));
  }

  // Retry failed requests
  async retryFailedRequests() {
    const failedRequests = JSON.parse(localStorage.getItem('failedAnalytics') || '[]');
    const successfulRetries = [];

    for (const request of failedRequests) {
      if (request.retryCount < 3) {
        try {
          await this.sendToBackend(request.eventType, request.data);
          successfulRetries.push(request);
        } catch (error) {
          request.retryCount++;
        }
      }
    }

    // Remove successful retries
    const remainingFailed = failedRequests.filter(req => !successfulRetries.includes(req));
    localStorage.setItem('failedAnalytics', JSON.stringify(remainingFailed));
  }

  // Fetch analytics data from backend
  async fetchAnalyticsData(dateRange = '7d') {
    try {
      const response = await fetch(`${this.apiEndpoint}/analytics/data?range=${dateRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Return mock data for demonstration
      return this.getMockAnalyticsData();
    }
  }

  // Mock analytics data for demonstration
  getMockAnalyticsData() {
    const now = new Date();
    const mockData = {
      totalVisitors: 1247,
      trafficSources: {
        direct: 456,
        google: 321,
        facebook: 189,
        instagram: 134,
        twitter: 89,
        referral: 58
      },
      topReferrers: [
        { domain: 'google.com', visitors: 321, percentage: 25.7 },
        { domain: 'facebook.com', visitors: 189, percentage: 15.2 },
        { domain: 'instagram.com', visitors: 134, percentage: 10.7 },
        { domain: 'twitter.com', visitors: 89, percentage: 7.1 },
        { domain: 'linkedin.com', visitors: 45, percentage: 3.6 }
      ],
      conversionsBySource: {
        google: { conversions: 23, value: 2340.50 },
        facebook: { conversions: 15, value: 1890.25 },
        direct: { conversions: 34, value: 4567.80 },
        instagram: { conversions: 8, value: 945.60 }
      },
      recentVisitors: this.generateMockVisitors(50),
      dailyStats: this.generateDailyStats(7),
      topPages: [
        { page: '/', views: 456, bounceRate: 0.23 },
        { page: '/products', views: 234, bounceRate: 0.18 },
        { page: '/products/men', views: 189, bounceRate: 0.25 },
        { page: '/products/women', views: 167, bounceRate: 0.21 },
        { page: '/about', views: 89, bounceRate: 0.45 }
      ],
      deviceTypes: {
        desktop: 567,
        mobile: 489,
        tablet: 191
      },
      countries: {
        'United States': 456,
        'Canada': 234,
        'United Kingdom': 189,
        'Australia': 134,
        'Germany': 89,
        'France': 67,
        'Other': 78
      }
    };

    // Add current session data
    const currentSession = this.getSessionData();
    if (currentSession.referrerData) {
      const source = currentSession.referrerData.trafficSource;
      mockData.trafficSources[source] = (mockData.trafficSources[source] || 0) + 1;
      mockData.totalVisitors += 1;
    }

    return mockData;
  }

  generateMockVisitors(count) {
    const visitors = [];
    const sources = ['google', 'facebook', 'instagram', 'twitter', 'direct', 'referral'];
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'];
    const pages = ['/', '/products', '/products/men', '/products/women', '/about'];

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      visitors.push({
        id: `visitor_${i}`,
        source: sources[Math.floor(Math.random() * sources.length)],
        landingPage: pages[Math.floor(Math.random() * pages.length)],
        timestamp: timestamp.toISOString(),
        converted: Math.random() > 0.85,
        value: Math.random() > 0.85 ? Math.floor(Math.random() * 500) + 50 : 0,
        country: countries[Math.floor(Math.random() * countries.length)],
        device: Math.random() > 0.6 ? 'desktop' : Math.random() > 0.5 ? 'mobile' : 'tablet',
        sessionDuration: Math.floor(Math.random() * 600) + 30, // 30 seconds to 10 minutes
        pageViews: Math.floor(Math.random() * 10) + 1,
        utmCampaign: Math.random() > 0.7 ? ['summer_sale', 'new_arrivals', 'holiday_promo'][Math.floor(Math.random() * 3)] : null,
        utmMedium: Math.random() > 0.7 ? ['cpc', 'social', 'email'][Math.floor(Math.random() * 3)] : null,
        utmSource: Math.random() > 0.7 ? sources[Math.floor(Math.random() * sources.length)] : null
      });
    }

    // Add current session
    const currentSession = this.getSessionData();
    if (currentSession.referrerData) {
      visitors.unshift({
        id: currentSession.sessionId,
        source: currentSession.referrerData.trafficSource,
        landingPage: currentSession.referrerData.landingPage,
        timestamp: currentSession.referrerData.timestamp,
        converted: false,
        value: 0,
        country: 'United States', // Default for current session
        device: this.getDeviceType(),
        sessionDuration: this.getSessionDuration(),
        pageViews: currentSession.pageViews.length,
        utmCampaign: currentSession.referrerData.utmCampaign,
        utmMedium: currentSession.referrerData.utmMedium,
        utmSource: currentSession.referrerData.utmSource
      });
    }

    return visitors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  generateDailyStats(days) {
    const stats = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      stats.push({
        date: date.toISOString().split('T')[0],
        visitors: Math.floor(Math.random() * 200) + 50,
        pageViews: Math.floor(Math.random() * 800) + 200,
        conversions: Math.floor(Math.random() * 20) + 2,
        revenue: Math.floor(Math.random() * 2000) + 500
      });
    }
    return stats;
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  // Update localStorage with current session data
  updateLocalStorage() {
    const sessionData = {
      sessionId: this.sessionId,
      userId: this.userId,
      referrerData: this.referrerData,
      pageViews: this.pageViews,
      events: this.events,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('analyticsSession', JSON.stringify(sessionData));
  }

  // Get session analytics data
  getSessionData() {
    const stored = localStorage.getItem('analyticsSession');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      referrerData: this.referrerData,
      pageViews: this.pageViews,
      events: this.events
    };
  }

  // Send data to analytics endpoints
  async sendAnalyticsEvent(eventType, data) {
    try {
      // Send to Google Analytics if configured
      if (window.gtag) {
        window.gtag('event', eventType, {
          event_category: 'engagement',
          event_label: data.pageName || data.eventName,
          custom_parameter: JSON.stringify(data)
        });
      }

    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Get attribution report
  getAttributionReport() {
    const storedData = localStorage.getItem('referrerData');
    return storedData ? JSON.parse(storedData) : this.referrerData;
  }

  // Get analytics summary for dashboard
  getAnalyticsSummary() {
    const sessionData = this.getSessionData();
    
    return {
      totalPageViews: sessionData.pageViews.length,
      totalEvents: sessionData.events.length,
      sessionDuration: this.getSessionDuration(),
      trafficSource: sessionData.referrerData.trafficSource,
      referrer: sessionData.referrerData.referrer,
      utmData: {
        source: sessionData.referrerData.utmSource,
        medium: sessionData.referrerData.utmMedium,
        campaign: sessionData.referrerData.utmCampaign
      }
    };
  }

  // Calculate session duration
  getSessionDuration() {
    const sessionData = this.getSessionData();
    if (sessionData.pageViews.length === 0) return 0;
    
    const firstView = new Date(sessionData.pageViews[0].timestamp);
    const lastView = sessionData.pageViews.length > 1 
      ? new Date(sessionData.pageViews[sessionData.pageViews.length - 1].timestamp)
      : new Date();
    
    return Math.round((lastView - firstView) / 1000); // Duration in seconds
  }

  // Initialize retry mechanism
  init() {
    // Retry failed requests on page load
    this.retryFailedRequests();
    
    // Set up periodic retry
    setInterval(() => {
      this.retryFailedRequests();
    }, 60000); // Retry every minute
  }
}

// Create global analytics instance
export const analytics = new AnalyticsTracker();

// Initialize analytics
analytics.init();