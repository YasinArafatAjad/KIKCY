// Analytics and referrer tracking utilities
export class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.referrerData = this.captureReferrerData();
    this.pageViews = [];
    this.events = [];
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
      sessionId: this.sessionId
    };

    // Store in localStorage for persistence
    localStorage.setItem('referrerData', JSON.stringify(referrerData));
    
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

    this.sendAnalyticsEvent('conversion', conversionData);
  }

  // Set user ID when user logs in
  setUserId(userId) {
    this.userId = userId;
    this.updateLocalStorage();
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

      // In production, you would also send to your backend
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     eventType,
      //     data
      //   })
      // });

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
}

// Create global analytics instance
export const analytics = new AnalyticsTracker();