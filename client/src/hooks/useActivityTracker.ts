// import { useEffect } from 'react';

const trackingCache = new Set<string>();

export const useActivityTracker = () => {
  const trackActivity = async (productId: string, action: 'view' | 'cart' | 'purchase' | 'wishlist') => {
    const cacheKey = `${productId}-${action}`;
    
    // Prevent duplicate tracking within 5 seconds
    if (trackingCache.has(cacheKey)) {
      return;
    }
    
    trackingCache.add(cacheKey);
    setTimeout(() => trackingCache.delete(cacheKey), 5000);
    
    try {
      const sessionId = getOrCreateSessionId();
      
      const response = await fetch('/api/search/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action,
          sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('Activity tracking failed:', error);
      // Remove from cache on error to allow retry
      trackingCache.delete(cacheKey);
    }
  };

  const getOrCreateSessionId = (): string => {
    try {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch (error) {
      // Fallback if sessionStorage is not available
      return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
  };

  return { trackActivity };
};