import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = ({ measurementId }) => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [measurementId]);

  // Track page views on route changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search
      });
    }
  }, [location, measurementId]);

  return null;
};

export default GoogleAnalytics;