// Analytics and referrer tracking utilities
export class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.referrerData = this.captureReferrerData();
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
    
    // Get Facebook click ID
    const fbclid = urlParams.get('fbclid');
    
    // Get Google click ID
    const gclid = urlParams.get('gclid');
    
    // Determine traffic source
    const trafficSource = this.determineTrafficSource(referrer, utmSource, fbclid, gclid);
    
    const referrerData = {
      referrer: referrer || 'direct',
      trafficSource,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      fbclid,
      gclid,
      landingPage: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language
    };

    // Store in localStorage for persistence
    localStorage.setItem('referrerData', JSON.stringify(referrerData));
    
    return referrerData;
  }

  determineTrafficSource(referrer, utmSource, fbclid, gclid) {
    // Direct traffic
    if (!referrer && !utmSource) {
      return 'direct';
    }

    // UTM source takes priority
    if (utmSource) {
      return utmSource.toLowerCase();
    }

    // Facebook traffic
    if (fbclid || (referrer && referrer.includes('facebook.com'))) {
      return 'facebook';
    }

    // Google traffic
    if (gclid || (referrer && referrer.includes('google.com'))) {
      return 'google';
    }

    // Other social media platforms
    if (referrer) {
      const domain = new URL(referrer).hostname.toLowerCase();
      
      const socialPlatforms = {
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
  }

  // Send data to your analytics endpoint
  async sendAnalyticsEvent(eventType, data) {
    try {
      // Send to your backend analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          data
        })
      });

      // Also send to Google Analytics if configured
      if (window.gtag) {
        window.gtag('event', eventType, {
          custom_parameter: JSON.stringify(data)
        });
      }

      // Send to Facebook Pixel if configured
      if (window.fbq) {
        window.fbq('track', eventType, data);
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
}

// Create global analytics instance
export const analytics = new AnalyticsTracker();